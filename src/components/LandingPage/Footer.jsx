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
    <footer id="contact" className="bg-[#083060] text-white px-6 md:px-16 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-extrabold mb-4">
              <Link to="/">eVault</Link>
            </h3>
            <p className="text-gray-300 mb-4 font-mono">
              eVault offers the best and most secure way to recharge data, airtime, cable, and more at the best prices with instant delivery.
            </p>
            <div className="flex space-x-4">
              <Facebook className="w-6 h-6 cursor-pointer hover:text-orange-500" />
              <BsTwitterX className="w-6 h-6 cursor-pointer hover:text-orange-500" />
              <Instagram className="w-6 h-6 cursor-pointer hover:text-orange-500" />
            </div>
          </div>

          {/* Explore Section */}
          <div>
            <h4 className="font-extrabold mb-4">Explore</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-orange-500">
                  Home
                </Link>
              </li>
              <li>
                <a href="#about" className="text-gray-300 hover:text-orange-500">
                  About
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-300 hover:text-orange-500">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Services Section */}
          <div>
            <h4 className="font-extrabold mb-4">Services</h4>
            <ul className="space-y-2 text-gray-300 font-sans">
              <li>Airtime TopUp</li>
              <li>Buy Data</li>
              <li>Cable Subscription</li>
              <li>Electricity Bill</li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h4 className="font-extrabold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="tel:+2348140332887">
                  <FaPhone className="inline-block mr-2" />
                  +234 8140332887
                </a>
              </li>
              <li>
                <a href="mailto:support@evault.com.ng">
                  <FaEnvelope className="inline-block mr-2" />
                  support@evault.com.ng
                </a>
              </li>
              <li>
                <FaMapMarkerAlt className="inline-block mr-2" />
                No 29 Atiku Abubakar Mall, Numan road, Adamawa State, NG
              </li>
            </ul>
          </div>
        </div>

        {/* Install App Section */}
        <div className="grid md:grid-cols-2 gap-8 mt-12 text-gray-300">
          <div>
            <h4 className="font-extrabold mb-4">Install The App</h4>
            <p>Get our app for the best experience on the go!</p>
            <div className="flex space-x-4 mt-4">
              <a
                href="#"
                className="bg-transparent text-black px-4 py-2 flex items-center space-x-2 rounded-md hover:opacity-90"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                  alt="Download on Google Play"
                  className="h-10 w-auto"
                />
              </a>
              <a
                href="#"
                className="bg-transparent text-black px-4 py-2 flex items-center space-x-2 rounded-md hover:opacity-90"
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

        {/* Bottom Section */}
        <div className="border-t border-gray-400 mt-12 pt-8 text-gray-300">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4">
            <p className="text-left text-gray-300">
              Powered By <b>Bell MFB</b>
            </p>
            <div className="text-right text-gray-300 flex items-center space-x-4 mt-6 md:mt-0">
              <Link to="/privacy-policy" className="hover:text-orange-500">Privacy Policy</Link>
              <span>|</span>
              <Link to="/terms-and-conditions" className="hover:text-orange-500">Terms & Conditions</Link>
            </div>
          </div>
          
          <div className="text-center pt-4">
            <p className="text-gray-300">
              &copy; eVault - iSERVBAY, {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
