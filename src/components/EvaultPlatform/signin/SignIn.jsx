import React, { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/authSlice';
import { Eye, EyeOff, Mail } from "lucide-react";
import { useNavigate } from 'react-router-dom';

export default function SignIn({ onSignUp }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const error = useSelector(state => state.auth.error);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await dispatch(login({ email, password }));
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="bg-white w-full max-w-[36rem] rounded-2xl shadow-2xl p-6 sm:p-10 md:p-14 mx-auto mt-10 sm:mt-16">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
        Welcome Back
      </h2>

      <div>
        <h3 className="text-base sm:text-lg font-medium text-center text-gray-700 mb-6">
          Sign In to Your Account
        </h3>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          {/* Email Input */}
          <div className="relative">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 text-base sm:text-lg border-2 border-[#025798] rounded-xl"
              required
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 text-base sm:text-lg border-2 border-[#025798] rounded-xl pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-7 transform -translate-y-1/2"
            >
              {showPassword ? (
                <EyeOff size={20} className="text-gray-400" />
              ) : (
                <Eye size={20} className="text-gray-400" />
              )}
            </button>
            <a
              href="#"
              className="block text-sm sm:text-base text-[#025798] hover:underline mt-4 text-right"
            >
              Forgot password?
            </a>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full sm:w-1/2 px-6 py-3 bg-[#025798] hover:bg-white text-white hover:text-[#025798] transition duration-300 border-2 border-[#025798] text-base sm:text-lg rounded-lg ease-linear mx-auto block"
          >
            Sign In
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="text-center mt-8 sm:mt-12">
          <span className="text-sm sm:text-base text-gray-700">
            New to eVault?{" "}
          </span>
          <button
            className="px-4 py-2 sm:px-6 sm:py-3 ml-2 rounded-lg bg-white border-2 border-[#025798] text-base sm:text-lg hover:text-white hover:bg-[#025798] transition duration-300 ease-linear"
            onClick={onSignUp}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}