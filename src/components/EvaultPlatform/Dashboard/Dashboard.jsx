import React, { useState } from "react";
import DashboardLayout from "./layout/DashboardLayout";
import HomeContent from "./layout/HomeContent";
import ContentRenderer from "./layout/ContentRenderer";
import TransferForm from "./TabContents/TransferForm";
import VirtualCardRequest from "./VirtualCardRequest";
import { FaGlobe, FaSchool, FaPhoneAlt, FaBolt, FaReceipt, FaTv } from "react-icons/fa";

// Service components
import Databundles from "./Services/Databundles";
import SchoolFees from "./Services/SchoolFees/SchoolFees";
import Airtime from "./Services/Airtime";
import Electricity from "./Services/Electricity";
import Remita from "./Services/Remita";
import Cable from "./Services/Cable";

const Dashboard = () => {
  // State management
  const [selectedTab, setSelectedTab] = useState("Dashboard");
  const [selectedService, setSelectedService] = useState(null);
  const [selectedSetting, setSelectedSetting] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [showVirtualCardRequest, setShowVirtualCardRequest] = useState(false);

  // Card data state
  const [cardData, setCardData] = useState([
    {
      name: "Monie Point",
      balance: "₦45,450.00",
      cardNumber: "**** **** **** 5678",
      expiry: "06/26",
      cardholder: "Jane Doe",
    },
  ]);

  // Services configuration
  const services = [
    {
      title: "Data Bundles",
      description: "Purchase data packages",
      icon: <FaGlobe className="text-blue-500 text-3xl" />,
      component: "Databundles",
    },
    {
      title: "School Fees Payment",
      description: "Pay school fees online",
      icon: <FaSchool className="text-orange-500 text-3xl" />,
      component: "SchoolFees",
    },
    {
      title: "Airtime Recharge",
      description: "Top up airtime balance",
      icon: <FaPhoneAlt className="text-green-500 text-3xl" />,
      component: "Airtime",
    },
    {
      title: "Electricity",
      description: "Buy electricity units",
      icon: <FaBolt className="text-yellow-500 text-3xl" />,
      component: "Electricity",
    },
    {
      title: "Remita Payments",
      description: "Government & bill payments",
      icon: <FaReceipt className="text-purple-500 text-3xl" />,
      component: "Remita",
    },
    {
      title: "Cable Subscriptions",
      description: "TV subscription payments",
      icon: <FaTv className="text-red-500 text-3xl" />,
      component: "Cable",
    },
  ];

  // Event handlers
  const handleServiceClick = (service) => {
    setSelectedService(service.component);
  };

  const handleBack = () => {
    setSelectedService(null);
  };

  const handleTransfer = () => {
    setShowTransferForm(true);
  };

  const handleBackClick = () => {
    setShowTransferForm(false);
  };

  const handleVirtualCardRequest = () => {
    setShowVirtualCardRequest(true);
  };

  const handleAddCard = (newCard) => {
    setCardData(prevCards => [...prevCards, newCard]);
    setShowVirtualCardRequest(false);
  };

  const handleSettingSelect = (setting) => {
    setSelectedTab('Settings');
    setSelectedSetting(setting);
  };

  // Service component renderer
  const renderSelectedService = () => {
    if (!selectedService) return null;

    const serviceProps = { onBack: handleBack };

    switch (selectedService) {
      case "Databundles":
        return <Databundles {...serviceProps} />;
      case "SchoolFees":
        return <SchoolFees {...serviceProps} />;
      case "Airtime":
        return <Airtime {...serviceProps} />;
      case "Electricity":
        return <Electricity {...serviceProps} />;
      case "Remita":
        return <Remita {...serviceProps} />;
      case "Cable":
        return <Cable {...serviceProps} />;
      default:
        return null;
    }
  };

  // Main content renderer
  const renderMainContent = () => {
    if (showTransferForm) {
      return (
        <div className="bg-white rounded-lg shadow-sm">
          <TransferForm onBack={handleBackClick} />
        </div>
      );
    }

    if (selectedService) {
      return (
        <div className="bg-white rounded-lg shadow-sm min-h-[600px]">
          {renderSelectedService()}
        </div>
      );
    }

    return (
      <>
        <HomeContent
          selectedTab={selectedTab}
          services={services}
          onServiceClick={handleServiceClick}
          onTransfer={handleTransfer}
          onRequestCard={handleVirtualCardRequest}
          cardData={cardData}
          setCardData={setCardData}
        />
        <ContentRenderer 
          selectedTab={selectedTab} 
          selectedSetting={selectedSetting}
        />
      </>
    );
  };

  return (
    <>
      <DashboardLayout
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
        onSettingSelect={handleSettingSelect}
      >
        {renderMainContent()}
      </DashboardLayout>

      {/* Modals */}
      {showVirtualCardRequest && (
        <VirtualCardRequest 
          onClose={() => setShowVirtualCardRequest(false)}
          addCard={handleAddCard}
        />
      )}
    </>
  );
};

export default Dashboard;