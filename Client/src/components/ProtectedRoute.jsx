import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';


export const ProtectedRoute = ({ children }) => {
  const { checkLogin } = useContext(AuthContext);
//   console.log(checkLogin())
  
  if (!checkLogin()) {
    return <Navigate to="/login"/>;
  }
  
  return children;
};