import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError, initializeAuth } from '../store/authSlice';
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useNavigate, useLocation } from 'react-router-dom';
import ForgotPassword from './ForgotPassword';

export default function SignIn({ onSignUp }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    error: authError, 
    loading: authLoading, 
    isAuthenticated, 
    sessionInitialized,
    user 
  } = useSelector(state => state.auth);

  // Check for existing session on component mount
  useEffect(() => {
    const initializeSession = async () => {
      if (!sessionInitialized && !sessionChecked) {
        console.log('Checking for existing session...');
        setLoading(true);
        
        try {
          const result = await dispatch(initializeAuth());
          
          if (result && result.success && result.user) {
            const intendedDestination = location.state?.from?.pathname || '/dashboard';
            setSuccessMessage('Session restored! Redirecting...');
            console.log('Session restored, redirecting to:', intendedDestination);
            
            setTimeout(() => {
              navigate(intendedDestination, { replace: true });
            }, 1500);
          } else {
            console.log('No valid session found');
          }
        } catch (error) {
          console.log('Session check failed:', error.message);
        } finally {
          setLoading(false);
          setSessionChecked(true);
        }
      }
    };

    initializeSession();
  }, [dispatch, sessionInitialized, sessionChecked, location.state, navigate]);

  // Handle authentication state changes
  useEffect(() => {
    if (isAuthenticated && user && !loading && sessionChecked) {
      const intendedDestination = location.state?.from?.pathname || '/dashboard';
      setSuccessMessage('Authentication successful! Redirecting...');
      
      setTimeout(() => {
        navigate(intendedDestination, { replace: true });
      }, 1500);
    }
  }, [isAuthenticated, user, loading, sessionChecked, location.state, navigate]);

  // Clear field errors when user types
  useEffect(() => {
    if (email && errors.email) {
      setErrors(prev => ({ ...prev, email: null }));
    }
  }, [email, errors.email]);

  useEffect(() => {
    if (password && errors.password) {
      setErrors(prev => ({ ...prev, password: null }));
    }
  }, [password, errors.password]);

  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }
    
    // Password validation
    if (!password.trim()) {
      newErrors.password = "Password is required.";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
    }
    
    // Rate limiting
    if (retryCount >= 5) {
      newErrors.general = "Too many failed attempts. Please try again in a few minutes.";
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setErrors({});
    setLoading(true);
    dispatch(clearError());
    
    console.log('Attempting login for:', email);

    try {
      const result = await dispatch(login({ 
        email: email.trim().toLowerCase(), 
        password: password 
      }));
      
      if (result && result.success) {
        setRetryCount(0);
        setSuccessMessage('Welcome back! Redirecting...');
        console.log('Login successful');
        
        setTimeout(() => {
          const destination = location.state?.from?.pathname || '/dashboard';
          navigate(destination, { replace: true });
        }, 1500);
      } else {
        const errorMessage = result?.error || authError || 'Login failed. Please check your credentials.';
        setRetryCount(prev => prev + 1);
        setErrors({ general: errorMessage });
        
        // Reset password on authentication failure
        if (errorMessage.toLowerCase().includes('invalid') || 
            errorMessage.toLowerCase().includes('not found')) {
          setPassword("");
        }
        
        console.log('Login failed:', errorMessage);
      }
    } catch (error) {
      setRetryCount(prev => prev + 1);
      setErrors({ general: 'An error occurred during login. Please try again.' });
      console.log('Login error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordClick = (e) => {
    e.preventDefault();
    setShowForgotPassword(true);
  };

  const handleBackToSignIn = () => {
    setShowForgotPassword(false);
  };

  const resetForm = () => {
    setRetryCount(0);
    setErrors({});
    setPassword("");
    dispatch(clearError());
  };

  // Show loading state for session check
  if (loading && !sessionChecked) {
    return (
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-10 mx-auto">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#025798] mx-auto mb-4"></div>
          <p className="text-gray-600">Checking for existing session...</p>
        </div>
      </div>
    );
  }

  if (showForgotPassword) {
    return <ForgotPassword onBackToSignIn={handleBackToSignIn} />;
  }

  return (
    <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-10 mx-auto">
      <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6 text-center">
        Welcome Back
      </h2>

      <div>
        <h3 className="text-lg font-bold text-center text-gray-700 mb-6">
          Sign In to Your Account
        </h3>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6 text-center">
            {successMessage}
          </div>
        )}

        {/* Error Messages */}
        {(authError || errors.general) && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {authError || errors.general}
            {retryCount >= 3 && retryCount < 5 && (
              <div className="text-sm mt-2">
                {5 - retryCount} attempts remaining before temporary lockout.
              </div>
            )}
          </div>
        )}

        {/* Rate Limiting Warning */}
        {retryCount >= 5 && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg mb-6">
            <p className="font-medium">Account temporarily locked</p>
            <p className="text-sm mt-1">Too many failed attempts. Please wait a few minutes before trying again.</p>
            <button
              type="button"
              onClick={resetForm}
              className="text-sm text-yellow-800 hover:underline mt-2"
            >
              Clear and try again
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-[#025798]/20 transition-all outline-none ${
                  errors.email 
                    ? 'border-red-300 focus:border-red-500' 
                    : 'border-gray-300 focus:border-[#025798]'
                }`}
                disabled={loading || authLoading || retryCount >= 5}
                autoComplete="email"
                required
              />
              <Mail className={`absolute right-3 top-3.5 h-5 w-5 ${
                errors.email ? 'text-red-400' : 'text-gray-400'
              }`} />
            </div>
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-[#025798]/20 transition-all outline-none pr-12 ${
                  errors.password 
                    ? 'border-red-300 focus:border-red-500' 
                    : 'border-gray-300 focus:border-[#025798]'
                }`}
                disabled={loading || authLoading || retryCount >= 5}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading || authLoading || retryCount >= 5}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            
            <div className="text-right mt-2">
              <button
                type="button"
                onClick={handleForgotPasswordClick}
                disabled={loading || authLoading}
                className="text-sm text-[#025798] hover:underline transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Forgot password?
              </button>
            </div>
          </div>

          {/* Sign In Button */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
            <button
              type="submit"
              disabled={loading || authLoading || retryCount >= 5 || successMessage}
              className={`px-6 py-3 rounded-lg font-medium transition duration-300 flex-1 flex items-center justify-center ${
                successMessage
                  ? 'bg-green-600 text-white cursor-default'
                  : retryCount >= 5
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : loading || authLoading
                  ? 'bg-[#025798]/70 text-white cursor-wait'
                  : 'bg-[#025798] text-white hover:bg-[#025798]/90'
              }`}
            >
              {loading || authLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing In...
                </>
              ) : successMessage ? (
                'Success!'
              ) : retryCount >= 5 ? (
                'Too Many Attempts'
              ) : (
                <>
                  Sign In
                  {retryCount > 0 && ` (${retryCount}/5)`}
                </>
              )}
            </button>
          </div>
        </form>

        {/* Sign Up Link */}
        <div className="text-center mt-8">
          <span className="text-sm text-gray-700">
            New to eVault?{" "}
          </span>
          <button
            className="px-4 py-2 ml-2 rounded-lg bg-white border-2 border-[#025798] text-[#025798] hover:text-white hover:bg-[#025798] transition duration-300 ease-linear disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onSignUp}
            disabled={loading || authLoading || successMessage}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}