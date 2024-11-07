import React, { useEffect, useState, useRef, useCallback } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { useMonaco } from "@monaco-editor/react";
import debounce from 'lodash/debounce';
import socket from './Socket.js';

const CodeEditor = ({activePath,setActivePath,activeFile,setActiveFile, language = "javascript", theme = "vs-dark" }) => {  const monaco = useMonaco();
  const editorRef = useRef(null);
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

    // Whenever active path changes it updates the code by fetching it from backend server endpoint 'http://localhost:3000/files/getdata'
    useEffect(() => {

      const fetchData = async () => {
        try {
          let response = await fetch("http://localhost:3000/files/getdata", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ "filename": activePath })
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
      if(activeFile==='')
        setCode('')
      else
        fetchData();
    },[activePath])
   
    useEffect(()=>{
      
         const timer= setTimeout(()=>{
          socket.emit('save:code',{
            path:activePath,
            code:code
          })

         },3000)
         return ()=>{
          clearTimeout(timer)
         }
      
    },[code])


    // ------------Socket code-------------------

    // Listens for active file change events from backend and changes the activepath
    socket.on('active-file:change-received',(data)=>{
      if(activeFile!==data)
        setActiveFile(data)
      
    })
    // Whenever active file changes it sends data to the server using socket
    useEffect(()=>{
      socket.emit('active-file:change',activeFile)
    },[activeFile])
  
    // Listens for active path change events from backend and changes the activepath
    socket.on('active-path:change-received', (data) => {
      if (activePath !== data) setActivePath(data);
    });

    // Whenever active path changes it sends data to the server using socket
    useEffect(() => {
        socket.emit('active-path:change', activePath);
    }, [activePath]);


    // Listens for code change events from backend and changes the code
    socket.on('code:data',(data)=>{
        setCode(data)
    })
    // Fires whenever user types in the code editor and updates the code
    const handleEditorChange = (value) => {
        setCode(value)
        // Sends the updated code to the backend
        socket.emit('code:write',value)
        if (editorRef.current) {
          debouncedCompletions(editorRef.current);
        }
    };
     // ----------------Socket code end-------------------------

  // Fetch file data when activeFile changes
  



  
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
      console.log(data)
      return data || '';
    } catch (error) {
      console.error('Error fetching completions:', error);
      return '';
    }
  };

  // Debounced completion handler
  const debouncedCompletions = useCallback(
    debounce(async (editor) => {
      if (!editor || isLoading || !monaco ) return;
      
      setIsLoading(true);
      const { prefix, position } = getTextAroundCursor(editor);
      
      try {
        const completion = await fetchCompletions(prefix);
        setCode(prev => prev+completion)
        
        // if (completion) {
        //   // Register inline completion provider
        //   monaco.languages.registerInlineCompletionItemProvider(language, {
        //     provideInlineCompletionItems: (model, position, context) => {
        //       return {
        //         items: [{
        //           insertText: completion,
        //           range: {
        //             startLineNumber: position.lineNumber,
        //             startColumn: position.column,
        //             endLineNumber: position.lineNumber,
        //             endColumn: position.column + completion.length
        //           }
        //         }],
        //         enableForwardStability: true
        //       };
        //     },
        //     freeInlineCompletions: () => {}
        //   });
        // }
      } catch (error) {
        console.error('Completion error:', error);
      } finally {
        setIsLoading(false);
      }
    }, 3000),
    [monaco, isLoading, language]
  );

  // Editor change handler
  

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