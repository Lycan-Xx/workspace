import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTachometerAlt,
  FaLock,
  FaWallet,
  FaExchangeAlt,
  FaCogs,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const Sidebar = ({ selectedTab, setSelectedTab, setIsSidebarCollapsed }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setIsCollapsed(mobile);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    { name: "Dashboard", icon: <FaTachometerAlt color="#4CAF50" />, color: "#4CAF50" },
    { name: "Vault", icon: <FaLock color="#FF9800" />, color: "#FF9800" },
    { name: "Portfolio", icon: <FaWallet color="#2196F3" />, color: "#2196F3" },
    { name: "Transfer", icon: <FaExchangeAlt color="#E91E63" />, color: "#E91E63" },
    { name: "Settings", icon: <FaCogs color="#9C27B0" />, color: "#9C27B0" },
  ];

  const handleToggle = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    setIsSidebarCollapsed(newCollapsedState); // Notify parent of the collapsed state
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4">
        {!isCollapsed && (
          <h2 className="text-2xl font-bold text-blue-600">eVault</h2>
        )}
        {!isMobile && (
          <button
            onClick={handleToggle}
            className="text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <FaBars size={24} />
          </button>
        )}
      </div>

      {/* User Profile Section */}
      <div className="flex-1 px-4">
        <div className="mb-8 text-center">
          <img
            src="https://picsum.photos/id/237/200/300"
            alt="User"
            className={`rounded-full mx-auto mb-4 ${
              isCollapsed ? "w-12 h-12" : "w-20 h-20"
            }`}
          />
          {!isCollapsed && (
            <>
              <h3 className="text-lg font-bold text-gray-800">Usman Ahmad</h3>
              <p className="text-sm text-gray-600">Customer (User)</p>
            </>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                setSelectedTab(item.name);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center ${
                isCollapsed ? "justify-center" : "justify-start"
              } p-3 rounded-lg transition-colors ${
                selectedTab === item.name
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-blue-50"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {(!isCollapsed || isMobileMenuOpen) && (
                <span className="ml-3">{item.name}</span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Logout Button */}
      <button
        onClick={() => console.log("Logout")}
        className={`mx-4 mb-4 flex items-center p-3 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors ${
          isCollapsed ? "justify-center" : "justify-start"
        }`}
      >
        <FaSignOutAlt size={20} />
        {(!isCollapsed || isMobileMenuOpen) && <span className="ml-3">Logout</span>}
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={`hidden md:block fixed top-0 left-0 h-full bg-white shadow-lg z-40 ${
          isCollapsed ? "w-20" : "w-64"
        } transition-all duration-300`}
      >
        <SidebarContent />
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 left-0 h-full w-2/3 bg-white shadow-lg z-50 md:hidden"
            >
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={24} />
              </button>
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Menu Toggle */}
      {isMobile && (
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="fixed top-4 left-4 z-30 p-2 bg-white rounded-lg shadow-lg md:hidden"
        >
          <FaBars size={24} className="text-blue-600" />
        </button>
      )}
    </>
  );
};

export default Sidebar;