import React, { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import BvnStep from "./BvnStep";
import BvnSuccessStep from "./BvnSuccessStep";
import LoadingStep from "../shared/LoadingStep";
import LocationStep from "./LocationStep";
import AdditionalInfoStep from "./AdditionalInfoStep";
import SuccessStep from "./SuccessStep";

const Tier2Upgrade = ({ onComplete, onCancel }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState("bvn");
  const [bvn, setBvn] = useState("");
  const [bvnError, setBvnError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [verificationData, setVerificationData] = useState({});
  const [locationData, setLocationData] = useState({});
  const [additionalInfo, setAdditionalInfo] = useState({});

  const handleBvnChange = (value) => {
    const cleanedValue = value.replace(/\D/g, "").slice(0, 11);
    setBvn(cleanedValue);
    setBvnError("");

    // Clear any existing error if exactly 11 digits
    if (cleanedValue.length === 11) {
      setBvnError("");
    }
  };

  const handleBvnVerify = () => {
    if (bvn.length !== 11) {
      setBvnError("BVN must be 11 digits");
      return;
    }

    setIsLoading(true);
    setCurrentStep("loading");

    // Simulate API call
    setTimeout(() => {
      setVerificationData({
        method: "BVN",
        value: bvn,
        verified: true,
      });
      setCurrentStep("bvn-success");
    }, 3000);
  };

  const handleBvnSuccessContinue = () => {
    setCurrentStep("location");
  };

  const handleLocationComplete = (data) => {
    setLocationData(data);
    setCurrentStep("additional-info");
  };

  const handleAdditionalInfoComplete = (data) => {
    setAdditionalInfo(data);
    setCurrentStep("final-success");
  };

  const handleFinalComplete = () => {
    onComplete({
      tier: 2,
      verificationData,
      locationData,
      additionalInfo,
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case "bvn":
        return (
          <BvnStep
            bvn={bvn}
            error={bvnError}
            isLoading={isLoading}
            onChange={handleBvnChange}
            onVerify={handleBvnVerify}
          />
        );
      case "loading":
        return <LoadingStep onAnimationComplete={() => setCurrentStep("location")} />;
      case "bvn-success":
        return (
          <BvnSuccessStep
            verifiedData={verificationData}
            onContinue={handleBvnSuccessContinue}
          />
        );
      case "location":
        return <LocationStep onComplete={handleLocationComplete} />;
      case "additional-info":
        return <AdditionalInfoStep onComplete={handleAdditionalInfoComplete} />;
      case "final-success":
        return (
          <SuccessStep
            verificationData={verificationData}
            locationData={locationData}
            onComplete={handleFinalComplete}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
      <div className="relative p-8">
        {/* Progress bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gray-200">
          <div
            className="h-full bg-[#025798]"
            style={{
              width: `${
                ((["bvn", "loading", "bvn-success", "location", "additional-info", "final-success"].indexOf(currentStep) + 1) / 6) * 100
              }%`,
              transition: "width 0.5s ease-in-out",
            }}
          />
        </div>

        {/* Cancel button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="pt-8">
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

Tier2Upgrade.propTypes = {
  onComplete: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default Tier2Upgrade;