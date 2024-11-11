import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import LoginPage from './components/LoginPage';
import CloudIDE from './CloudIDE';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';

function MainApp() {
  const username = "YourUsername"; // Replace this with actual username retrieval logic

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Navbar username={username} />
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/project/:projectId"
            element={
              <ProtectedRoute>
                <Navbar username={username} />
                <CloudIDE />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default MainApp;