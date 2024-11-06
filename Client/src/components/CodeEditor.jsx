// CodeEditor.js
import React,{useEffect, useState} from 'react';
import MonacoEditor from '@monaco-editor/react';
import socket from './Socket.js';
const CodeEditor = ({activeFile,setActiveFile, language = "javascript", theme = "vs-dark" }) => {
    
    const [code, setCode] = useState();

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
      if(activeFile==='')
        setCode('')
      else
        fetchData();
    },[activeFile])



    socket.on('active-file:change-received',(data)=>{
      if(activeFile!=data)
      setActiveFile(data)

    })
    useEffect(()=>{
      socket.emit('active-file:change',activeFile)
    },[activeFile])



    socket.on('code:data',(data)=>{
        setCode(data)
    })
    const handleEditorChange = (value) => {
        setCode(value)
        // console.log(value)
        socket.emit('code:write',value)
    };


  return (
    <MonacoEditor
      height="60vh"
      language={language}
      theme={theme}
      value={code}
      onChange={handleEditorChange}
      options={{
        selectOnLineNumbers: true,
        automaticLayout: true,
      }}
    />
  );
};

export default CodeEditor;
