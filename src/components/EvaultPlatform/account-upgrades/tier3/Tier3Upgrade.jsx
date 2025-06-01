import React, { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import LoadingStep from "../shared/LoadingStep";
import BusinessKycStep from "./BusinessKycStep";
import LocationStep from "../tier2/LocationStep";
import Tier3SuccessStep from "./Tier3SuccessStep";

const Tier3Upgrade = ({ onComplete, onCancel }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState("kyc");
  const [kycData, setKycData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [verificationData, setVerificationData] = useState({});
  const [locationData, setLocationData] = useState({});

  const handleKycComplete = (data) => {
    setKycData(data);
    setIsLoading(true);
    setCurrentStep("loading");

    // Simulate API verification
    setTimeout(() => {
      setVerificationData({
        method: "Business KYC",
        value: data.businessRegistration,
        verified: true,
      });
      setCurrentStep("location");
    }, 3000);
  };

  const handleLocationComplete = (data) => {
    setLocationData(data);
    setCurrentStep("success");
  };

  const handleFinalComplete = () => {
    onComplete({
      tier: 3,
      verificationData,
      locationData,
      kycData,
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case "kyc":
        return (
          <BusinessKycStep
            onComplete={handleKycComplete}
          />
        );
      case "loading":
        return (
          <LoadingStep
            onAnimationComplete={() => setCurrentStep("location")}
          />
        );
      case "location":
        return (
          <LocationStep
            onComplete={handleLocationComplete}
          />
        );
      case "success":
        return (
          <Tier3SuccessStep
            verificationData={verificationData}
            kycData={kycData}
            onComplete={handleFinalComplete}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg">
        <div className="relative p-8">
          <div className="absolute top-0 left-0 w-full h-1 bg-gray-200">
            <div
              className="h-full bg-[#025798]"
              style={{
                width: `${
                  ((["kyc", "loading", "location", "success"].indexOf(currentStep) + 1) / 4) * 100
                }%`,
                transition: "width 0.5s ease-in-out",
              }}
            />
          </div>
          <div className="pt-8">
            {renderStep()}
            {currentStep !== "success" && (
              <div className="mt-4 text-center">
                <button
                  onClick={onCancel}
                  className="text-gray-500 hover:text-gray-700 text-sm underline"
                >
                  Cancel Upgrade
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

Tier3Upgrade.propTypes = {
  onComplete: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default Tier3Upgrade;