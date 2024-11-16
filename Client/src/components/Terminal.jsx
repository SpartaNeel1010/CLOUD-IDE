import React,{useRef,useState,useEffect} from 'react'
import { Terminal  as XTerminal} from "xterm";
import "xterm/css/xterm.css";

function Terminal({socket}) {

    const xtermRef=useRef(null)
    const xterm=useRef()
    const isRendered=useRef(false)
    useEffect(()=>{
        if(isRendered.current)
            return;
        isRendered.current=true

        xterm.current= new XTerminal({
            rows: 25,
            cols: 80,
            cursorBlink: true,
            theme: {
              background: "#1e1e1e", // Background color
            },
          })
        xterm.current.open(xtermRef.current)
        socket.emit("terminal:write", "\n");
        socket.on('terminal:data',(data)=>{
            console.log(data)
            xterm.current.write(data)
        })
        xterm.current.onData((data) => {
            console.log(data)
            socket.emit("terminal:write", data);
          });

    },[])
    


  return (
    <div ref={xtermRef} id="Terminal"></div>
  )
}

export default Terminal