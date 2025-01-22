import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PlatformApp from './PlatformApp';
import Dashboard from './Dashboard/Dashboard';
import ConfigureSecurity from './security/ConfigureSecurity';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, securityVerified } = useSelector(state => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/sign-in');
    } else if (!securityVerified) {
      navigate('/security');
    }
  }, [isAuthenticated, securityVerified, navigate]);

  return isAuthenticated && securityVerified ? children : null;
};

const SecurityRoute = ({ children }) => {
  const { isAuthenticated, securityVerified } = useSelector(state => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/sign-in');
    } else if (securityVerified) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, securityVerified, navigate]);

  return isAuthenticated && !securityVerified ? children : null;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, securityVerified } = useSelector(state => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && securityVerified) {
      navigate('/dashboard');
    } else if (isAuthenticated && !securityVerified) {
      navigate('/security');
    }
  }, [isAuthenticated, securityVerified, navigate]);

  return !isAuthenticated ? children : null;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/sign-in" 
          element={
            <PublicRoute>
              <PlatformApp initialView="sign-in" />
            </PublicRoute>
          } 
        />
        <Route 
          path="/security" 
          element={
            <SecurityRoute>
              <ConfigureSecurity />
            </SecurityRoute>
          } 
        />
        <Route
          path="/dashboard/*"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route 
          path="/" 
          element={
            <PublicRoute>
              <PlatformApp initialView="instant-payments" />
            </PublicRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;