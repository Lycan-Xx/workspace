import React, { useState, useRef, useEffect } from 'react';
import { Bell, Mail, Eye, EyeOff, User, Settings, LogOut } from 'lucide-react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/authSlice';

const TopBar = () => {
  const [showBalance, setShowBalance] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/sign-in');
  };

  return (
    <div className="bg-blue-600 rounded-lg shadow-sm p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="text-white font-bold">
            <span className="text-sm md:text-base">Wallet Balance:</span>
            <span className="ml-2 text-lg md:text-xl">
              {showBalance ? '₦467,038.98' : '₦ * * * * *'}
            </span>
          </div>
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="p-1 rounded-full transition-colors"
            aria-label={showBalance ? 'Hide balance' : 'Show balance'}
          >
            {showBalance ? (
              <EyeOff className="text-white" size={20} />
            ) : (
              <Eye className="text-white" size={20} />
            )}
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex space-x-3">
            <button 
              className="relative p-2 rounded-full transition-colors hover:bg-blue-700"
              aria-label="Notifications"
            >
              <Bell className="text-white" size={24} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </button>
            <button 
              className="relative p-2 rounded-full transition-colors hover:bg-blue-700"
              aria-label="Messages"
            >
              <Mail className="text-white" size={24} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                2
              </span>
            </button>
          </div>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center space-x-2 focus:outline-none hover:opacity-80 transition-opacity"
              aria-expanded={menuOpen}
              aria-haspopup="true"
            >
              <span className="hidden md:block text-right mr-2">
                <span className="block text-sm font-medium text-gray-100">
                  {user?.name || 'Guest'}
                </span>
                <span className="block text-xs text-gray-300 capitalize">
                  {user?.role || 'Guest'} Account
                </span>
              </span>
              <div className="flex-shrink-0 w-10 h-10">
                <img
                  src={`https://picsum.photos/seed/${user?.email || 'default'}/200`}
                  alt={`${user?.name || 'Guest'}'s avatar`}
                  className="w-full h-full rounded-full border-2 border-white object-cover"
                />
              </div>
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                <button 
                  className="w-full px-4 py-2 text-left hover:bg-blue-50 flex items-center space-x-2"
                  onClick={() => setMenuOpen(false)}
                >
                  <User size={18} className="text-blue-600" />
                  <span>Profile</span>
                </button>
                <button 
                  className="w-full px-4 py-2 text-left hover:bg-blue-50 flex items-center space-x-2"
                  onClick={() => setMenuOpen(false)}
                >
                  <Settings size={18} className="text-blue-600" />
                  <span>Settings</span>
                </button>
                <hr className="my-2" />
                <button 
                  onClick={handleLogout} 
                  className="w-full px-4 py-2 text-left hover:bg-red-50 flex items-center space-x-2 text-red-600"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

TopBar.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string
  }),
};

export default TopBar;