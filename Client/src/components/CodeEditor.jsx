import React, { useEffect, useState, useRef, useCallback } from 'react';
import MonacoEditor from '@monaco-editor/react';

import ChatWidget from './ChatWindow';
import { useSearchParams } from 'react-router-dom';

const CodeEditor = ({ socket,activePath, setActivePath, activeFile, setActiveFile, language = "javascript", theme = "vs-dark" }) => {

  const [code, setCode] = useState('');

  const [searchparams]=useSearchParams()
  const projID=searchparams.get("projID")

  // Whenever active path changes it updates the code by fetching it from backend server endpoint 
  useEffect(() => {

    const fetchData = async () => {
      try {
        let response = await fetch(`http://${projID}.vedant-neel-aarav.site/files/getdata`, {
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
    if (activeFile === '')
      setCode('')
    else
      fetchData();
  }, [activePath])


  // Save Code Whenever user pauses for 3000ms 
  useEffect(() => {

    const timer = setTimeout(() => {
      socket.emit('save:code', {
        path: activePath,
        code: code
      })

    }, 1000)
    return () => {
      clearTimeout(timer)
    }

  }, [code])


  // ------------Socket code-------------------

  // Listens for active file change events from backend and changes the activepath
  socket.on('active-file:change-received', (data) => {
    if (activeFile !== data)
      setActiveFile(data)

  })
  // Whenever active file changes it sends data to the server using socket
  useEffect(() => {
    socket.emit('active-file:change', activeFile)
  }, [activeFile])

  // Listens for active path change events from backend and changes the activepath
  socket.on('active-path:change-received', (data) => {
    if (activePath !== data) setActivePath(data);
  });

  // Whenever active path changes it sends data to the server using socket
  useEffect(() => {
    socket.emit('active-path:change', activePath);
  }, [activePath]);


  // Listens for code change events from backend and changes the code
  socket.on('code:data', (data) => {
    setCode(data)
  })
  // Fires whenever user types in the code editor and updates the code
  const handleEditorChange = (value) => {
    setCode(value)
    // Sends the updated code to the backend
    socket.emit('code:write', value)
  };
  // ----------------Socket code end-------------------------
  return (

    <>
      <MonacoEditor
        height="60vh"
        language={language}
        theme={theme}
        value={code}
        onChange={handleEditorChange}


      />
      <ChatWidget code={code} />
    </>


  );
};

export default CodeEditor;