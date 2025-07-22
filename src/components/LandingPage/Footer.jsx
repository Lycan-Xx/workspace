import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram } from 'lucide-react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { BsTwitterX } from 'react-icons/bs';

const Footer = ({ setLanguage }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <footer id="contact" className="bg-gradient-to-br from-footer-dark-blue via-deep-dark-blue to-primary-dark-blue text-white px-6 md:px-16 py-16 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <h3 className="text-2xl font-extrabold">
              <Link to="/" className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                eVault
              </Link>
            </h3>
            <p className="text-gray-300 leading-relaxed">
              eVault offers the best and most secure way to recharge data, airtime, cable, and more at the best prices with instant delivery.
            </p>
            <div className="flex space-x-4">
              <div className="relative group p-2">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg blur opacity-0 group-hover:opacity-50 transition duration-300"></div>
                <Facebook className="relative w-6 h-6 cursor-pointer text-gray-300 hover:text-white transition-colors duration-300 transform hover:scale-110" />
              </div>
              <div className="relative group p-2">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-900 rounded-lg blur opacity-0 group-hover:opacity-50 transition duration-300"></div>
                <BsTwitterX className="relative w-6 h-6 cursor-pointer text-gray-300 hover:text-white transition-colors duration-300 transform hover:scale-110" />
              </div>
              <div className="relative group p-2">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg blur opacity-0 group-hover:opacity-50 transition duration-300"></div>
                <Instagram className="relative w-6 h-6 cursor-pointer text-gray-300 hover:text-white transition-colors duration-300 transform hover:scale-110" />
              </div>
            </div>
          </div>

          {/* Explore Section */}
          <div className="space-y-6">
            <h4 className="font-extrabold text-lg text-white">Explore</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-300 hover:text-orange-400 transition-colors duration-300 hover:translate-x-1 transform inline-block">
                  Home
                </Link>
              </li>
              <li>
                <a href="#about" className="text-gray-300 hover:text-orange-400 transition-colors duration-300 hover:translate-x-1 transform inline-block">
                  About
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-300 hover:text-orange-400 transition-colors duration-300 hover:translate-x-1 transform inline-block">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Services Section */}
          <div className="space-y-6">
            <h4 className="font-extrabold text-lg text-white">Services</h4>
            <ul className="space-y-3 text-gray-300">
              <li className="hover:text-orange-400 transition-colors duration-300 cursor-pointer hover:translate-x-1 transform">Airtime TopUp</li>
              <li className="hover:text-orange-400 transition-colors duration-300 cursor-pointer hover:translate-x-1 transform">Buy Data</li>
              <li className="hover:text-orange-400 transition-colors duration-300 cursor-pointer hover:translate-x-1 transform">Cable Subscription</li>
              <li className="hover:text-orange-400 transition-colors duration-300 cursor-pointer hover:translate-x-1 transform">Electricity Bill</li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="space-y-6">
            <h4 className="font-extrabold text-lg text-white">Contact</h4>
            <ul className="space-y-4 text-gray-300">
              <li>
                <a href="tel:+2348140332887" className="flex items-center hover:text-orange-400 transition-colors duration-300 group">
                  <FaPhone className="mr-3 group-hover:animate-pulse" />
                  +234 8140332887
                </a>
              </li>
              <li>
                <a href="mailto:support@evault.com.ng" className="flex items-center hover:text-orange-400 transition-colors duration-300 group">
                  <FaEnvelope className="mr-3 group-hover:animate-pulse" />
                  support@evault.com.ng
                </a>
              </li>
              <li className="flex items-start">
                <FaMapMarkerAlt className="mr-3 mt-1 text-orange-500" />
                <span>No 29 Atiku Abubakar Mall, Numan road, Adamawa State, NG</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Install App Section */}
        <div className="grid md:grid-cols-2 gap-8 mt-16 pt-8 border-t border-white/10">
          <div className="space-y-6">
            <h4 className="font-extrabold text-lg text-white">Install The App</h4>
            <p className="text-gray-300">Get our app for the best experience on the go!</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-green-600 rounded-lg blur opacity-0 group-hover:opacity-25 transition duration-300"></div>
                <a
                  href="#"
                  className="relative block bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                    alt="Download on Google Play"
                    className="h-10 w-auto"
                  />
                </a>
              </div>
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg blur opacity-0 group-hover:opacity-25 transition duration-300"></div>
                <a
                  href="#"
                  className="relative block bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <img
                    src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                    alt="Download on the App Store"
                    className="h-10 w-auto"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4">
            <p className="text-gray-300">
              Powered By <span className="text-orange-400 font-semibold">Bell MFB</span>
            </p>
            <div className="flex items-center space-x-6 mt-6 md:mt-0">
              <Link to="/privacy-policy" className="text-gray-300 hover:text-orange-400 transition-colors duration-300">
                Privacy Policy
              </Link>
              <span className="text-gray-500">|</span>
              <Link to="/terms-and-conditions" className="text-gray-300 hover:text-orange-400 transition-colors duration-300">
                Terms & Conditions
              </Link>
            </div>
          </div>
          
          <div className="text-center pt-4 border-t border-white/5">
            <p className="text-gray-400">
              &copy; eVault - iSERVBAY, {new Date().getFullYear()}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;