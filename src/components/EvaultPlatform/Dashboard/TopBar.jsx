import React, { useState, useRef, useEffect } from 'react';
import { Bell, Mail, Eye, EyeOff, User, Settings, LogOut } from 'lucide-react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/authSlice';
import { settingsCategories } from './settings/data/categories';

const TopBar = ({ setSelectedTab, onSettingSelect }) => {
  const [showBalance, setShowBalance] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);
  const menuRef = useRef(null);
  const notificationRef = useRef(null);
  const messageRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  // Sample notification data
  const notifications = [
    { id: 1, title: "New Login Alert", message: "New login from Lagos", time: "2m ago" },
    { id: 2, title: "Transaction Success", message: "Transfer of ₦50,000 successful", time: "1h ago" },
    { id: 3, title: "Security Alert", message: "Password changed successfully", time: "2h ago" }
  ];

  const messages = [
    { id: 1, sender: "Support Team", message: "Your ticket has been resolved", time: "5m ago" },
    { id: 2, sender: "System", message: "Welcome to eVault!", time: "1d ago" }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationOpen(false);
      }
      if (messageRef.current && !messageRef.current.contains(event.target)) {
        setMessageOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/sign-in');
  };

  const renderNotifications = () => (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-50">
      <div className="px-4 py-2 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">Notifications</h3>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications.map(notification => (
          <div key={notification.id} className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
            <p className="font-medium text-gray-900">{notification.title}</p>
            <p className="text-sm text-gray-600">{notification.message}</p>
            <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMessages = () => (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-50">
      <div className="px-4 py-2 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">Messages</h3>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {messages.map(message => (
          <div key={message.id} className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
            <p className="font-medium text-gray-900">{message.sender}</p>
            <p className="text-sm text-gray-600">{message.message}</p>
            <p className="text-xs text-gray-500 mt-1">{message.time}</p>
          </div>
        ))}
      </div>
    </div>
  );

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
            <div className="relative" ref={notificationRef}>
              <button 
                className="relative p-2 rounded-full transition-colors hover:bg-blue-700"
                aria-label="Notifications"
                onClick={() => {
                  setNotificationOpen(!notificationOpen);
                  setMessageOpen(false);
                }}
              >
                <Bell className="text-white" size={24} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </button>
              {notificationOpen && renderNotifications()}
            </div>

            <div className="relative" ref={messageRef}>
              <button 
                className="relative p-2 rounded-full transition-colors hover:bg-blue-700"
                aria-label="Messages"
                onClick={() => {
                  setMessageOpen(!messageOpen);
                  setNotificationOpen(false);
                }}
              >
                <Mail className="text-white" size={24} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  2
                </span>
              </button>
              {messageOpen && renderMessages()}
            </div>
          </div>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center space-x-2 focus:outline-none hover:opacity-80 transition-opacity"
              aria-expanded={menuOpen}
              aria-haspopup="true"
            >
              <span className="hidden md:block text-right mr-2">
                <span className="block text-sm font-medium text-white">
                  {user?.name || 'Guest'}
                </span>
                <span className="block text-xs text-white capitalize">
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
                  onClick={() => {
                    setMenuOpen(false);
                    onSettingSelect(settingsCategories.find(cat => cat.id === 'account'));
                    setSelectedTab('Settings');
                  }}
                >
                  <User size={18} className="text-blue-600" />
                  <span>Profile</span>
                </button>
                <button 
                  className="w-full px-4 py-2 text-left hover:bg-blue-50 flex items-center space-x-2"
                  onClick={() => {
                    setMenuOpen(false);
                    setSelectedTab('Settings');
                  }}
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