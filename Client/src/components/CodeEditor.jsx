import React, { useEffect, useState, useRef, useCallback } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { useMonaco } from "@monaco-editor/react";
import debounce from 'lodash/debounce';
import socket from './Socket.js';

const CodeEditor = ({ activeFile, setActiveFile, language = "javascript", theme = "vs-dark" }) => {
  const monaco = useMonaco();
  const editorRef = useRef(null);
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Fetch file data when activeFile changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await fetch("http://localhost:3000/files/getdata", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ "filename": activeFile })
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setCode(data.content);
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };

    if (activeFile === '')
      setCode('')
    else
      fetchData();
  }, [activeFile]);

  // Socket event handlers
  useEffect(() => {
    const handleFileChange = (data) => {
      if (activeFile !== data) {
        setActiveFile(data);
      }
    };

    const handleCodeUpdate = (data) => {
      setCode(data);
    };

    socket.on('active-file:change-received', handleFileChange);
    socket.on('code:data', handleCodeUpdate);

    socket.emit('active-file:change', activeFile);

    return () => {
      socket.off('active-file:change-received', handleFileChange);
      socket.off('code:data', handleCodeUpdate);
    };
  }, [activeFile, setActiveFile]);

  // Function to get text around cursor for context
  const getTextAroundCursor = (editor, tokenCount = 30) => {
    const model = editor.getModel();
    const position = editor.getPosition();
    
    // Get current line content
    const lineContent = model.getLineContent(position.lineNumber);
    
    // Get previous lines for context
    const startLine = Math.max(1, position.lineNumber - 3);
    let contextLines = [];
    
    for (let i = startLine; i <= position.lineNumber; i++) {
      contextLines.push(model.getLineContent(i));
    }
    
    return {
      prefix: contextLines.join('\n'),
      currentLine: lineContent,
      position: position
    };
  };

  // Function to fetch completions from OpenAI
  const fetchCompletions = async (text) => {
    try {
      const response = await fetch('http://localhost:3000/completion/get_code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: text,
          max_tokens: 50,
          temperature: 0.7,
          model: "gpt-3.5-turbo"
        }),
      });
      
      const data = await response.json();
      return data.choices[0]?.text || '';
    } catch (error) {
      console.error('Error fetching completions:', error);
      return '';
    }
  };

  // Debounced completion handler
  const debouncedCompletions = useCallback(
    debounce(async (editor) => {
      if (!editor || isLoading || !monaco) return;
      
      setIsLoading(true);
      const { prefix, position } = getTextAroundCursor(editor);
      
      try {
        const completion = await fetchCompletions(prefix);
        
        if (completion) {
          // Register inline completion provider
          monaco.languages.registerInlineCompletionItemProvider(language, {
            provideInlineCompletionItems: (model, position, context) => {
              return {
                items: [{
                  insertText: completion,
                  range: {
                    startLineNumber: position.lineNumber,
                    startColumn: position.column,
                    endLineNumber: position.lineNumber,
                    endColumn: position.column + completion.length
                  }
                }],
                enableForwardStability: true
              };
            },
            freeInlineCompletions: () => {}
          });
        }
      } catch (error) {
        console.error('Completion error:', error);
      } finally {
        setIsLoading(false);
      }
    }, 1000),
    [monaco, isLoading, language]
  );

  // Editor change handler
  const handleEditorChange = (value) => {
    setCode(value);
    socket.emit('code:write', value);
    
    // Trigger completion if we have an editor reference
    if (editorRef.current) {
      debouncedCompletions(editorRef.current);
    }
  };

  return (
    <MonacoEditor
      height="60vh"
      language={language}
      theme={theme}
      value={code}
      onChange={handleEditorChange}
      onMount={(editor) => {
        editorRef.current = editor;
      }}
      options={{
        selectOnLineNumbers: true,
        automaticLayout: true,
        inlineSuggest: {
          enabled: true,
          mode: "prefix"
        },
        quickSuggestions: true,
        suggestOnTriggerCharacters: true
      }}
    />
  );
};

export default CodeEditor;