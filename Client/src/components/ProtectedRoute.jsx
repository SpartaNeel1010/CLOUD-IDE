import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';


export const ProtectedRoute = ({ children }) => {
  const { checkLogin } = useContext(AuthContext);
  //   console.log(checkLogin())
  const location = useLocation();
  if (!checkLogin()) {
    const redirectPath = `${location.pathname}${location.search}`;
    return <Navigate to={`/login?redirect=${encodeURIComponent(redirectPath)}`} />;
  }

  return children;
};