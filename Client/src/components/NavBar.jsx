import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ username, isProjectSelected }) => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="nav-left">
        {/* Home Icon */}
        <button className="nav-button" onClick={() => navigate('/')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </button>

        {/* Project Label - Only shown if a project is selected */}
        {isProjectSelected && (
          <div className="project-label">
            <span className="project-name">{username}</span>
          </div>
        )}
      </div>

      <div className="nav-right">
        {/* Search Button */}
        <button className="nav-button">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>

        {/* Invite Button */}
        <button className="nav-button-text run-button">Invite</button>

        <div className="username-label">
          <span className="username-name">{username}</span>
          <div className="username-icon">{username.charAt(0).toUpperCase()}</div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
