import React, { useState } from "react";
import { useTransition, animated, config } from "@react-spring/web";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import SignUp from "./signup/SignUp";
import SignIn from "./signin/SignIn";
import ConfigureSecurity from "./authentication/security/ConfigureSecurity";
import Dashboard from "./Dashboard/Dashboard";
import Databundles from "./Dashboard/Services/Databundles";
import Airtime from "./Dashboard/Services/Airtime";
import Electricity from "./Dashboard/Services/Electricity";
import Cable from "./Dashboard/Services/Cable";
import InstantPayments from "./InstantPayments/InstantPayments";
import MainLayout from "./layout/MainLayout";
import Footer from "./Footer";
import PocketBaseSetup from "./setup/PocketBaseSetup";
// Remove store and persistor imports

function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#025798]"></div>
    </div>
  );
}

function App({ initialView = "instant-payments", onBack }) {
  const location = useLocation();
  const [currentView, setCurrentView] = useState(
    location.state?.returnToSignIn ? "sign-in" : initialView,
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
      position: "absolute",
    },
    enter: {
      opacity: 1,
      transform: "translate3d(0%,0,0)",
      position: "relative",
    },
    leave: {
      opacity: 0,
      transform: "translate3d(-50%,0,0)",
      position: "absolute",
    },
    config: config.gentle,
    immediate: false,
  });

  // Auth views that need special layout
  const isAuthView = ["sign-in", "sign-up", "configure-security"].includes(
    currentView,
  );

  const renderComponent = () => {
    console.log("Current view:", currentView);
    switch (currentView) {
      case "instant-payments":
        return (
          <InstantPayments
            onSelectVendor={(vendor) =>
              handleNavigation("vendor-details", vendor)
            }
            onNavigate={handleNavigation}
          />
        );
      case "sign-in":
        return (
          <SignIn onSignUp={() => handleNavigation("sign-up")} />
        );
      case "sign-up":
        return <SignUp onCancel={() => handleNavigation("instant-payments")} />;
      case "configure-security":
        return <ConfigureSecurity />;

      case "dashboard":
        return <Dashboard />;
      case "databundles":
        return (
          <Databundles onBack={() => handleNavigation("instant-payments")} />
        );
      case "airtime":
        return <Airtime onBack={() => handleNavigation("instant-payments")} />;
      case "electricity":
        return (
          <Electricity onBack={() => handleNavigation("instant-payments")} />
        );
      case "cable":
        return <Cable onBack={() => handleNavigation("instant-payments")} />;
      case "pocketbase-setup":
        return <PocketBaseSetup />;
      default:
        return (
          <InstantPayments
            onSelectVendor={(vendor) =>
              handleNavigation("vendor-details", vendor)
            }
            onNavigate={handleNavigation}
          />
        );
    }
  };

  return (
    <>
      <Navbar onNavigate={handleNavigation} currentView={currentView} />
      <MainLayout isAuthView={isAuthView}>
        <div
          className={`
          ${
            isAuthView
              ? "max-w-2xl mx-auto p-4 lg:p-8 flex items-center justify-center min-h-[calc(100vh-3.5rem)]"
              : "max-w-4xl mx-auto p-4 lg:p-8"
          }
        `}
        >
          {transitions((style, item) => (
            <animated.div
              style={{
                ...style,
                width: "100%",
                height: isAuthView ? "auto" : "100%",
              }}
              className={isAuthView ? "flex items-center justify-center" : ""}
            >
              {renderComponent()}
            </animated.div>
          ))}
        </div>
      </MainLayout>
    </>
  );
}

export default App;
