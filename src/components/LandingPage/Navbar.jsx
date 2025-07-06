import React, { useState } from "react";
import { Menu, X, Globe } from "lucide-react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { FaSignInAlt, FaUserPlus } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import logo from "../assets/evault-main-logo.png";

const Navbar = ({ setShowPlatform, setPlatformInitialView, language, setLanguage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  const handleLanguageSwitch = () => {
    const languages = ["English", "Hausa", "Yoruba", "Igbo"];
    const currentIndex = languages.indexOf(language);
    const nextIndex = (currentIndex + 1) % languages.length;
    setLanguage(languages[nextIndex]);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
      setIsServicesOpen(false);
    }
  };

  const services = [
    { title: "Airtime Top Up", id: "airtime" },
    { title: "Buy Data", id: "data" },
    { title: "Cable Subscription", id: "cable" },
    { title: "Utility Bills Payment", id: "utility" },
    { title: "Remita Payments", id: "remita" },
    { title: "School Fees Payment", id: "school" },
    { title: "Funds Transfer", id: "transfer" },
    { title: "Virtual Cards", id: "cards" },
    { title: "Business Portfolio", id: "portfolio" },
  ];

  const handleSignIn = () => {
    setPlatformInitialView("sign-in");
    setShowPlatform(true);
  };

  const handleSignUp = () => {
    setPlatformInitialView("sign-up");
    setShowPlatform(true);
  };

  return (
    <nav className="bg-gradient-to-r from-primary-dark-blue via-deep-dark-blue to-primary-dark-blue fixed w-full z-50 backdrop-blur-md border-b border-white/10 shadow-glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 md:h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-md"></div>
              <img 
                src={logo} 
                alt="eVault Logo" 
                className="relative h-10 w-10 md:h-16 md:w-16 sm:h-12 sm:w-12 drop-shadow-lg rounded-full" 
              />
            </div>
            <span className="mt-[2rem] mr-[2rem] text-xl font-bold text-white hidden md:block bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              Vault
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection("about")}
              className="relative group text-gray-300 hover:text-white text-lg transition-all duration-300"
            >
              About
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-300 group-hover:w-full"></span>
            </button>

            {/* Services Dropdown */}
            <div className="relative group">
              <button className="flex items-center relative group text-gray-300 hover:text-white text-lg transition-all duration-300">
                Services
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-300 group-hover:w-full"></span>
                <ChevronDown className="ml-1 w-5 h-5" />
              </button>
              <div className="absolute left-0 mt-2 w-64 bg-gradient-to-br from-primary-dark-blue/95 to-deep-dark-blue/95 backdrop-blur-md border border-white/10 shadow-glass rounded-lg z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top">
                <div className="py-2">
                  {services.map((service, index) => (
                    <button
                      key={service.id}
                      onClick={() => scrollToSection(service.id)}
                      className={`block w-full text-left px-4 py-2 text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-200
                        ${index === 0 ? "rounded-t-lg" : ""} 
                        ${index === services.length - 1 ? "rounded-b-lg" : ""}`}
                    >
                      {service.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => scrollToSection("features")}
              className="relative group text-gray-300 hover:text-white text-lg transition-all duration-300"
            >
              Features
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="relative group text-gray-300 hover:text-white text-lg transition-all duration-300"
            >
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-300 group-hover:w-full"></span>
            </button>
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={handleLanguageSwitch}
              className="flex items-center px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 backdrop-blur-sm"
            >
              <Globe className="h-5 w-5 mr-1" />
              {language}
            </button>
            <button
              onClick={handleSignIn}
              className="flex items-center px-4 py-2 text-orange-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 backdrop-blur-sm"
            >
              <FaSignInAlt className="h-5 w-5 mr-2" />
              Sign In
            </button>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg blur opacity-75"></div>
              <button
                onClick={handleSignUp}
                className="relative flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:shadow-glow transition-all duration-300 transform hover:scale-105"
              >
                <FaUserPlus className="h-5 w-5 mr-2" />
                Sign Up
              </button>
            </div>
          </div>

          {/* Hamburger Menu */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-300 hover:text-white focus:outline-none transition-colors duration-300"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.4 }}
            className="fixed inset-y-0 right-0 bg-gradient-to-br from-primary-dark-blue/95 to-deep-dark-blue/95 backdrop-blur-md border-l border-white/10 shadow-glass w-3/4 max-w-sm z-50 p-6"
          >
            {/* Mobile Logo */}
            <div className="flex items-center justify-between mb-6">
              <img src={logo} alt="eVault Logo" className="h-10 w-10" />
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-300 hover:text-white focus:outline-none transition-colors duration-300"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Mobile Links */}
            <div className="space-y-4">
              {["About", "Features", "Contact"].map((link) => (
                <button
                  key={link}
                  onClick={() => scrollToSection(link.toLowerCase())}
                  className="block w-full text-left text-gray-300 hover:text-white text-lg transition-colors duration-300"
                >
                  {link}
                </button>
              ))}

              {/* Mobile Services Dropdown */}
              <div>
                <button
                  onClick={() => setIsServicesOpen(!isServicesOpen)}
                  className="flex justify-between w-full text-left text-gray-300 hover:text-white text-lg transition-colors duration-300"
                >
                  Services
                  {isServicesOpen ? <ChevronUp /> : <ChevronDown />}
                </button>
                <AnimatePresence>
                  {isServicesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="ml-4 mt-2 space-y-2"
                    >
                      {services.map((service) => (
                        <button
                          key={service.id}
                          onClick={() => scrollToSection(service.id)}
                          className="block w-full text-left text-gray-300 hover:text-white transition-colors duration-300"
                        >
                          {service.title}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-white/10 my-4"></div>

            {/* Mobile Actions */}
            <div className="space-y-4">
              <button
                onClick={handleLanguageSwitch}
                className="flex items-center px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 w-full text-left backdrop-blur-sm"
              >
                <Globe className="h-5 w-5 mr-2" />
                {language}
              </button>

              <button
                onClick={handleSignIn}
                className="flex items-center px-4 py-2 text-orange-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 w-full text-left backdrop-blur-sm"
              >
                <FaSignInAlt className="h-5 w-5 mr-2" />
                Sign In
              </button>

              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg blur opacity-75"></div>
                <button
                  onClick={handleSignUp}
                  className="relative flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:shadow-glow transition-all duration-300 w-full text-left"
                >
                  <FaUserPlus className="h-5 w-5 mr-2" />
                  Sign Up
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;