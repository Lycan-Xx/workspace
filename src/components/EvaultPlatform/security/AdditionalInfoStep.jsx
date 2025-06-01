
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { User } from 'lucide-react';
import SecurityStep from './SecurityStep';

const AdditionalInfoStep = ({ onComplete }) => {
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');

  const isFormValid = dateOfBirth && gender;

  const handleSubmit = () => {
    if (isFormValid) {
      onComplete({ dateOfBirth, gender });
    }
  };

  return (
    <SecurityStep>
      <div className="w-16 h-16 text-[#025798]">
        <User className="w-full h-full" />
      </div>
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Additional Information</h2>
        <p className="text-gray-600">Please provide additional details to complete your profile</p>
      </div>
      <div className="w-full space-y-4">
        <input
          type="date"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#025798]"
          placeholder="Date of Birth"
        />

        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#025798]"
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="prefer-not-to-say">Prefer not to say</option>
        </select>

        <button
          onClick={handleSubmit}
          disabled={!isFormValid}
          className={`w-full py-3 rounded-lg text-white ${
            isFormValid
              ? 'bg-[#025798] hover:bg-[#024778] transition-colors'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Complete Verification
        </button>
      </div>
    </SecurityStep>
  );
};

AdditionalInfoStep.propTypes = {
  onComplete: PropTypes.func.isRequired,
};

export default AdditionalInfoStep;
