
import React from 'react';
import Sidebar from '../SideBar';
import TopBar from '../TopBar';

const DashboardLayout = ({ 
  children, 
  selectedTab, 
  setSelectedTab, 
  isSidebarCollapsed, 
  setIsSidebarCollapsed,
  onSettingSelect 
}) => {
  return (
    <div className="relative min-h-screen flex">
      {/* Background layers */}
      <div className="absolute inset-0 bg-white"></div>
      <div className="absolute inset-0 bg-black/10"></div>

      {/* Sidebar */}
      <Sidebar
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
        user={undefined}
        className="relative z-10"
      />

      {/* Main content area */}
      <div
        className={`transition-all duration-300 flex-1 relative z-20 ${
          isSidebarCollapsed ? "md:ml-20" : "md:ml-64"
        }`}
      >
        {/* Top bar */}
        <div className="p-4 md:p-6">
          <TopBar 
            setSelectedTab={setSelectedTab} 
            onSettingSelect={onSettingSelect}
          />
        </div>

        {/* Content area with proper spacing and responsiveness */}
        <div className="px-4 md:px-6 pb-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
