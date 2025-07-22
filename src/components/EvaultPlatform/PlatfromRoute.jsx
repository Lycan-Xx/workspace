import React from "react";
import {
  HashRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import PlatformApp from "./PlatformApp";
import Dashboard from "./Dashboard/Dashboard";
import ConfigureSecurity from "./authentication/security/ConfigureSecurity";
import LandingPage from "../LandingPage/LandingPage";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return isAuthenticated ? children : <Navigate to="/sign-in" />;
};

const SecurityRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return isAuthenticated ? children : <Navigate to="/sign-in" />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
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
        <Route path="/home" element={<LandingPage />} />
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
