import React, { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/authSlice';
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import ForgotPassword from './ForgotPassword'; // Import the ForgotPassword component

export default function SignIn({ onSignUp }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const error = useSelector(state => state.auth.error);

  const validateForm = () => {
    const newErrors = {};
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Please enter a valid email address.";
    if (!password.trim()) newErrors.password = "Password is required.";
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
    try {
      const success = await dispatch(login({ email, password }));
      if (success) {
        // Navigate to dashboard on successful login
        navigate('/dashboard');
      }
    } catch (error) {
      setErrors({ general: 'An error occurred during login' });
    }
  };

  const handleForgotPasswordClick = (e) => {
    e.preventDefault();
    setShowForgotPassword(true);
  };

  const handleBackToSignIn = () => {
    setShowForgotPassword(false);
  };

  // If showing forgot password, render the ForgotPassword component
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

        {(error || errors.general) && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error || errors.general}
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
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#025798] focus:ring-2 focus:ring-[#025798]/20 transition-all outline-none"
                required
              />
              <Mail className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
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
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#025798] focus:ring-2 focus:ring-[#025798]/20 transition-all outline-none pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
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
                className="text-sm text-[#025798] hover:underline transition-colors"
              >
                Forgot password?
              </button>
            </div>
          </div>

          {/* Sign In Button */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
            <button
              type="submit"
              className="px-6 py-3 bg-[#025798] text-white rounded-lg font-medium hover:bg-[#025798]/90 transition duration-300 flex-1"
            >
              Sign In
            </button>
          </div>
        </form>

        {/* Sign Up Link */}
        <div className="text-center mt-8">
          <span className="text-sm text-gray-700">
            New to eVault?{" "}
          </span>
          <button
            className="px-4 py-2 ml-2 rounded-lg bg-white border-2 border-[#025798] text-[#025798] hover:text-white hover:bg-[#025798] transition duration-300 ease-linear"
            onClick={onSignUp}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}