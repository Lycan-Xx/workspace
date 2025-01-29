import React, { useState } from "react";
import { useSpring, animated } from "react-spring";
import Sidebar from "../Dashboard/SideBar";
import TopBar from "./TopBar";
import PaymentCards from "../Dashboard/PaymentCard";
import ServiceCardsDescription from "./ServiceCardsDescription";
import Trade from "./Trade";
import Vault from "./Vault/Vault";
import Settings from "./SettingsApp";
import TabContent from "./TabContents/TabContent";
import Databundles from "./Services/Databundles";
import Schoolfees from "./Services/SchoolFees/Schoolfees";
import Airtime from "./Services/Airtime";
import Electricity from "./Services/Electricity";
import Remita from "./Services/Remita";
import Cable from "./Services/Cable";
import Portfolio from "./Portfolio/Portfolio";
import DepositForm from "./TabContents/DepositForm";
import TransferForm from "./TabContents/TransferForm";
import HistoryList from "./TabContents/HistoryList";
import { FaExchangeAlt, FaTachometerAlt, FaLock, FaWallet, FaCogs } from "react-icons/fa";
import VirtualCardRequest from "./VirtualCardRequest";

const Dashboard = () => {
  const [selectedTab, setSelectedTab] = useState("Dashboard");
  const [selectedService, setSelectedService] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [showVirtualCardRequest, setShowVirtualCardRequest] = useState(false);
  const [selectedSetting, setSelectedSetting] = useState(null);

  // Move card data state to Dashboard
  const [cardData, setCardData] = useState([
    {
      name: "Monie Point",
      balance: "₦45,450.00",
      cardNumber: "**** **** **** 5678",
      expiry: "06/26",
      cardholder: "Jane Doe",
    },
  ]);

  const services = [
    {
      title: "Data Bundles",
      description: "Purchase data",
      icon: <i className="fas fa-globe text-blue-500 text-3xl"></i>,
      component: "Databundles",
    },
    {
      title: "School Fees Payment",
      description: "Pay school fees",
      icon: <i className="fas fa-school text-orange-500 text-3xl"></i>,
      component: "Schoolfees",
    },
    {
      title: "Airtime Recharge",
      description: "Top up airtime",
      icon: <i className="fas fa-phone-alt text-green-500 text-3xl"></i>,
      component: "Airtime",
    },
    {
      title: "Electricity",
      description: "Buy power units",
      icon: <i className="fas fa-bolt text-yellow-500 text-3xl"></i>,
      component: "Electricity",
    },
    {
      title: "Remita Payments",
      description: "Remita services",
      icon: <i className="fas fa-receipt text-purple-500 text-3xl"></i>,
      component: "Remita",
    },
    {
      title: "Cable Subscriptions",
      description: "Subscribe to cable",
      icon: <i className="fas fa-tv text-red-500 text-3xl"></i>,
      component: "Cable",
    },
  ];

  const handleServiceClick = (service) => {
    setSelectedService(service.component); // Change: Pass the component name
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

  // Update handleAddCard function
  const handleAddCard = (newCard) => {
    setCardData(prevCards => [...prevCards, newCard]);
    setShowVirtualCardRequest(false);
  };

  const renderSelectedService = () => {
    if (!selectedService) return null;

    switch (selectedService) {
      case "Databundles":
        return <Databundles onBack={handleBack} />;
      case "Schoolfees":
        return <Schoolfees onBack={handleBack} />;
      case "Airtime":
        return <Airtime onBack={handleBack} />;
      case "Electricity":
        return <Electricity onBack={handleBack} />;
      case "Remita":
        return <Remita onBack={handleBack} />;
      case "Cable":
        return <Cable onBack={handleBack} />;
      default:
        return null;
    }
  };

  const renderTabContent = () => {
    switch (selectedTab) {
      case "Trade":
        return <Trade />;
      case "Vault":
        return <Vault />;
      case "Portfolio":
        return <Portfolio />;
      case "Settings":
        return <Settings />;
      case "Wallet Top Up":
        return <DepositForm />;
      case "Transfer":
        return <TransferForm />;
      default:
        return null;
    }
  };

  const homeSpring = useSpring({
    opacity: selectedTab === "Dashboard" ? 1 : 0,
    transform: selectedTab === "Dashboard" ? "translateY(0px)" : "translateY(-20px)",
    config: { tension: 200, friction: 25 },
  });

  const contentSpring = useSpring({
    opacity: selectedTab !== "Dashboard" ? 1 : 0,
    transform: selectedTab !== "Dashboard" ? "translateY(0px)" : "translateY(20px)",
    config: { tension: 200, friction: 25 },
  });

  const renderContent = () => {
    if (showTransferForm) {
      return <TransferForm onBack={handleBackClick} />;
    }

    if (selectedService) {
      return renderSelectedService();
    }

    return (
      <>
        <PaymentCards 
          onRequestCard={handleVirtualCardRequest}
          cards={cardData}
          setCards={setCardData}
        />
        <div className="border-xl bg-blue-600 rounded-xl p-0 my-4">
          <TabContent />
        </div>
        <button
          onClick={handleTransfer}
          className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
        >
          <span className="text-2xl mb-2">
            <FaExchangeAlt color="#E91E63" />
          </span>
          <span className="font-bold text-lg">Transfer Funds</span>
        </button>
        <div className="bg-white border rounded-lg p-4 my-4">
          <ServiceCardsDescription
            services={services}
            onServiceClick={handleServiceClick}
            className="grid grid-cols-2 md:grid-cols-3 gap-4"
          />
        </div>
        <div className="bg-white border rounded-lg p-4 my-4">
          <HistoryList />
        </div>
      </>
    );
  };

  return (
    <div className="relative min-h-screen flex">
      <div className="absolute inset-0 bg-white"></div>
      <div className="absolute inset-0 bg-black/10"></div>

      <Sidebar
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
        user={undefined} // Declare user as undefined since it has not been declared
        className="relative z-10"
      />

      <div
        className={`transition-all duration-300 flex-1 p-6 relative z-20 ${
          isSidebarCollapsed ? "md:ml-20" : "md:ml-64"
        }`}
      >
        <TopBar 
          setSelectedTab={setSelectedTab} 
          onSettingSelect={(setting) => {
            setSelectedTab('Settings');
            // You'll need to add state management for selected setting
            setSelectedSetting(setting);
          }}
        />
        <animated.div style={homeSpring}>
          {selectedTab === "Dashboard" && renderContent()}
        </animated.div>
        <animated.div style={contentSpring}>
          {selectedTab !== "Dashboard" && renderTabContent()}
        </animated.div>
        {showVirtualCardRequest && (
          <VirtualCardRequest 
            onClose={() => setShowVirtualCardRequest(false)}
            addCard={handleAddCard}
          />
        )}
      </div>
	  <div>
	  {showVirtualCardRequest && (
          <VirtualCardRequest 
            onClose={() => setShowVirtualCardRequest(false)}
            addCard={handleAddCard}
          />
        )}
	  </div>
    </div>
  );
};

export default Dashboard;