import React, { useState } from 'react';
import './FileTree.css'

function FileTree({tree, path, activePath, setActivePath, openPaths, setOpenPaths, openFiles, setOpenFiles, activeFile, setActiveFile }) {
    return (
        <div >
            {Object.keys(tree).map((key) => (
                <FileNode key={key} 
                          path={path + "/" + key} 
                          name={key} 
                          node={tree[key]} 

                          activePath={activePath} 
                          setActivePath={setActivePath} 
                          openFiles={openFiles} 
                          setOpenFiles={setOpenFiles} 
                          activeFile={activeFile} 
                          setActiveFile={setActiveFile}
                          setOpenPaths={setOpenPaths}
                          openPaths={openPaths} />
            ))}
        </div>
    );
}


function FileNode({ path, name, activePath, setActivePath,setOpenPaths,openPaths, node, openFiles, setOpenFiles, activeFile, setActiveFile }) {
   
    const [isOpen, setIsOpen] = useState(false);

    
    const isFolder = !(node === null)

    const toggleOpen = (event) => {
        if (!isFolder) {

            const targetElement = event.target
           
            const spans = targetElement.querySelectorAll("span");
            

            let fileName, path;
            if (spans.length == 0) {
                fileName = targetElement.innerText
                path=targetElement.parentElement.getAttribute('path')
            }

            else
            {
                fileName = spans[1].innerText
                path=targetElement.getAttribute('path')
            }
            
            if (!openFiles.includes(fileName)) {
                setOpenFiles(prev => [...prev, fileName])
                setOpenPaths(prev => [...prev, path])
                

            }
            setActiveFile(fileName)
            setActivePath(path)
        }

        setIsOpen(!isOpen);
    };
    

    return (
        <div className='file'>
            <div onClick={toggleOpen} className="eachFile" path={path} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                {isFolder ? (
                    <span style={{ marginRight: '5px' }} path={path} >{isOpen ? '📂' : '📁'}</span>
                ) : (
                    <span style={{ marginRight: '5px' }} path={path} >📄</span>
                )}
                <span>{name}</span>
            </div>

            {isFolder && isOpen && (
                <div style={{ paddingLeft: '15px' }} >
                    <FileTree tree={node} 
                              path={path} 
                              activePath={activePath} 
                              setActivePath={setActivePath} 
                              openFiles={openFiles} 
                              setOpenFiles={setOpenFiles} 
                              activeFile={activeFile} 
                              setActiveFile={setActiveFile}
                              setOpenPaths={setOpenPaths}
                              openPaths={openPaths} />
                </div>
            )}
        </div>
    );
}

export default FileTree;
