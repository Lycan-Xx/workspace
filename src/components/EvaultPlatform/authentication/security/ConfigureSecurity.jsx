import React, { useState } from 'react';
import PropTypes from 'prop-types';

const ConfigureSecurity = ({ onSkip, onComplete }) => {
  const [currentStep, setCurrentStep] = useState('initial');
  const [securityData, setSecurityData] = useState({
    pin: '',
    securityQuestion: '',
    securityAnswer: '',
    biometricEnabled: false,
  });

  const handleComplete = () => {
    onComplete(securityData);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Configure Security</h2>
            <p className="text-gray-600">Set up your security preferences</p>
          </div>

          <div className="space-y-6">
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Your security settings will be configured based on your account requirements.
              </p>

              <div className="flex space-x-4">
                <button
                  onClick={handleComplete}
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Complete Setup
                </button>

                <button
                  onClick={onSkip}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Skip for Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ConfigureSecurity.propTypes = {
  onComplete: PropTypes.func,
  onSkip: PropTypes.func,
};

ConfigureSecurity.defaultProps = {
  onComplete: () => {},
  onSkip: () => {},
};

export default ConfigureSecurity;