import React, { useState } from "react";
import { Menu, X, Globe, Wallet } from "lucide-react";
import { FaSignInAlt, FaUserPlus } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";

const Navbar = ({ language, setLanguage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Dropdown hover handlers
  let dropdownTimeout;
  const openDropdown = () => {
    clearTimeout(dropdownTimeout);
    setIsDropdownOpen(true);
  };

  const closeDropdown = () => {
    dropdownTimeout = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 200); // Small delay to allow hover over the dropdown
  };

  // Language switch handler
  const handleLanguageSwitch = () => {
    const languages = ["English", "Hausa", "Yoruba", "Igbo"];
    const currentIndex = languages.indexOf(language);
    const nextIndex = (currentIndex + 1) % languages.length;
    setLanguage(languages[nextIndex]);
  };

  // Scroll to section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false); // Close mobile menu after clicking
    }
  };

  const services = [
    { title: "Airtime Top Up", id: "airtime" },
    { title: "Exams Pin", id: "exams" },
    { title: "Buy Data", id: "data" },
    { title: "Cable Subscription", id: "cable" },
    { title: "Utility Bills Payment", id: "utility" },
    { title: "Bulk SMS", id: "sms" },
  ];

  return (
    <nav className="bg-white fixed w-full z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Wallet className="h-8 w-8 text-[#025798]" />
            <span className="ml-2 text-xl font-bold text-[#025798]">eVault</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection("about")}
              className="text-gray-700 hover:text-[#025798]"
            >
              About
            </button>
            <div
              className="relative group"
              onMouseEnter={openDropdown}
              onMouseLeave={closeDropdown}
            >
              <button className="text-gray-700 hover:text-[#025798]">Services</button>
              {isDropdownOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white text-gray-700 shadow-lg rounded-lg z-10">
                  {services.map((service, index) => (
                    <button
                      key={service.id}
                      onClick={() => scrollToSection(service.id)}
                      className={`block w-full text-left px-4 py-2 hover:bg-gray-100 transition-all duration-300 
                        ${index === 0 ? "rounded-t-lg" : ""} 
                        ${index === services.length - 1 ? "rounded-b-lg" : ""}`}
                    >
                      {service.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => scrollToSection("features")}
              className="text-gray-700 hover:text-[#025798]"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-gray-700 hover:text-[#025798]"
            >
              Contact
            </button>
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={handleLanguageSwitch}
              className="flex items-center text-gray-700 hover:text-[#025798]"
            >
              <Globe className="h-5 w-5 mr-1" />
              {language}
            </button>
            <button className="px-4 py-2 text-[#025798] hover:bg-gray-100 rounded-lg">
              Sign In
            </button>
            <button className="px-4 py-2 bg-[#025798] text-white rounded-lg hover:bg-[#024578]">
              Sign Up
            </button>
          </div>

          {/* Hamburger Menu */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-700 focus:outline-none"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white px-4 py-3 shadow-md rounded-b-lg"
          >
            <button
              onClick={() => scrollToSection("about")}
              className="block text-gray-700 hover:text-[#025798] w-full text-left py-2"
            >
              About
            </button>
            <details className="w-full">
              <summary className="text-gray-700 hover:text-[#025798] cursor-pointer">
                Services
              </summary>
              <div className="mt-2 ml-4 space-y-2">
                {services.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => scrollToSection(service.id)}
                    className="block w-full text-left text-gray-700 hover:text-[#025798] transition-colors"
                  >
                    {service.title}
                  </button>
                ))}
              </div>
            </details>
            <button
              onClick={() => scrollToSection("features")}
              className="block text-gray-700 hover:text-[#025798] w-full text-left py-2"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="block text-gray-700 hover:text-[#025798] w-full text-left py-2"
            >
              Contact
            </button>
            <button
              onClick={handleLanguageSwitch}
              className="flex items-center bg-blue-600 px-6 py-2 rounded-xl shadow-md hover:bg-blue-700 transition-all duration-300 text-white w-full mt-4"
            >
              <Globe className="mr-2" />
              {language}
            </button>
            <button className="block w-full bg-gray-600 px-6 py-2 rounded-xl shadow-md hover:bg-gray-700 transition-all duration-300 mt-2">
              Sign In
            </button>
            <button className="block w-full bg-[#025798] px-6 py-2 rounded-xl shadow-md hover:bg-[#024578] transition-all duration-300 mt-2">
              Sign Up
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
