import React, { useEffect, useState } from 'react';
import socket from './Socket'
function FileTabs({ openFiles,setOpenFiles, activeFile, setActiveFile }) {
    // Function to handle the close button click
    const [isProcessingServerUpdate, setIsProcessingServerUpdate] = useState(false);

    const closeFile = (file) => {
        
        if(file!=activeFile)
            {
                setOpenFiles(prev=>{
                        const updatedFiles = prev.filter((f) => f !== file);
                        // console.log(updatedFiles); // For debugging
                        return updatedFiles;
                    }
                )

        }
        else
        {
            setOpenFiles(prev=>{
                const updatedFiles = prev.filter((f) => f !== file);
                const currentIndex = prev.indexOf(file);
                const newActiveFile = updatedFiles[currentIndex] || updatedFiles[currentIndex - 1] || ''; 
                setActiveFile(newActiveFile);
                return updatedFiles
            })
            

        }

       
    };
    useEffect(() => {
        const handleServerUpdate = (openFilesNew) => {
            function arraysEqual(arr1, arr2) {
                if (arr1.length !== arr2.length) return false;
                return arr1.every((item, index) => item === arr2[index]);
            }

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
    return (
        <div className="file-tabs">
            {openFiles.map((file) => (
                <div className="tab" key={file}>
                    <div
                        key={file}
                        className={`file-tab ${file === activeFile ? 'active' : ''}`}
                        onClick={() => setActiveFile(file)}
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
