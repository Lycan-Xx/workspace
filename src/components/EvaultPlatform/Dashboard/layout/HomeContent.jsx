
import React from 'react';
import { useSpring, animated } from "react-spring";
import { FaExchangeAlt } from "react-icons/fa";
import PaymentCards from '../PaymentCard';
import ServiceCardsDescription from '../ServiceCardsDescription';
import TabContent from '../TabContents/TabContent';
import HistoryList from '../TabContents/HistoryList';

const HomeContent = ({ 
  selectedTab,
  services,
  onServiceClick,
  onTransfer,
  onRequestCard,
  cardData,
  setCardData
}) => {
  const homeSpring = useSpring({
    opacity: selectedTab === "Dashboard" ? 1 : 0,
    transform: selectedTab === "Dashboard" ? "translateY(0px)" : "translateY(-20px)",
    config: { tension: 200, friction: 25 },
  });

  return (
    <animated.div style={homeSpring} className="w-full space-y-6">
      {selectedTab === "Dashboard" && (
        <>
          {/* Payment Cards Section */}
          <div className="rounded-lg shadow-none overflow-hidden">
            <PaymentCards 
              onRequestCard={onRequestCard}
              cards={cardData}
              setCards={setCardData}
            />
          </div>

          {/* Welcome/Info Section */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <TabContent />
          </div>

          {/* Transfer Button */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={onTransfer}
              className="flex flex-col items-center justify-center p-6 rounded-lg bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 min-h-[120px]"
            >
              <FaExchangeAlt className="text-3xl mb-3" />
              <span className="font-bold text-lg">Transfer Funds</span>
              <span className="text-sm opacity-90 mt-1">Send money instantly</span>
            </button>
          </div>

          {/* Services Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Services</h3>
            <ServiceCardsDescription
              services={services}
              onServiceClick={onServiceClick}
            />
          </div>

          {/* Transaction History */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Transactions</h3>
            <HistoryList />
          </div>
        </>
      )}
    </animated.div>
  );
};

export default HomeContent;
