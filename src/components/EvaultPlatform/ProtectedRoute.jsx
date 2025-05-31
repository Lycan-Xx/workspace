import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector(state => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace />;
  }

  return children;
};

export default ProtectedRoute;



// - i will want to add token expiration and refresh token logic for better security. 
// These could be done by:
// 1. Adding an expiration timestamp to the stored auth state
// 2. Implementing refresh token logic
// 3. Adding automatic logout when the token expires
