import React, { useState } from 'react';
import './FileTree.css'
// Recursive component to display file and folder structure
function FileTree({ tree,openFiles,setOpenFiles,activeFile,setActiveFile }) {
    return (
        <div >
            {Object.keys(tree).map((key) => (
                <FileNode key={key} name={key} node={tree[key]} openFiles={openFiles} setOpenFiles={setOpenFiles} activeFile={activeFile} setActiveFile={setActiveFile} />
            ))}
        </div>
    );
}

// Component to represent each file or folder node
function FileNode({ name, node,openFiles,setOpenFiles,activeFile,setActiveFile  }) {
    const [isOpen, setIsOpen] = useState(false);
    
    // Check if the node is a folder (object) or a file (null)
    const isFolder = !(node===null)

    const toggleOpen = (event) => {
        if(!isFolder)
        {

            const targetElement=event.target
            // console.log(targetElement)
            const spans = targetElement.querySelectorAll("span");
            // console.log(spans)
            let fileName
            if(spans.length==0)
                fileName=targetElement.innerText
            else
                fileName=spans[1].innerText
            // const fileName=spanElement.innerText;
            if(!openFiles.includes(fileName))
            {
                setOpenFiles(prev => [...prev, fileName])
    
            }
            setActiveFile(fileName)
        }
        setIsOpen(!isOpen);
    };
    // const handleFileClick=()=>{
        
    // }

    return (
        <div className='file'>
            <div onClick={toggleOpen} className= "eachFile"style={{ cursor:'pointer' , display: 'flex', alignItems: 'center' }}>
                {isFolder ? (
                    <span style={{ marginRight: '5px' }}>{isOpen ? '📂' : '📁'}</span>
                ) : (
                    <span style={{ marginRight: '5px' }} >📄</span>
                )}
                <span>{name}</span>
            </div>
            
            {isFolder && isOpen && (
                <div style={{ paddingLeft: '15px' }} >
                    <FileTree tree={node}  openFiles={openFiles} setOpenFiles={setOpenFiles} activeFile={activeFile} setActiveFile={setActiveFile} />
                </div>
            )}
        </div>
    );
}

export default FileTree;
