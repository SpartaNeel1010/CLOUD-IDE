
import React,{useEffect, useState} from 'react';
import MonacoEditor from '@monaco-editor/react';
import socket from './Socket.js';
const CodeEditor = ({activePath,setActivePath,activeFile,setActiveFile, language = "javascript", theme = "vs-dark" }) => {
    
  
    // code Displayed in the editor
    const [code, setCode] = useState();

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

    // ----------------Socket code end-------------------------


    // Listens for code change events from backend and changes the code
    socket.on('code:data',(data)=>{
        setCode(data)
    })
    // Fires whenever user types in the code editor and updates the code
    const handleEditorChange = (value) => {
        setCode(value)
        // Sends the updated code to the backend
        socket.emit('code:write',value)
    };
     // ----------------Socket code end-------------------------


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
