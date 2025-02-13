import React, { useState } from "react";
import { useTransition, animated, config } from '@react-spring/web'; 
import { useLocation } from 'react-router-dom';
import MainLayout from "./layout/MainLayout";
import Navbar from "./Navbar";
import SignUp from "./signup/SignUp";
import SignIn from "./signin/SignIn";
import ConfigureSecurity from "./security/ConfigureSecurity";
import Dashboard from "./Dashboard/Dashboard";
import VendorDetails from "./InstantPayments/VendorDetails";
import Databundles from "./Dashboard/Services/Databundles";
import Airtime from "./Dashboard/Services/Airtime";
import Electricity from "./Dashboard/Services/Electricity";
import Cable from "./Dashboard/Services/Cable";
import InstantPayments from "./InstantPayments/InstantPayments";

function App({ initialView = "instant-payments", onBack }) {
  const location = useLocation();
  const [currentView, setCurrentView] = useState(
    location.state?.returnToSignIn ? "sign-in" : initialView
  );
  const [selectedVendor, setSelectedVendor] = useState(null);

  const handleNavigation = (view, vendor = null) => {
    setSelectedVendor(view === "vendor-details" ? vendor : null);
    setCurrentView(view);
  };

  const transitions = useTransition(currentView, {
    from: { 
      opacity: 0,
      transform: "translate3d(100%,0,0)",
      position: "absolute"
    },
    enter: { 
      opacity: 1, 
      transform: "translate3d(0%,0,0)",
      position: "relative"
    },
    leave: { 
      opacity: 0, 
      transform: "translate3d(-50%,0,0)",
      position: "absolute"
    },
    config: config.gentle,
    immediate: false,
  });

  const renderComponent = () => {
    console.log('Current view:', currentView); 
    switch (currentView) {
      case "instant-payments":
        return (
          <InstantPayments 
            onSelectVendor={(vendor) => handleNavigation("vendor-details", vendor)}
            onNavigate={handleNavigation}
          />
        );
      case "sign-in":
        return (
          <SignIn
            onContinue={() => {
              localStorage.setItem('isAuthenticated', 'true');
              window.location.href = '/dashboard';
            }}
            onSignUp={() => handleNavigation("sign-up")}
          />
        );
      case "sign-up":
        return <SignUp onCancel={() => handleNavigation("instant-payments")} />;
      case "configure-security":
        return (
          <ConfigureSecurity
            onSkip={() => {
              localStorage.setItem('isAuthenticated', 'true');
              window.location.href = '/dashboard';
            }}
            onComplete={() => {
              localStorage.setItem('isAuthenticated', 'true');
              window.location.href = '/dashboard';
            }}
          />
        );
      case "vendor-details":
        return (
          <VendorDetails
            vendor={selectedVendor}
            onBack={() => handleNavigation("instant-payments")}
          />
        );
      case "dashboard":
        return <Dashboard />;
      case "databundles":
        return <Databundles onBack={() => handleNavigation("instant-payments")} />;
      case "airtime":
        return <Airtime onBack={() => handleNavigation("instant-payments")} />;
      case "electricity":
        return <Electricity onBack={() => handleNavigation("instant-payments")} />;
      case "cable":
        return <Cable onBack={() => handleNavigation("instant-payments")} />;
      default:
        return (
          <InstantPayments 
            onSelectVendor={(vendor) => handleNavigation("vendor-details", vendor)}
            onNavigate={handleNavigation}
          />
        );
    }
  };

  return (
    <>
      <Navbar onNavigate={handleNavigation} currentView={currentView} />
      <MainLayout>
        {transitions((style, item) => (
          <animated.div 
            style={{
              ...style,
              width: "100%",
              height: "100%"
            }}
          >
            {renderComponent()} 
          </animated.div>
        ))}
      </MainLayout>
    </>
  );
}

export default App;