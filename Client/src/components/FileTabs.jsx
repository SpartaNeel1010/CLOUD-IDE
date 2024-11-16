import React, { useEffect, useState } from 'react';

function FileTabs({ socket,openFiles,setOpenFiles,openPaths,setOpenPaths,activePath, setActivePath, activeFile, setActiveFile }) {
    // Function to handle the close button click
    const [isProcessingServerUpdate, setIsProcessingServerUpdate] = useState(false);
    const [isProcessingServerUpdatePaths, setIsProcessingServerUpdatePaths] = useState(false);
    console.log(activePath)

    const closeFile = (file) => {
        const fileIndex = openFiles.indexOf(file);
        const filePath = openPaths[fileIndex];

        if (file !== activeFile) {
            setOpenFiles((prev) => prev.filter((f) => f !== file));
            setOpenPaths((prev) => prev.filter((_, index) => index !== fileIndex));
        } else {
            setOpenFiles((prev) => {
                const updatedFiles = prev.filter((f) => f !== file);
                const newActiveFile = updatedFiles[fileIndex] || updatedFiles[fileIndex - 1] || '';
                setActiveFile(newActiveFile);
                setActivePath(openPaths[openFiles.indexOf(newActiveFile)] || '');
                return updatedFiles;
            });

            setOpenPaths((prev) => prev.filter((_, index) => index !== fileIndex));
        }
    };
    function arraysEqual(arr1, arr2) {
        if (arr1.length !== arr2.length) return false;
        return arr1.every((item, index) => item === arr2[index]);
    }
    useEffect(() => {
        const handleServerUpdate = (openFilesNew) => {
            

            if (!arraysEqual(openFiles, openFilesNew)) {
                setIsProcessingServerUpdate(true);
                setOpenFiles(openFilesNew);
            }
        };

        socket.on('open-file:change-recieved', handleServerUpdate);

        return () => {
            socket.off('open-file:change-recieved', handleServerUpdate);
        };
    }, [openFiles, setOpenFiles]);

    // Emit changes to server
    useEffect(() => {
        if (!isProcessingServerUpdate) {
            socket.emit('open-files:change', openFiles);
        } else {
            setIsProcessingServerUpdate(false);
        }
    }, [openFiles]);

    useEffect(() => {
        
        const handleServerUpdatePaths = (openPathsNew) => {
            if (!arraysEqual(openPaths, openPathsNew)) {
                setIsProcessingServerUpdatePaths(true);
                setOpenPaths(openPathsNew);
            }
        };

        socket.on('open-paths:change-received', handleServerUpdatePaths);

        return () => {
            socket.off('open-paths:change-received', handleServerUpdatePaths);
        };
    }, [openPaths, setOpenPaths]);

    useEffect(() => {
        if (!isProcessingServerUpdatePaths) {
            socket.emit('open-paths:change', openPaths);
        } else {
            setIsProcessingServerUpdatePaths(false);
        }
    }, [openPaths]);


    return (
        <div className="file-tabs">
            {openFiles.map((file,index) => (
                <div className="tab" key={file}>
            
                    <div
                        key={file}
                        className={`file-tab ${file === activeFile ? 'active' : ''}`}
                        onClick={() => {
                            setActiveFile(file);
        
                            setActivePath(openPaths[index]);
                        }}
                    >
                        {file}
                    </div>
                    
                    <button
                        className="close-button"
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent triggering the file click event
                            closeFile(file);
                        }}
                    >
                        &times;
                    </button>
                </div>
            ))}
        </div>
    );
}

export default FileTabs;
