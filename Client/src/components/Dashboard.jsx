import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import { ProjectContext } from '../context/ProjectContext';
import LoadingSpinner from './LoadingSpinner.jsx';

function Dashboard({ }) {
  const navigate = useNavigate();

  const { projects, getAllprojects } = useContext(ProjectContext)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [replName, setReplName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(false);
  
  const [isProjectLoading, setisProjectLoading] = useState(false)


  const handleProjectClick = async (project) => {

    const token = localStorage.getItem('authToken')
    console.log(token)


    // Step 3: Decode the payload (second part of JWT) using base64
    const payloadBase64 = token.split('.')[1]; // The second part of the token
    const user = JSON.parse(atob(payloadBase64));





    setisProjectLoading(true);
    try {
      const response = await fetch(`https://resproven-service-640388342610.us-central1.run.app/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userID: user._id,
          projID: project.url
        })
      });

      if (!response.ok) {
        throw new Error('Failed to delete project');
      }
    }
    catch (e) {
      console.log(e)
    }
    


    setisProjectLoading(false);
    navigate(`/project/?projID=${project.url}`);
  };
  const handleDelete = async (project) => {
    // Prevent triggering the list item click
    setIsDeleting(true);
    setError(false);
    const auth_token = localStorage.getItem('authToken')
    console.log(project)
    // return;
    try {
      const response = await fetch(`https://auth-image-640388342610.us-central1.run.app/project/deleteproject/${project._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': auth_token
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete project');
      }
      
      getAllprojects()

    } catch (err) {
      console.error('Error deleting project:', err);
      setError(true);
    }
    finally{
      setIsDeleting(false)
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const auth_token = localStorage.getItem('authToken')
    if (!auth_token)
      return

    try {
      const response = await fetch('https://auth-image-640388342610.us-central1.run.app/project/createproject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': auth_token
        },
        body: JSON.stringify({ title: replName }),
      });

      if (response.ok) {
        setReplName('');
        setIsModalOpen(false);
        // Handle success (e.g., show notification, refresh list, etc.)
      } else {
        throw new Error('Failed to create repl');
      }
    } catch (error) {
      console.error('Error creating repl:', error);
      // Handle error (e.g., show error message)
    } finally {
      getAllprojects();
      setIsLoading(false);
    }
  }
  const handleOverlayClick = (e) => {
    if (e.target.className === 'modal-overlay2') {
      setIsModalOpen(false);
    }
  };



  useEffect(() => {
    getAllprojects()
  }, [])

  return (

    <div className="dashboard">
      {
        isProjectLoading? <LoadingSpinner/>:
        <div className="repl-agent-section">
          <div className="header">
            <button
              className="create-repl-btn"
              onClick={() => setIsModalOpen(true)}
            >
              Create Project
            </button>

            {isModalOpen && (
              <div className="modal-overlay2" onClick={handleOverlayClick}>
                <div className="modal2">
                  <div className="modal-header">
                    <h2>Create New Project</h2>
                    <button
                      className="close-button"
                      onClick={() => setIsModalOpen(false)}
                    >
                      ×
                    </button>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label htmlFor="replName">Project Name</label>
                      <input
                        id="replName"
                        type="text"
                        value={replName}
                        onChange={(e) => setReplName(e.target.value)}
                        placeholder="Enter Project Name"
                        required
                        autoFocus
                      />
                    </div>

                    <div className="form-actions">
                      <button
                        type="button"
                        className="cancel-btn"
                        onClick={() => setIsModalOpen(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="submit-btn"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Creating...' : 'Create Project'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
          <ul className="project-list">
            {projects.map((project, index) => (
              <li
                key={project.url}
                className={`project-list-item ${index % 2 === 0 ? 'stripe-dark' : ''
                  } ${isDeleting ? 'deleting' : ''} ${error ? 'error' : ''}`}
                onClick={() => handleProjectClick(project)}
              >
                <span className="project-title">{project.title}</span>
                <button
                  className="delete-button"
                  project={project}
                  onClick={(e) => { e.stopPropagation(); handleDelete(project) }}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    'Deleting...'
                  ) : (
                    <>
                      <svg
                        className="delete-icon"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      }
    </div>

  );
}

export default Dashboard;
