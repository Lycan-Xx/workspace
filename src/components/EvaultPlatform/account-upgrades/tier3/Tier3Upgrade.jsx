import React, { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import LoadingStep from "../shared/LoadingStep";
import UtilityBillVerification from "./UtilityBillVerification";
import KycDocumentationStep from "./KycDocumentationStep";
import Tier3SuccessStep from "./Tier3SuccessStep";

const Tier3Upgrade = ({ onComplete, onCancel }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState("id-verification");
  const [kycData, setKycData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [verificationData, setVerificationData] = useState({});

  const handleUtilityBillVerification = (idType, idNumber, document) => {
    setIsLoading(true);
    setCurrentStep("loading");

    // Simulate API verification
    setTimeout(() => {
      setVerificationData({
        idType,
        idNumber,
        documentUrl: URL.createObjectURL(document),
        verified: true,
        name: "John Doe", // This would come from the API
        dateOfBirth: "1990-01-01", // This would come from the API
        dateOfIssuance: "2020-01-01", // This would come from the API
        expiryDate: "2025-01-01", // This would come from the API
      });
      setCurrentStep("kyc");
    }, 3000);
  };

  const handleKycComplete = (data) => {
    setKycData(data);
    setCurrentStep("success");
  };

  const handleFinalComplete = () => {
    onComplete({
      tier: 3,
      verificationData,
      kycData,
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case "id-verification":
        return (
          <UtilityBillVerification
            onVerify={handleUtilityBillVerification}
            isLoading={isLoading}
          />
        );
      case "loading":
        return (
          <LoadingStep
            onAnimationComplete={() => setIsLoading(false)}
          />
        );
      case "kyc":
        return (
          <KycDocumentationStep
            verifiedData={verificationData}
            onComplete={handleKycComplete}
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col">
      {/* Progress bar */}
      <div className="w-full h-1 bg-gray-200">
        <div
          className="h-full bg-[#025798]"
          style={{
            width: `${
              ((["id-verification", "loading", "kyc", "success"].indexOf(currentStep) + 1) / 4) * 100
            }%`,
            transition: "width 0.5s ease-in-out",
          }}
        />
      </div>

      {/* Header with Cancel button */}
      <div className="flex justify-between items-center p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Tier 3 Upgrade</h1>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 p-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md">
          {renderStep()}
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