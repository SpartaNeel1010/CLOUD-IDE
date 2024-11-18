import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProjectProvider } from './context/ProjectContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import LoginPage from './components/LoginPage';
import Navbar from './components/NavBar';
import CloudIDE from './CloudIDE';
import Dashboard from './components/Dashboard';

function MainApp() {
  
 

  return (
    <AuthProvider>
    <ProjectProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Navbar />
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/project"
            element={
              <ProtectedRoute>
                <Navbar  />
                <CloudIDE />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </ProjectProvider>
    </AuthProvider>
  );
}

export default MainApp;
