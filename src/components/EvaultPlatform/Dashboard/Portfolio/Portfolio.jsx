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
          <div className="space-y-4 md:space-y-6">
            <PersonalInfo />
            
            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">Services & Payments</h2>
              <Services />
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">Transaction History</h2>
              <HistoryList />
            </div>
          </div>
        );
    }
  };

  return (
    <AccountsProvider>
      <div className="portfolio">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          <TabNavigation 
            currentView={currentView} 
            setCurrentView={setCurrentView}
          />
          {renderContent()}
        </div>
      </div>
    </AccountsProvider>
  );
};

export default Portfolio;