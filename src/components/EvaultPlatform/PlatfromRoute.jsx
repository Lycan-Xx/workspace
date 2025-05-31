import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PlatformApp from './PlatformApp';
import Dashboard from './Dashboard/Dashboard';
import ConfigureSecurity from './security/ConfigureSecurity';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const isUpgradeSecurityCheck = location.pathname === '/security' && location.state?.fromUpgrade;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/sign-in');
    }
  }, [isAuthenticated, navigate]);

  return isAuthenticated ? children : null;
};

const SecurityRoute = ({ children }) => {
  const { isAuthenticated } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/sign-in');
    } else if (!location.state?.fromUpgrade) {
      // If not coming from upgrade flow, redirect to dashboard
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate, location]);

  return isAuthenticated ? children : null;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useSelector(state => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return !isAuthenticated ? children : null;
};

const App = () => {
  return (
    <HashRouter>
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
          path="/sign-up" 
          element={
            <PublicRoute>
              <PlatformApp initialView="sign-up" />
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
    </HashRouter>
  );
};

export default App;
