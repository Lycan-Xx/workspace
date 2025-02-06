import React, { useState, useRef, useEffect } from 'react';
import { Bell, Mail, Eye, EyeOff, User, Settings, LogOut, X } from 'lucide-react';
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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  // Sample notification data
  const notifications = [
    { id: 1, title: 'New Login Alert', message: 'New login from Lagos', time: '2m ago' },
    { id: 2, title: 'Transaction Success', message: 'Transfer of ₦50,000 successful', time: '1h ago' },
    { id: 3, title: 'Security Alert', message: 'Password changed successfully', time: '2h ago' },
  ];

  const messages = [
    { id: 1, sender: 'Support Team', message: 'Your ticket has been resolved', time: '5m ago' },
    { id: 2, sender: 'System', message: 'Welcome to eVault!', time: '1d ago' },
  ];

  // Close the profile dropdown when clicking outside
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

  // Modal component for reuse
  const Modal = ({ onClose, title, children }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      {/* Modal content */}
      <div className="relative bg-white rounded-lg shadow-lg w-80 max-h-full overflow-y-auto">
        <div className="flex justify-between items-center px-4 py-2 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );

  const renderNotificationsModal = () => (
    <Modal onClose={() => setNotificationOpen(false)} title="Notifications">
      <div className="py-2">
        {notifications.map(notification => (
          <div key={notification.id} className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
            <p className="font-medium text-gray-900">{notification.title}</p>
            <p className="text-sm text-gray-600">{notification.message}</p>
            <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
          </div>
        ))}
      </div>
    </Modal>
  );

  const renderMessagesModal = () => (
    <Modal onClose={() => setMessageOpen(false)} title="Messages">
      <div className="py-2">
        {messages.map(message => (
          <div key={message.id} className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
            <p className="font-medium text-gray-900">{message.sender}</p>
            <p className="text-sm text-gray-600">{message.message}</p>
            <p className="text-xs text-gray-500 mt-1">{message.time}</p>
          </div>
        ))}
      </div>
    </Modal>
  );

  return (
    <div className="w-full max-w-full overflow-hidden">
      <div className="bg-blue-600 rounded-lg shadow-sm p-4 mb-4 mx-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
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
              onClick={() => {
                setNotificationOpen(true);
                setMessageOpen(false);
              }}
            >
              <Bell className="text-white" size={24} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </button>

            <button 
              className="relative p-2 rounded-full transition-colors hover:bg-blue-700"
              aria-label="Messages"
              onClick={() => {
                setMessageOpen(true);
                setNotificationOpen(false);
              }}
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
                      onSettingSelect(settingsCategories.find((cat) => cat.id === 'account'));
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

      {/* Render the modals */}
      {notificationOpen && renderNotificationsModal()}
      {messageOpen && renderMessagesModal()}
    </div>
  );
};

TopBar.propTypes = {
  setSelectedTab: PropTypes.func.isRequired,
  onSettingSelect: PropTypes.func.isRequired,
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    role: PropTypes.string
  }),
};

export default TopBar;
