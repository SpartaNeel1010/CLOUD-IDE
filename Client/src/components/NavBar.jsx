import React, { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './NavBar.css';
import { AuthContext } from '../context/AuthContext';
import { useSearchParams } from 'react-router-dom';

const Navbar = ({ selectedProjectName }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const modalRef = useRef(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const location = useLocation().pathname;
  const isProjectTab = location.includes("project");

  const [searchParams] = useSearchParams();
  const projID = searchParams.get('projID') ?? '';

  const [projectName, setProjectName] = useState('');
  const fetchProject = async () => {
    if (!projID) return;
    try {
      const response = await fetch(`https://auth-image-640388342610.us-central1.run.app/project/fetchprojectname/${projID}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setProjectName(data.title);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [projID]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsInviteModalOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const deleteResources = async () => {
    try {
      const response = await fetch(`https://resproven-service-640388342610.us-central1.run.app/disconnect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userID: user._id,
          projID: projID,
        }),
      });

      if (response.ok) {
        const data = await response.text();
        console.log(data);
      } else {
        const error = await response.text();
        console.error(`Error: ${error}`);
      }
    } catch (error) {
      console.error(`Network error: ${error.message}`);
    }
  };

  const handleHomeClick = async () => {
    deleteResources();
    navigate("/");
  };

  const handleInviteClick = () => {
    setIsInviteModalOpen(true);
  };

  const handleCopyLink = () => {
    const link = `Sign up or login to your account to collaborate with friends 💻\n${window.location.href}`;
  
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(link)
        .then(() => {
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 2000); // Hide the confirmation after 2 seconds
        })
        .catch(err => {
          console.error('Failed to copy text: ', err);
        });
    } else {
      // Fallback method using document.execCommand
      const textArea = document.createElement('textarea');
      textArea.value = link;
      textArea.style.position = 'fixed'; // Prevent scrolling to the bottom of the page
      textArea.style.opacity = '0'; // Hide the element
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
  
      try {
        document.execCommand('copy');
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000); // Hide the confirmation after 2 seconds
      } catch (err) {
        console.error('Fallback: Failed to copy text: ', err);
      }
  
      document.body.removeChild(textArea);
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <button className="nav-button" onClick={() => handleHomeClick()}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </button>

        {isProjectTab && (
          <div className="project-label">
            <span className="project-name">{projectName}</span>
          </div>
        )}
      </div>

      <div className="nav-right">
        {isProjectTab && (
          <button className="nav-button-text run-button" onClick={handleInviteClick}>Invite</button>
        )}

        <div className="dropdown-container" ref={dropdownRef}>
          <div className="username-wrapper" onClick={() => setIsOpen(!isOpen)}>
            <span className="username-name">{user}</span>
            <div className="username-icon">
              {user.charAt(0).toUpperCase()}
            </div>
          </div>

          {isOpen && (
            <div className="dropdown-menu">
              <button onClick={() => setIsOpen(false)} className="dropdown-item">View Profile</button>
              <button onClick={() => setIsOpen(false)} className="dropdown-item">Previous Projects</button>
              <div className="dropdown-divider" />
              <button onClick={() => {
                deleteResources();
                logout();
                setIsOpen(false);
                navigate("/login");
              }} className="dropdown-item logout-button">Logout</button>
            </div>
          )}
        </div>
      </div>

      {isInviteModalOpen && (
        <div className="modal-overlay">
          <div className="modal" ref={modalRef}>
            <h2>Sign up or login to your account to collaborate with friends 💻</h2>
            <p>{window.location.href}</p>
            <button className="copy-button" onClick={handleCopyLink}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                <path d="M8 3h9a2 2 0 012 2v13h-2V5H8V3zm7 5H5a2 2 0 00-2 2v11a2 2 0 002 2h10a2 2 0 002-2V10a2 2 0 00-2-2zm-8 2h7v9H7v-9z" />
              </svg>
              <span style={{ marginLeft: '6px' }}></span>
            </button>

            {/* Show a confirmation message when the link is copied */}
            {copySuccess && <div className="copy-success">Link copied to clipboard!</div>}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;