import React, { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import LoadingStep from "../shared/LoadingStep";
import IdVerificationStep from "./IdVerificationStep";
import KycDocumentationStep from "./KycDocumentationStep";
import Tier3SuccessStep from "./Tier3SuccessStep";

const Tier3Upgrade = ({ onComplete, onCancel }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState("id-verification");
  const [kycData, setKycData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [verificationData, setVerificationData] = useState({});

  const handleIdVerification = (idType, idNumber, document) => {
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
          <IdVerificationStep
            onVerify={handleIdVerification}
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="relative p-8">
          {/* Progress bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gray-200">
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
    </div>
  );
};

Tier3Upgrade.propTypes = {
  onComplete: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default Tier3Upgrade;