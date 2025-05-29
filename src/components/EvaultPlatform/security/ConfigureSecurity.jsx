import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSecurityVerified } from '../../EvaultPlatform/store/authSlice';
import ProgressBar from './ProgressBar';
import InitialStep from './InitialStep';
import LoadingStep from './LoadingStep';
import LocationStep from './LocationStep';
import SuccessStep from './SuccessStep';

const ConfigureSecurity = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const [verificationData, setVerificationData] = useState(null);
  const [locationData, setLocationData] = useState(null);

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
    dispatch(setSecurityVerified(true));
    navigate('/dashboard');
  };

  const handleSkip = () => {
    dispatch(setSecurityVerified(true));
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