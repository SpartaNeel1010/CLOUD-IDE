import React, { useEffect, useState } from 'react';
import Terminal from './components/Terminal';
import CodeEditor from './components/CodeEditor';
import FileOps from './components/FileOps';
import FileTree from './components/FileTree';
import FileTabs from './components/FileTabs';
import './App.css';
import CodeRunner from './components/CodeRunner';
import "@assistant-ui/react/styles/index.css";
import "@assistant-ui/react/styles/modal.css"; 
import ChatWidget from './components/ChatWindow';


function App() {


    

    
    // State variables for dimensions
    const [fileTreeWidth, setFileTreeWidth] = useState(20); // Left sidebar (FileTree) width percentage
    const [editorWidth, setEditorWidth] = useState(60);  
    const [codeRunnerWidth, setCodeRunnerWidth] = useState(20); // Width percentage of CodeRunner
    const [terminalHeight, setTerminalHeight] = useState(30); // Bottom section (Terminal) height percentage

    // State variables for resizing state
    const [isResizingFileTree, setIsResizingFileTree] = useState(false);
    const [isResizingEditor, setIsResizingEditor] = useState(false);
    const [isResizingTerminal, setIsResizingTerminal] = useState(false);
    const [isResizingCodeRunner, setIsResizingCodeRunner] = useState(false);


    // State variables for file management
    const [openFiles, setOpenFiles] = useState(['one.js']);
    const [activeFile, setActiveFile] = useState('one.js');
    const [activePath, setActivePath] = useState('/one.js');
    const [openPaths, setOpenPaths] = useState(['/one.js']);
    const [fileTree, setFileTree] = useState({});

    // Fetch file tree on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:3000/files/getallfiles");
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                setFileTree(data);
            } catch (error) {
                console.error('Fetch error:', error);
            }
        };
        fetchData();
    }, []);

    // Handle resizing events
    const handleMouseDownFileTree = () => setIsResizingFileTree(true);
    const handleMouseDownEditor = () => setIsResizingEditor(true);
    const handleMouseDownTerminal = () => setIsResizingTerminal(true);
    

    const handleMouseMove = (e) => {
        if (isResizingFileTree) {
            // Adjust FileTree width
            const newWidth = (e.clientX / window.innerWidth) * 100;
            if (newWidth > 10 && newWidth < 40) {
                setFileTreeWidth(newWidth);
                setEditorWidth(100 - newWidth - 30); // Adjust Editor width based on new FileTree width
            }
        } else if (isResizingEditor) {
            // Adjust Editor width
            const editorContainer = document.querySelector('.editor-container');
            const editorLeft = editorContainer.getBoundingClientRect().left;
            const newEditorWidth = ((e.clientX - editorLeft) / window.innerWidth) * 100;
            if (newEditorWidth > 40 && newEditorWidth < 70) setEditorWidth(newEditorWidth);
        } else if (isResizingTerminal) {
            // Adjust Terminal height
            const newTerminalHeight = ((window.innerHeight - e.clientY) / window.innerHeight) * 100;
            if (newTerminalHeight > 10 && newTerminalHeight < 50) setTerminalHeight(newTerminalHeight);
        }
        else if (isResizingCodeRunner) {
            // Calculate new width for code-runner-div
            const newCodeRunnerWidth = ((window.innerWidth - e.clientX) / window.innerWidth) * 100;
            if (newCodeRunnerWidth > 10 && newCodeRunnerWidth < 50) {
                setCodeRunnerWidth(newCodeRunnerWidth);
            }
        }
    };

    const handleMouseUp = () => {
        setIsResizingFileTree(false);
        setIsResizingEditor(false);
        setIsResizingTerminal(false);
        setIsResizingCodeRunner(false);
    };

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizingFileTree, isResizingEditor, isResizingTerminal,isResizingCodeRunner]);

    return (
        <div className="playground">
            <div className="upper" style={{ height: `${100 - terminalHeight}%` }}>
                {/* FileTree and FileOps section */}
                <div className="files" style={{ width: `${fileTreeWidth}%` }}>
                    <FileOps setFileTree={setFileTree} />
                    <div className="fileNames">
                        <FileTree 
                            tree={fileTree} 
                            path="" 
                            activePath={activePath} 
                            setActivePath={setActivePath} 
                            openFiles={openFiles} 
                            setOpenFiles={setOpenFiles} 
                            activeFile={activeFile} 
                            setActiveFile={setActiveFile} 
                            setOpenPaths={setOpenPaths} 
                            openPath={openPaths}
                        />
                    </div>
                </div>

                {/* Divider for resizing FileTree */}
                <div className="divider-vertical" onMouseDown={handleMouseDownFileTree}></div>
                
                {/* Code Editor and Tabs section */}
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
                    <p style={{ padding: "1px", fontSize: "14px", marginTop: "1px", color: "green" }}>
                        {activePath && activePath.replaceAll("/", " > ")}
                    </p>
                    <CodeEditor
                        activePath={activePath}
                        setActivePath={setActivePath}
                        setActiveFile={setActiveFile}
                        activeFile={activeFile}
                        language="javascript"
                        theme="vs-dark"
                    />
                </div>

                
                <div className="divider-vertical" onMouseDown={handleMouseDownEditor}></div>

                
                <div className="code-runner-div" style={{ width: "25%" }}>
                    <CodeRunner activePath={activePath} />
                </div>
            </div>

            
            <div className="divider-horizontal" onMouseDown={handleMouseDownTerminal}></div>

            
            <div className="terminal" style={{ height: `${terminalHeight}%` }}>
                <Terminal />
            </div>
            <ChatWidget />

        </div>
    );
}

export default App;
