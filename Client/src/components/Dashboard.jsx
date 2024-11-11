import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();

  // Sample projects list (replace this with real data fetching logic)
  const projects = [
    { id: '1', name: 'Local landmarks map' },
    { id: '2', name: 'Stock analysis' },
    { id: '3', name: 'Waitlist website' },
    { id: '4', name: 'Two Sum' },
    { id: '5', name: 'Add Two Numbers' }
  ];

  const handleProjectClick = (projectId) => {
    navigate(`/project/${projectId}`);
  };

  return (
    <div className="dashboard">
      <div className="repl-agent-section">
        <div className="header">
          <button className="create-repl-btn">+ Create Repl</button>
        </div>
        <ul className="project-list">
          {projects.map((project, index) => (
            <li
              key={project.id}
              className={`project-item ${index % 2 === 0 ? 'even' : 'odd'}`}
              onClick={() => handleProjectClick(project.id)}
            >
              {project.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;
