import React, { useState } from "react";
import { Sidebar } from "./portfolio-settings/Layout/Sidebar";
import { PersonalInfo } from "./portfolio-settings/Profile/PersonalInfo";
import AdminPage from "./portfolio-settings/AdminPage";
import HistoryList from "./portfolio-settings/HistoryList";
import Services from "./portfolio-settings/Services/Services";

const Portfolio = () => {
  const [currentView, setCurrentView] = useState("info");

  const renderContent = () => {
    switch (currentView) {
      case "admin":
        return <AdminPage />;
      case "info":
      default:
        return (
          <div className="space-y-6">
            <PersonalInfo />
            
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Services & Payments</h2>
              <Services />
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Transaction History</h2>
              <HistoryList />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      <main className="pl-64 min-h-screen">
        <div className="max-w-7xl mx-auto p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Portfolio;