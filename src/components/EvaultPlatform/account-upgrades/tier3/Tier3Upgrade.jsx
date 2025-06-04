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
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg">
        <div className="relative p-8">
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