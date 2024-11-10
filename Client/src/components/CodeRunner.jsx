import React, { useState } from 'react';
import axios from 'axios';
import './CodeRunner.css';

const CodeRunner = ({ activePath }) => {
    const [output, setOutput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRun = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:3000/files/runcode', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    path: activePath,
                    language: 'javascript'
                }),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const result = await response.json();

            setOutput(result.output);
        } catch (error) {
            setOutput(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="coderun">
            
            <button  onClick={handleRun} disabled={loading} className="run-button">
                <span>Run</span>
                <span className="play-icon">▶</span>
            </button>

            <div className="output">
                {output || "Code Output will appear here..."}
            </div>
        </div>
    );
};

export default CodeRunner;
