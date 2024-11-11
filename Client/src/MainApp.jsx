import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import LoginPage from './components/LoginPage';
import Navbar from './components/Navbar';
import CloudIDE from './CloudIDE';
import Dashboard from './components/Dashboard';

function MainApp() {
  const [isProjectSelected, setIsProjectSelected] = useState(false);
  // const username = "YourUsername"; 

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Navbar isProjectSelected={isProjectSelected} />
                <Dashboard setIsProjectSelected={setIsProjectSelected} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/project/:projectId"
            element={
              <ProtectedRoute>
                <Navbar isProjectSelected={isProjectSelected} />
                <CloudIDE setIsProjectSelected={setIsProjectSelected} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default MainApp;
