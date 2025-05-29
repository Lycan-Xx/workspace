import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Shield, AlertCircle } from 'lucide-react';
import SecurityStep from './SecurityStep';

const InitialStep = ({ onNext, onSkip }) => {
  const [verificationMethod, setVerificationMethod] = useState('BVN');
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 11);
    setInputValue(value);
    setError('');
  };

  const handleVerify = () => {
    if (inputValue.length !== 11) {
      setError(`Please enter a valid 11-digit ${verificationMethod}`);
      return;
    }
    onNext({ method: verificationMethod, value: inputValue });
  };

  return (
    <SecurityStep>
      <div className="w-64 h-64">
        <img
          src="https://images.unsplash.com/photo-1633265486064-086b219458ec?w=800&auto=format&fit=crop&q=60"
          alt="Security Setup"
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Verify Your Identity</h2>
        <p className="text-gray-600">Choose your preferred verification method</p>
      </div>
      <div className="w-full space-y-6">
        <div className="flex justify-center space-x-8">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              value="BVN"
              checked={verificationMethod === 'BVN'}
              onChange={(e) => setVerificationMethod(e.target.value)}
              className="w-4 h-4 text-[#025798] border-gray-300 focus:ring-[#025798]"
            />
            <span className="text-gray-700">BVN</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              value="NIN"
              checked={verificationMethod === 'NIN'}
              onChange={(e) => setVerificationMethod(e.target.value)}
              className="w-4 h-4 text-[#025798] border-gray-300 focus:ring-[#025798]"
            />
            <span className="text-gray-700">NIN</span>
          </label>
        </div>
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder={`Enter 11-digit ${verificationMethod}`}
            className={`w-full px-4 py-3 border ${
              error ? 'border-red-500' : 'border-gray-300'
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#025798] transition-all`}
          />
          {error && (
            <div className="absolute -bottom-6 left-0 text-red-500 text-sm flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-between w-full mt-8">
        <button
          onClick={onSkip}
          className="px-6 py-2 text-gray-600 hover:text-[#025798] border rounded-xl transition-colors"
        >
          Skip for now
        </button>
        <button
          onClick={handleVerify}
          disabled={inputValue.length !== 11}
          className={`flex items-center px-6 py-2 rounded-xl text-[1.2rem] ${
            inputValue.length !== 11
              ? 'bg-gray-400 cursor-not-allowed text-white'
              : 'bg-white text-[#025798] hover:bg-[#025798] hover:text-white border-[1.5px] border-[#025798] transition duration-700'
          }`}
        >
          <Shield className="w-5 h-5 mr-2" />
          Verify
        </button>
      </div>
    </SecurityStep>
  );
};

InitialStep.propTypes = {
  onNext: PropTypes.func.isRequired,
  onSkip: PropTypes.func.isRequired,
};

export default InitialStep;