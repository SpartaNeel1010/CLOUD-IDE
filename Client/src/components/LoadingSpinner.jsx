import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 'medium' }) => {
  return (
    <div className={`spinner-container ${size}`}>
      <div className="spinner"></div>
    </div>
  );
};

export default LoadingSpinner;