import React, { useState } from "react";
import {
  FaBars,
  FaTimes,
  FaSignInAlt,
  FaUserPlus,
  FaDownload,
  FaHandshake,
} from "react-icons/fa";
import logo from './assets/logo.jpg'

const Navbar = ({ onNavigate, currentView }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);

  const navItems = [
    {
      name: "instant-payments",
      label: "Instant Payment",
      icon: <FaHandshake className="w-5 h-5 text-yellow-500" />,
      className: "bg-white text-[#025798]",
    },
    {
      name: "sign-in",
      label: "Sign In",
      icon: <FaSignInAlt className="w-5 h-5" />,
      className: "bg-[#025798] text-white",
    },
    {
      name: "sign-up",
      label: "Sign Up",
      icon: <FaUserPlus className="w-5 h-5" />,
      className: "bg-[#025798] text-white",
    },
  ];

  return (
    <nav className="bg-white shadow-md rounded-b-3xl border-b-4 border-[rgb(2,87,152)] fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href="#" className="flex items-center">
              <img 
                src={logo} 
                alt="eVault Logo" 
                className="h-10 w-10 md:h-16 md:w-16 sm:h-12 sm:w-12" 
              />
              <span className="mt-[2rem] mr-[2rem] text-xl font-bold text-[#025798] hidden md:block">
                Vault
              </span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-3">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => onNavigate(item.name)}
                className={`${item.className} px-4 py-1.5 rounded-lg border border-[#025798] 
                  hover:bg-opacity-90 hover:scale-105 transform transition-all duration-200 
                  flex items-center gap-2 text-sm font-medium`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
            <button
              onClick={() => setIsDialogOpen(true)}
              className="bg-white text-[#025798] px-4 py-1.5 rounded-lg border border-[#025798] 
                hover:bg-[#025798] hover:text-white hover:scale-105 transform transition-all duration-200 
                flex items-center gap-2 text-sm font-medium"
            >
              <FaDownload className="w-5 h-5" />
              Download
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsNavOpen(!isNavOpen)}
            className="lg:hidden p-2 text-[#025798] hover:bg-gray-100 rounded-lg transition-colors z-50"
            aria-label="Toggle menu"
          >
            {isNavOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      <div
        className={`
          fixed inset-0 bg-black/50 backdrop-blur-sm lg:hidden
          transition-opacity duration-300 ease-in-out
          ${isNavOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
        onClick={() => setIsNavOpen(false)}
      />

      {/* Mobile Navigation Menu */}
      <div
        className={`
          fixed top-0 right-0 h-full w-64 bg-white shadow-xl lg:hidden
          transform transition-transform duration-300 ease-in-out
          ${isNavOpen ? 'translate-x-0' : 'translate-x-full'}
          pt-20 pb-6 overflow-y-auto
        `}
      >
        <div className="px-4 space-y-3">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                onNavigate(item.name);
                setIsNavOpen(false);
              }}
              className={`
                w-full px-4 py-2.5 rounded-lg
                ${currentView === item.name 
                  ? 'bg-[#025798] text-white' 
                  : 'bg-white text-[#025798]'}
                border border-[#025798]
                hover:bg-opacity-90 hover:scale-[1.02]
                active:scale-[0.98]
                transform transition-all duration-200
                flex items-center gap-2 text-sm font-medium
              `}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
          <button
            onClick={() => {
              setIsDialogOpen(true);
              setIsNavOpen(false);
            }}
            className="w-full px-4 py-2.5 rounded-lg
              bg-white text-[#025798] border border-[#025798]
              hover:bg-[#025798] hover:text-white
              hover:scale-[1.02] active:scale-[0.98]
              transform transition-all duration-200
              flex items-center gap-2 text-sm font-medium"
          >
            <FaDownload className="w-5 h-5" />
            Download
          </button>
        </div>
      </div>

      {/* Download Dialog */}
      {isDialogOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          role="dialog"
          aria-labelledby="download-dialog-title"
          aria-describedby="download-dialog-description"
        >
          <div className="relative bg-white rounded-2xl shadow-xl p-6 max-w-md w-11/12">
            <button
              onClick={() => setIsDialogOpen(false)}
              aria-label="Close dialog"
              className="absolute top-4 right-4 text-gray-600 hover:text-red-500 transition"
            >
              <FaTimes className="w-6 h-6" />
            </button>
            <h2 id="download-dialog-title" className="text-xl font-bold mb-4">
              Download Our App
            </h2>
            <p id="download-dialog-description" className="mb-6 text-gray-600">
              Get access to exclusive features and manage your account on the go.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="flex-1 py-2 bg-[#025798] text-white text-center rounded-lg 
                  hover:bg-opacity-90 hover:scale-105 transform transition-all duration-200"
              >
                App Store
              </a>
              <a
                href="#"
                className="flex-1 py-2 bg-[#025798] text-white text-center rounded-lg 
                  hover:bg-opacity-90 hover:scale-105 transform transition-all duration-200"
              >
                Google Play
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;