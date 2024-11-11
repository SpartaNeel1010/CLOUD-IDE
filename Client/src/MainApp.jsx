import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import LoginPage from './components/LoginPage';
import CloudIDE from './CloudIDE';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';

function MainApp() {
  const [isProjectSelected, setIsProjectSelected] = useState(false);
  const username = "YourUsername"; // Replace with actual username retrieval logic

  return (
    <AuthProvider>
      <Router>
        <Navbar username={username} isProjectSelected={isProjectSelected} />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard setIsProjectSelected={setIsProjectSelected} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/project/:projectId"
            element={
              <ProtectedRoute>
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
