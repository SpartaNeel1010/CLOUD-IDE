import React, { createContext, useState, useContext, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';

export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    // Check if user is logged in (e.g., check localStorage or session)
    const token = localStorage.getItem('authToken');
    if (token) {
      // You might want to validate the token with your backend here
      setUser({ token });
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    console.log("In login function")
    setUser(userData);
    localStorage.setItem('authToken', userData.token);
    
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
  };
  const checkLogin=()=>
    {
        let auth_token=localStorage.getItem('authToken')
        // console.log(auth_token)
        
        if(auth_token===null)
            return false
        const decodedToken = jwtDecode(auth_token);
        const currentTime = Date.now() / 1000; // Current time in seconds
    
        if (decodedToken.exp < currentTime) {
            return false; 
        }
    
        return true;
    }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout,checkLogin }}>
      {children}
    </AuthContext.Provider>
  );
};


