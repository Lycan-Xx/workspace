import React from 'react';
import PropTypes from 'prop-types';
import { CheckCircle } from 'lucide-react';
import SecurityStep from './SecurityStep';

const SuccessStep = ({ verificationData, locationData, onComplete }) => (
  <SecurityStep>
    <div className="w-24 h-24 text-green-500">
      <CheckCircle className="w-full h-full" />
    </div>
    <div className="text-center space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">Verification Successful!</h2>
      <p className="text-gray-600">Your identity has been verified</p>
    </div>
    <div className="w-full space-y-6 bg-gray-50 p-6 rounded-lg">
      <div>
        <h3 className="font-semibold text-gray-700">Verification Details</h3>
        <p className="text-gray-600">{verificationData.method}: {verificationData.value}</p>
      </div>
      <div>
        <h3 className="font-semibold text-gray-700">Location Information</h3>
        <div className="space-y-2 text-gray-600">
          <p>State: {locationData.state}</p>
          <p>LGA: {locationData.lga}</p>
          <p>Area: {locationData.area}</p>
          <p>Address: {locationData.address}</p>
        </div>
      </div>
    </div>
    <button
      onClick={onComplete}
      className="bg-white text-[#025798] px-6 py-2 rounded-xl text-[1.2rem] hover:bg-[#025798] hover:text-white border-[1.5px] border-[#025798] transition duration-700"
    >
      Continue
    </button>
  </SecurityStep>
);

SuccessStep.propTypes = {
  verificationData: PropTypes.shape({
    method: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  }).isRequired,
  locationData: PropTypes.shape({
    state: PropTypes.string.isRequired,
    lga: PropTypes.string.isRequired,
    area: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
  }).isRequired,
  onComplete: PropTypes.func.isRequired,
};

export default SuccessStep;