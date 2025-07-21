import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import ProgressBar from './ProgressBar';
import InitialStep from './InitialStep';
import LoadingStep from './LoadingStep';
import LocationStep from './LocationStep';
import SuccessStep from './SuccessStep';

const ConfigureSecurity = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const [verificationData, setVerificationData] = useState(null);
  const [locationData, setLocationData] = useState(null);
  const { fromUpgrade, upgradeToTier } = location.state || {};

  const handleInitialStepComplete = (data) => {
    setVerificationData(data);
    setStep(2);
  };

  const handleLoadingComplete = () => {
    setStep(3);
  };

  const handleLocationComplete = (data) => {
    setLocationData(data);
    setStep(4);
  };

  const handleCompletion = () => {
    if (fromUpgrade) {
      // Navigate back to settings with successful upgrade
      navigate('/settings', { 
        state: { 
          upgradedToTier: upgradeToTier,
          verificationComplete: true 
        } 
      });
    } else {
      navigate('/dashboard');
    }
  };

  const handleSkip = () => {
    // Don't allow skipping during upgrade flow
    if (fromUpgrade) {
      navigate('/settings');
      return;
    }
    navigate('/dashboard');
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <InitialStep
            onNext={handleInitialStepComplete}
            onSkip={handleSkip}
          />
        );
      case 2:
        return (
          <LoadingStep
            onAnimationComplete={handleLoadingComplete}
          />
        );
      case 3:
        return (
          <LocationStep
            onComplete={handleLocationComplete}
          />
        );
      case 4:
        return (
          <SuccessStep
            verificationData={verificationData}
            locationData={locationData}
            onComplete={handleCompletion}
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
          <ProgressBar currentStep={step} totalSteps={4} />
          <div className="pt-8">
            {renderStep()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigureSecurity;