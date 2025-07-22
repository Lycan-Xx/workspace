
import React from 'react';
import { useSpring, animated } from "react-spring";
import Trade from '../Trade';
import Vault from '../Vault/Vault';
import Portfolio from '../Portfolio/Portfolio';
import Settings from '../SettingsApp';
import DepositForm from '../TabContents/DepositForm';
import TransferForm from '../TabContents/TransferForm';

const ContentRenderer = ({ selectedTab, selectedSetting }) => {
  const contentSpring = useSpring({
    opacity: selectedTab !== "Dashboard" ? 1 : 0,
    transform: selectedTab !== "Dashboard" ? "translateY(0px)" : "translateY(20px)",
    config: { tension: 200, friction: 25 },
  });

  const renderTabContent = () => {
    switch (selectedTab) {
      case "Trade":
        return <Trade />;
      case "Vault":
        return <Vault />;
      case "Portfolio":
        return <Portfolio />;
      case "Settings":
        return <Settings selectedSetting={selectedSetting} />;
      case "Vault Top Up":
        return <DepositForm />;
      case "Transfer":
        return <TransferForm />;
      default:
        return null;
    }
  };

  return (
    <animated.div style={contentSpring} className="w-full">
      {selectedTab !== "Dashboard" && (
        <div className="bg-white rounded-lg shadow-sm min-h-[600px]">
          {renderTabContent()}
        </div>
      )}
    </animated.div>
  );
};

export default ContentRenderer;
