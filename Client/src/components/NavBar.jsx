import React, { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import './NavBar.css';
import { AuthContext } from '../context/AuthContext';
import { ProjectContext } from '../context/ProjectContext';
import { useSearchParams } from 'react-router-dom'

const Navbar = ({ selectedProjectName }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const location = useLocation().pathname;

  const isProjectTab = location.includes("project");

  const [searchParams] = useSearchParams();
  const projID = searchParams.get('projID') ?? '';

  const [projectName, setprojectName] = useState('')
  const fetchProject = async () => {
    if(!projID)
      return
    try {
      const response = await fetch(`https://auth-image-640388342610.us-central1.run.app/project/fetchprojectname/${projID}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setprojectName(data.title);
    } 
    catch (err) {
      console.log(err)
    } 
  }
  
  fetchProject()
  
  


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  
  // const deleteAllThing = async()=>{
  //   try {
  //     const response = await fetch(`http://${projID}.vedant-neel-aarav.site/files/deleteallthing`, {
  //       method: 'DELETE', // HTTP method for deletion
  //       headers: {
  //         'Content-Type': 'application/json', // Specify content type
  //       },
  //     });

  //     // Check if the response is successful (status code 2xx)
  //     if (response.ok) {
  //       const data = await response.text();
  //       console.log(data); // Success message from server
  //     } else {
  //       const error = await response.text();
  //       console.error(`Error: ${error}`); // Error message from server
  //     }
  //   } catch (error) {
  //     console.error(`Network error: ${error.message}`);
  //   }

  // }
  const deleteResources = async()=>{
    try {
      const response = await fetch(`https://resproven-service-640388342610.us-central1.run.app/disconnect`, {
        method: 'POST', // HTTP method for deletion
        headers: {
          'Content-Type': 'application/json', // Specify content type
        },
        body: JSON.stringify({
          userID: user._id,
          projID: projID
        })

      });

      // Check if the response is successful (status code 2xx)
      if (response.ok) {
        const data = await response.text();
        console.log(data); // Success message from server
      } else {
        const error = await response.text();
        console.error(`Error: ${error}`); // Error message from server
      }
    } catch (error) {
      console.error(`Network error: ${error.message}`);
    }

  }
  const handleHomeClick = async () => {
    // deleteAllThing()
    deleteResources();
    navigate("/")

  }
  return (
    <nav className="navbar">
      <div className="nav-left">
        {/* Home Icon */}
        <button className="nav-button" onClick={() => handleHomeClick()}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </button>

        {/* Project Label - Only shown if a project is selected */}
        {isProjectTab && (
          <div className="project-label">
            <span className="project-name">{projectName}</span>
          </div>
        )}
      </div>

      <div className="nav-right">
        {/* Invite Button - Only shown if a project is selected */}
        {isProjectTab && (
          <button className="nav-button-text run-button">Invite</button>
        )}

        <div className="dropdown-container" ref={dropdownRef}>
          <div
            className="username-wrapper"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="username-name">{user}</span>
            <div className="username-icon">
              {user.charAt(0).toUpperCase()}
            </div>
          </div>

          {isOpen && (
            <div className="dropdown-menu">
              <button
                onClick={() => {
                  // onProfileClick();
                  setIsOpen(false);
                }}
                className="dropdown-item"
              >
                View Profile
              </button>
              <button
                onClick={() => {
                  // onProjectsClick();
                  setIsOpen(false);
                }}
                className="dropdown-item"
              >
                Previous Projects
              </button>
              <div className="dropdown-divider" />
              <button
                onClick={() => {
                  deleteResources();
                  logout();
                  setIsOpen(false);
                  navigate("/login")
                }}
                className="dropdown-item logout-button"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
