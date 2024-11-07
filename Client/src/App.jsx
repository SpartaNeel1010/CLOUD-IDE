import React ,{useEffect, useState}from 'react'
import Terminal from './components/Terminal'
import CodeEditor from './components/CodeEditor'
import FileOperations from './components/FileOperations'
import FileTree from './components/FileTree'
import FileTabs from './components/FileTabs'
import './App.css'

function App() {

    // For Terminal resizing not necessary to understand --- start
    const [editorWidth, setEditorWidth] = useState(80);  // Width percentage of CodeEditor
    const [terminalHeight, setTerminalHeight] = useState(30);  // Height percentage of Terminal
    const [isResizingEditor, setIsResizingEditor] = useState(false);
    const [isResizingTerminal, setIsResizingTerminal] = useState(false);
    const handleMouseDownEditor = () => setIsResizingEditor(true);
    const handleMouseDownTerminal = () => setIsResizingTerminal(true);
    // For Terminal resizing not necessary to understand --- end

    const [openFiles, setOpenFiles] = useState(['one.js']);
    const [activeFile, setActiveFile] = useState('one.js');
    const [activePath,setActivePath]=useState('/one.js')
    const [openPaths, setOpenPaths] = useState(['/one.js']);
    const [fileTree,setFileTree]=useState({})


    useEffect(()=>{
        const fetchData = async () => {
            try {
              let response = await fetch("http://localhost:3000/files/getallfiles");
        
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
        
              const data = await response.json();
              
              setFileTree(data)

            } catch (error) {
              console.error('Fetch error:', error);
            }
          };
        
          fetchData();
        },[])

    // For Terminal resizing not necessary to understand --- start
    const handleMouseMove = (e) => {
        if (isResizingEditor) {

            const editorContainer = document.querySelector('.editor-container');
            const editorContainerLeft = editorContainer.getBoundingClientRect().left;
            const newEditorWidth = ((e.clientX - editorContainerLeft) / window.innerWidth) * 100;
    
            if (newEditorWidth > 20 && newEditorWidth < 80) {
                setEditorWidth(newEditorWidth);
            }
        } else if (isResizingTerminal) {
            const newTerminalHeight = ((window.innerHeight - e.clientY) / window.innerHeight) * 100;
            if (newTerminalHeight > 10 && newTerminalHeight < 50) {
                setTerminalHeight(newTerminalHeight);
            }
        }
    };
    
    

    const handleMouseUp = () => {
        setIsResizingEditor(false);
        setIsResizingTerminal(false);
    };

    React.useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizingEditor, isResizingTerminal]);

    // For Terminal resizing not necessary to understand --- end

    return (
        <div className="playground">
            <div className="upper" style={{ height: `${100 - terminalHeight}%` }}>
                <div className="files">
                    <FileOperations></FileOperations>
                    <div className="fileNames">
                    <FileTree tree={fileTree} 
                              path="" 
                              activePath={activePath} 
                              setActivePath={setActivePath} 
                              openFiles={openFiles} 
                              setOpenFiles={setOpenFiles} 
                              activeFile={activeFile} 
                              setActiveFile={setActiveFile} 
                              setOpenPaths={setOpenPaths}
                              openPath={openPaths}/>
                    </div>
                </div>
                
                
                <div className="divider-vertical" onMouseDown={handleMouseDownEditor}></div>
               
               
                <div className="editor-container" style={{ width: `${editorWidth}%` }}>
                    <FileTabs
                        openFiles={openFiles}
                        setOpenFiles={setOpenFiles}
                        activeFile={activeFile}
                        setActiveFile={setActiveFile}
                        setActivePath={setActivePath}
                        activePath={activePath}
                        setOpenPaths={setOpenPaths}
                        openPaths={openPaths}
                    />
                    <CodeEditor
                        // key={activeFile}  
                        activePath={activePath}
                        setActivePath={setActivePath}
                        setActiveFile={setActiveFile}
                        activeFile={activeFile}
                        language="javascript"
                        theme="vs-dark"
                    />
                </div>
            </div>
           
           
            <div className="divider-horizontal" onMouseDown={handleMouseDownTerminal}></div>
           
           
            <div className="terminal" style={{ height: `${terminalHeight}%` }}>
            <Terminal />
            </div>
        </div>
    );
}

export default App




