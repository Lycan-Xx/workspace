import React, { useEffect, useState, useCallback } from "react";
import {
  HashRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { initializeAuth, logout } from "./store/authSlice";
import PlatformApp from "./PlatformApp";
import Dashboard from "./Dashboard/Dashboard";
import ConfigureSecurity from "./authentication/security/ConfigureSecurity";
import LandingPage from "../LandingPage/LandingPage";

// Simple loading spinner placeholder (you can replace with your own)
const SimpleLoading = ({ message }) => (
  <div style={{ padding: 40, textAlign: "center" }}>
    <div>{message || "Loading..."}</div>
  </div>
);

// Simple session expiration warning modal, minimal styling for your UI to match
const SessionExpirationWarning = ({ onExtend, onLogout, minutesLeft }) => (
  <div style={{
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 9999
  }}>
    <div style={{ background: 'white', padding: 20, borderRadius: 6, maxWidth: 320, textAlign: 'center' }}>
      <h3>Session Expiring Soon</h3>
      <p>Your session will expire in {Math.ceil(minutesLeft)} minutes. Do you want to extend it?</p>
      <button onClick={onExtend} style={{marginRight: 10}}>Extend Session</button>
      <button onClick={onLogout}>Logout</button>
    </div>
  </div>
);

// Constants
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const WARNING_THRESHOLD_MS = 30 * 60 * 1000; // 30 minutes

const PrivateRoute = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading, sessionInitialized, lastLoginTime } = useSelector(state => state.auth);
  const [checking, setChecking] = useState(true);
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const location = useLocation();

  // Check session expiration and handle warning
  const checkSession = useCallback(() => {
    if (!isAuthenticated || !lastLoginTime) return false;

    const elapsed = Date.now() - lastLoginTime;
    const left = SESSION_DURATION_MS - elapsed;

    if (left <= 0) {
      console.log("Session expired, logging out.");
      dispatch(logout());
      return false;
    }

    if (left <= WARNING_THRESHOLD_MS && !showWarning) {
      setTimeLeft(left / 1000 / 60); // minutes
      setShowWarning(true);
    }

    return true;
  }, [dispatch, isAuthenticated, lastLoginTime, showWarning]);

  const handleExtend = useCallback(async () => {
    try {
      console.log("Extending session...");
      const result = await dispatch(initializeAuth()).unwrap();
      if (result.success) {
        setShowWarning(false);
        console.log("Session extended");
      } else {
        dispatch(logout());
      }
    } catch {
      dispatch(logout());
    }
  }, [dispatch]);

  const handleLogout = useCallback(() => {
    console.log("User logged out from session warning.");
    dispatch(logout());
    setShowWarning(false);
  }, [dispatch]);

  // Authenticate & session init check on mount
  const authenticate = useCallback(async () => {
    try {
      setChecking(true);
      if (!sessionInitialized) {
        const result = await dispatch(initializeAuth()).unwrap();
        if (!result.success) {
          setChecking(false);
          return;
        }
      }
      if (!checkSession()) {
        setChecking(false);
        return;
      }
      setChecking(false);
    } catch (error) {
      console.error("Auth check error:", error);
      dispatch(logout());
      setChecking(false);
    }
  }, [dispatch, sessionInitialized, checkSession]);

  useEffect(() => {
    authenticate();
  }, [authenticate]);

  // Periodic session check every 5 minutes
  useEffect(() => {
    if (isAuthenticated && sessionInitialized) {
      const interval = setInterval(() => {
        checkSession();
      }, 300000); // 5 minutes

      return () => clearInterval(interval);
    }
  }, [isAuthenticated, sessionInitialized, checkSession]);

  if (showWarning) {
    return <SessionExpirationWarning onExtend={handleExtend} onLogout={handleLogout} minutesLeft={timeLeft} />;
  }

  if (loading || checking || !sessionInitialized) {
    return <SimpleLoading message="Verifying your session..." />;
  }

  if (!isAuthenticated) {
    console.log("User not authenticated; redirecting to sign-in.");
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  return children;
};

