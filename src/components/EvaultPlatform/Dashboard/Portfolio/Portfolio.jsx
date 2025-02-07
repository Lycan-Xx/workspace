import React, { useState } from "react";
import { TabNavigation } from "./portfolio-settings/Layout/TabNavigation";
import { PersonalInfo } from "./portfolio-settings/Profile/PersonalInfo";
import AdminPage from "./portfolio-settings/AdminPage";
import HistoryList from "./portfolio-settings/HistoryList";
import Services from "./portfolio-settings/Services/Services";
import { AccountsProvider } from './portfolio-settings/Services/AccountsContext';

const Portfolio = () => {
  const [currentView, setCurrentView] = useState("info");

  const renderContent = () => {
    switch (currentView) {
      case "admin":
        return <AdminPage />;
      case "info":
      default:
        return (
          <div className="space-y-4 md:space-y-6 w-full">
            <PersonalInfo />
            
            <div className="bg-white rounded-xl shadow-sm p-3 md:p-4 overflow-x-hidden">
              <Services />
            </div>

            <div className="bg-white rounded-xl shadow-sm p-3 md:p-6 overflow-x-hidden">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">
                Transaction History
              </h2>
              <HistoryList />
            </div>
          </div>
        );
    }
  };

  return (
    <AccountsProvider>
      <div className="portfolio min-w-0 w-full">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-8 overflow-x-hidden">
          <div className="w-full">
            <TabNavigation 
              currentView={currentView} 
              setCurrentView={setCurrentView}
            />
            {renderContent()}
          </div>
        </div>
      </div>
    </AccountsProvider>
  );
};

export default Portfolio;
