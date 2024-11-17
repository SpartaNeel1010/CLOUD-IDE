import React, { useState } from 'react';
import './FileOps.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useSearchParams } from 'react-router-dom';

function FileOperations({ setFileTree, upadteFileTree }) {
    const [showInput, setShowInput] = useState(false);
    const [inputType, setInputType] = useState(''); // 'file' or 'folder'
    const [inputValue, setInputValue] = useState('');

    const handleButtonClick = (type) => {
        setShowInput(!showInput);
        setInputType(type);
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };
    const [searchparams]=useSearchParams()
    const projID=searchparams.get("projID")
    const fetchData = async () => {
        try {
            let response = await fetch(`http://${projID}.vedant-neel-aarav.site/files/getallfiles`);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            setFileTree(data)

        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    const handleSubmit = () => {
        if (inputValue.trim()) {
            // Send request to backend based on the type
            const endpoint = inputType === 'file' ? '/create-file' : '/create-folder';
            fetch(`http://${projID}.vedant-neel-aarav.site/files` + endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: inputValue })
            })
                .then(response => response.json())
                .then(async (data) => {
                    console.log(`${inputType} created successfully:`, data);
                    // Optionally clear the input and hide it
                    setInputValue('');
                    setShowInput(false);
                    await fetchData();

                })
                .catch(error => console.error(`Error creating ${inputType}:`, error));
        }
    };

    return (
        <>
            <div className="file-operation">
                <button type="button" className="btn addfile-btn" onClick={() => handleButtonClick('file')}>
                    + <i className="fas fa-file"></i>
                </button>
                <button type="button" className="btn addfolder-btn" onClick={() => handleButtonClick('folder')}>
                    + <i className="fas fa-folder"></i>
                </button>
                <button type="button" className="btn reload-btn" onClick={upadteFileTree}>
                    <i className="fas fa-sync-alt"></i>
                </button>
            </div>
            {showInput && (
                <div className="input-container">
                    <input
                        type="text"
                        placeholder={`Enter ${inputType} name...`}
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        className="input-field"
                    />
                    <button type="button" className="submit-btn" onClick={handleSubmit}>
                        Submit
                    </button>
                </div>
            )}
        </>
    );
}

export default FileOperations;