const SecurityRoute = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading, sessionInitialized, lastLoginTime } = useSelector(state => state.auth);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  const validateSecuritySession = useCallback(async (retries = 0) => {
    try {
      setChecking(true);
      setError(null);

      if (!sessionInitialized) {
        const initResult = await dispatch(initializeAuth()).unwrap();
        if (!initResult.success && retries < 2) {
          setTimeout(() => validateSecuritySession(retries + 1), 1000);
          return;
        }
        if (!initResult.success) {
          setError("Failed to initialize session. Please refresh the page.");
          setChecking(false);
          return;
        }
      }

      if (isAuthenticated && lastLoginTime) {
        const age = Date.now() - lastLoginTime;
        if (age > SESSION_DURATION_MS) {
          console.log("Session expired, logging out.");
          dispatch(logout());
          setChecking(false);
          return;
        }

        // Basic backend session validation (simulated with try-catch)
        try {
          const { apiService } = await import('../../services/api');
          const sessionResult = await apiService.getSession();
          if (!sessionResult.success || !sessionResult.session) {
            console.log("Backend session invalid, logging out.");
            dispatch(logout());
            setChecking(false);
            return;
          }
        } catch (err) {
          console.error("Session validation failed:", err);
          if (retries < 1) {
            setTimeout(() => validateSecuritySession(retries + 1), 2000);
            return;
          }
          setError("Session validation failed. Please try again.");
          setChecking(false);
          return;
        }
      }

      setChecking(false);
    } catch (err) {
      console.error("SecurityRoute auth error:", err);
      if (retries < 2) {
        setTimeout(() => validateSecuritySession(retries + 1), 1000);
      } else {
        setError("Authentication failed. Please refresh.");
        setChecking(false);
      }
    }
  }, [dispatch, isAuthenticated, lastLoginTime, sessionInitialized]);

  useEffect(() => {
    validateSecuritySession();
  }, [validateSecuritySession]);

  if (error) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <h3>Authentication Error</h3>
        <p>{error}</p>
        <button onClick={() => validateSecuritySession()}>Retry</button>
      </div>
    );
  }

  if (loading || checking || !sessionInitialized) {
    return <SimpleLoading message="Securing your connection..." />;
  }

  if (!isAuthenticated) {
    console.log("User not authenticated; redirecting to sign-in.");
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading, sessionInitialized, lastLoginTime } = useSelector(state => state.auth);
  const [checking, setChecking] = useState(true);
  const [redirecting, setRedirecting] = useState(false);
  const location = useLocation();

  const getRedirectPath = useCallback(() => {
    if (location.pathname === "/home") return null;

    // Redirect to previously intended page if any
    const intended = location.state?.from?.pathname;
    if (intended && intended !== location.pathname) return intended;

    return "/dashboard";
  }, [location]);

  const checkAuth = useCallback(async () => {
    try {
      setChecking(true);

      if (!sessionInitialized) {
        const initResult = await dispatch(initializeAuth()).unwrap();
        if (!initResult.success) {
          setChecking(false);
          return;
        }
      }

      if (isAuthenticated && lastLoginTime) {
        const age = Date.now() - lastLoginTime;
        if (age > SESSION_DURATION_MS) {
          console.log("Session expired, logging out.");
          dispatch(logout());
          setChecking(false);
          return;
        }

        const redirectTo = getRedirectPath();
        if (redirectTo) {
          console.log("Redirecting authenticated user to:", redirectTo);
          setRedirecting(true);
          setTimeout(() => {
            setChecking(false);
          }, 300);
          return;
        }
      }
      setChecking(false);
    } catch (err) {
      console.error("PublicRoute auth error:", err);
      setChecking(false);
    }
  }, [dispatch, isAuthenticated, lastLoginTime, sessionInitialized, getRedirectPath]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (loading || checking || !sessionInitialized) {
    return <SimpleLoading message={redirecting ? "Redirecting..." : "Loading..."} />;
  }

  if (isAuthenticated && !redirecting) {
    const redirectTo = getRedirectPath();
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }
  }

  return children;
};

const App = () => {
  const dispatch = useDispatch();
  const { sessionInitialized } = useSelector(state => state.auth);

  useEffect(() => {
    if (!sessionInitialized) {
      console.log("Initializing auth on app startup.");
      dispatch(initializeAuth()).unwrap().catch(err => {
        console.error("Initialization error:", err);
      });
    }
  }, [dispatch, sessionInitialized]);

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
