import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { checkTokenExpiration, initializeAuth } from "./store/authSlice";

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    // Always check for valid session on protected route access
    const checkAuth = async () => {
      if (isAuthenticated) {
        const isValid = dispatch(checkTokenExpiration());
        if (!isValid) {
          return;
        }
      } else {
        // Try to initialize auth from Supabase session
        await dispatch(initializeAuth());
      }
    };
    
    checkAuth();
  }, [dispatch, isAuthenticated]);

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
