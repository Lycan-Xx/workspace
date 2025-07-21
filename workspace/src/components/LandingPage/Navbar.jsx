import React, { useState } from "react";
import { Menu, X, Globe, ChevronDown } from "lucide-react";
import { FaUser } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import logo from "../assets/evault-new-logo.png";

const Navbar = ({ language, setLanguage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [showPlatform, setShowPlatform] = useState(false);
  const [platformInitialView, setPlatformInitialView] = useState("sign-in");

  const services = [
    { title: "Airtime Top Up", id: "airtime", category: "Mobile" },
    { title: "Buy Data", id: "data", category: "Mobile" },
    { title: "Cable Subscription", id: "cable", category: "Bills" },
    { title: "Utility Bills Payment", id: "utility", category: "Bills" },
    { title: "Remita Payments", id: "remita", category: "Government" },
    { title: "School Fees Payment", id: "school", category: "Education" },
    { title: "Funds Transfer", id: "transfer", category: "Financial" },
    { title: "Virtual Cards", id: "cards", category: "Financial" },
    { title: "Business Portfolio", id: "portfolio", category: "Business" },
  ];

  const serviceCategories = {
    Mobile: services.filter(s => s.category === "Mobile"),
    Bills: services.filter(s => s.category === "Bills"),
    Financial: services.filter(s => s.category === "Financial"),
    Government: services.filter(s => s.category === "Government"),
    Education: services.filter(s => s.category === "Education"),
    Business: services.filter(s => s.category === "Business"),
  };

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
    }
  };

  const handleHome = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsOpen(false);
  };

  const handleSignIn = () => {
    window.open('https://app.evault.com.ng/mobile/login/', '_blank');
  };

  const handleSignUp = () => {
    window.open('https://app.evault.com.ng/mobile/register/', '_blank');
  };

  const handleServiceClick = (serviceId) => {
    console.log(`Navigate to ${serviceId} service`);
    setIsServicesOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-primary-dark-blue via-deep-dark-blue to-primary-dark-blue fixed w-full z-50 backdrop-blur-md border-b border-white/10 shadow-glass">
      <div className="max-w-content mx-auto px-sm tablet:px-md desktop:px-lg">
        <div className="flex justify-between items-center h-14 tablet:h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-md"></div>
              <img 
                src={logo} 
                alt="eVault Logo" 
                className="relative h-10 w-10 tablet:h-16 tablet:w-16 drop-shadow-lg rounded-full" 
              />
            </div>
            <span className="ml-sm text-xl font-bold text-white hidden tablet:block bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              Vault
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden tablet:flex items-center space-x-component-h">
            <button
              onClick={handleHome}
              className="relative group text-gray-300 hover:text-white text-lg transition-all duration-300"
            >
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-300 group-hover:w-full"></span>
            </button>

            <button
              onClick={() => scrollToSection("about")}
              className="relative group text-gray-300 hover:text-white text-lg transition-all duration-300"
            >
              About
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-300 group-hover:w-full"></span>
            </button>

            <div 
              className="relative group"
              onMouseEnter={() => setIsServicesOpen(true)}
              onMouseLeave={() => setIsServicesOpen(false)}
            >
              <button
                className="relative group text-gray-300 hover:text-white text-lg transition-all duration-300 flex items-center"
              >
                Services
                <ChevronDown className={`ml-1 h-4 w-4 transition-transform duration-300 ${isServicesOpen ? 'rotate-180' : ''}`} />
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-300 group-hover:w-full"></span>
              </button>

             { /* Services Dropdown */}
              <AnimatePresence>
                {isServicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute -left-36 transform -translate-x-1/2 mt-2 w-96 border border-white/20 rounded-large shadow-2xl p-md z-50"
                    style={{
                      background: "rgba(6, 17, 41, 0.9)",
                      backdropFilter: "blur(16px)",
                      top: "calc(100% + 0.5rem)"
                    }}
                  >
                    <div className="grid grid-cols-2 gap-component-h">
                      {Object.entries(serviceCategories).map(([category, categoryServices]) => (
                        categoryServices.length > 0 && (
                          <div key={category} className="space-y-sm">
                            <h3 className="text-orange-400 font-semibold text-sm uppercase tracking-wide border-b border-orange-400/30 pb-1">
                              {category}
                            </h3>
                            <div className="space-y-xs">
                              {categoryServices.map((service) => (
                                <button
                                  key={service.id}
                                  onClick={() => handleServiceClick(service.id)}
                                  className="block w-full text-left text-gray-300 hover:text-white hover:bg-white/10 px-sm py-xs rounded-medium transition-all duration-200 text-sm"
                                >
                                  {service.title}
                                </button>
                              ))}
                            </div>
                          </div>
                        )
                      ))}
                    </div>
                    
                    {/* View All Services Button */}
                    <div className="mt-md pt-sm border-t border-white/10">
                      <button
                        onClick={() => {
                          scrollToSection("services");
                          setIsServicesOpen(false);
                        }}
                        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white px-sm py-xs rounded-medium font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300 text-sm"
                      >
                        View All Services
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => scrollToSection("offer")}
              className="relative group text-gray-300 hover:text-white text-lg transition-all duration-300"
            >
              Features
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-300 group-hover:w-full"></span>
            </button>

            <button
              onClick={() => scrollToSection("offer")}
              className="relative group text-gray-300 hover:text-white text-lg transition-all duration-300"
            >
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-300 group-hover:w-full"></span>
            </button>
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden tablet:flex items-center space-x-component-h">
            <button
              onClick={handleLanguageSwitch}
              className="flex items-center px-sm py-xs text-gray-300 hover:text-white hover:bg-white/10 rounded-medium transition-all duration-300 backdrop-blur-sm"
            >
              <Globe className="h-4 w-4 mr-2" />
              {language}
            </button>

            <button
              onClick={handleSignIn}
              className="text-gray-300 hover:text-white transition-colors duration-300 text-lg"
            >
              Sign In
            </button>
            
            <button
              onClick={handleSignUp}
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-md py-xs rounded-medium font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105"
            >
              Sign Up
            </button>
          </div>

          {/* Hamburger Menu */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="tablet:hidden text-gray-300 hover:text-white focus:outline-none transition-colors duration-300"
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
            className="fixed inset-y-0 right-0 bg-gradient-to-br from-primary-dark-blue/95 to-deep-dark-blue/95 backdrop-blur-md border-l border-white/10 shadow-glass w-3/4 max-w-sm z-50 p-md"
          >
            {/* Mobile Logo */}
            <div>
              <img src={logo} alt="eVault Logo" className="h-10 w-10" />
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-300 hover:text-white focus:outline-none transition-colors duration-300"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
      
            {/* Mobile Links */}
            <div className="space-y-sm">
              {[
                { name: "Home", action: handleHome },
                { name: "About", action: () => scrollToSection("about") },
                { name: "Features", action: () => scrollToSection("offer") },
                { name: "Contact", action: () => scrollToSection("contact") }
              ].map((link) => (
                <button
                  key={link.name}
                  onClick={link.action}
                  className="block w-full text-left text-gray-300 hover:text-white text-lg transition-colors duration-300"
                >
                  {link.name}
                </button>
              ))}
            </div>

            {/* Mobile Services Section */}
            <div className="space-y-xs">
              <h3 className="text-orange-400 font-semibold text-sm uppercase tracking-wide">Services</h3>
              <div className="grid grid-cols-1 gap-xs max-h-48 overflow-y-auto">
                {services.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => {
                      handleServiceClick(service.id);
                      setIsOpen(false);
                    }}
                    className="text-left text-gray-300 hover:text-white hover:bg-white/10 px-sm py-xs rounded-medium transition-all duration-300 text-sm"
                  >
                    {service.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-white/10 my-sm"></div>

            {/* Mobile Actions */}
            <div className="space-y-sm">
              <button
                onClick={handleLanguageSwitch}
                className="flex items-center px-sm py-xs text-gray-300 hover:text-white hover:bg-white/10 rounded-medium transition-all duration-300 w-full text-left backdrop-blur-sm"
              >
                <Globe className="h-5 w-5 mr-2" />
                {language}
              </button>

              <button
                onClick={handleSignIn}
                className="flex items-center px-sm py-xs text-gray-300 hover:text-white hover:bg-white/10 rounded-medium transition-all duration-300 w-full text-left backdrop-blur-sm"
              >
                Sign In
              </button>

              <button
                onClick={handleSignUp}
                className="flex items-center px-sm py-xs bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300 w-full text-left"
              >
                Sign Up
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;