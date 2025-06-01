import React, { useState } from 'react';
import PropTypes from 'prop-types';
import BvnStep from './BvnStep';
import BvnSuccessStep from './BvnSuccessStep';
import LoadingStep from './LoadingStep';
import LocationStep from './LocationStep';
import AdditionalInfoStep from './AdditionalInfoStep';
import SuccessStep from './SuccessStep';

const Tier2Upgrade = ({ onComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState('bvn');
  const [bvn, setBvn] = useState('');
  const [bvnError, setBvnError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [verificationData, setVerificationData] = useState({});
  const [locationData, setLocationData] = useState({});
  const [additionalInfo, setAdditionalInfo] = useState({});

  const handleBvnChange = (value) => {
    const cleanedValue = value.replace(/\D/g, '').slice(0, 11);
    setBvn(cleanedValue);
    setBvnError('');
    
    // Clear any existing error if exactly 11 digits
    if (cleanedValue.length === 11) {
      setBvnError('');
    }
  };

  const handleBvnVerify = () => {
    if (bvn.length !== 11) {
      setBvnError('BVN must be 11 digits');
      return;
    }

    setIsLoading(true);
    setCurrentStep('loading');

    // Simulate API call
    setTimeout(() => {
      setVerificationData({
        method: 'BVN',
        value: bvn,
        verified: true
      });
      setCurrentStep('bvn-success');
    }, 3000);
  };

  const handleBvnSuccessContinue = () => {
    setCurrentStep('location');
  };

  const handleLocationComplete = (data) => {
    setLocationData(data);
    setCurrentStep('additional-info');
  };

  const handleAdditionalInfoComplete = (data) => {
    setAdditionalInfo(data);
    setCurrentStep('final-success');
  };

  const handleFinalComplete = () => {
    onComplete({
      tier: 2,
      verificationData,
      locationData,
      additionalInfo
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'bvn':
        return (
          <BvnStep
            bvn={bvn}
            error={bvnError}
            isLoading={isLoading}
            onChange={handleBvnChange}
            onVerify={handleBvnVerify}
          />
        );
      case 'loading':
        return <LoadingStep onAnimationComplete={() => {}} />;
      case 'bvn-success':
        return (
          <BvnSuccessStep
            verifiedData={verificationData}
            onContinue={handleBvnSuccessContinue}
          />
        );
      case 'location':
        return <LocationStep onComplete={handleLocationComplete} />;
      case 'additional-info':
        return <AdditionalInfoStep onComplete={handleAdditionalInfoComplete} />;
      case 'final-success':
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {renderStep()}

        {/* Cancel button for early steps */}
        {['bvn', 'bvn-success', 'location', 'additional-info'].includes(currentStep) && (
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
  );
};

Tier2Upgrade.propTypes = {
  onComplete: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default Tier2Upgrade;