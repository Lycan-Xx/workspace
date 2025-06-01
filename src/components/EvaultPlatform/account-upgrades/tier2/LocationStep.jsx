import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { MapPin } from 'lucide-react';
import { nigerianStates } from "../shared/nigerianStatesData";
import SecurityStep from "../shared/SecurityStep";

const LocationStep = ({ onComplete }) => {
  const [state, setState] = useState('');
  const [lga, setLga] = useState('');
  const [area, setArea] = useState('');
  const [address, setAddress] = useState('');
  const [availableLgas, setAvailableLgas] = useState([]);

  useEffect(() => {
    if (state) {
      const selectedState = nigerianStates.find(s => s.name === state);
      setAvailableLgas(selectedState ? selectedState.locals : []);
      setLga('');
    }
  }, [state]);

  const isFormValid = state && lga && area && address;

  const handleSubmit = () => {
    if (isFormValid) {
      onComplete({ state, lga, area, address });
    }
  };

  return (
    <SecurityStep>
      <div className="w-32 h-32 text-[#025798]">
        <MapPin className="w-full h-full" />
      </div>
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Location Information</h2>
        <p className="text-gray-600">Please provide your location details</p>
      </div>
      <div className="w-full space-y-4">
        <select
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#025798]"
        >
          <option value="">Select State</option>
          {nigerianStates.map(state => (
            <option key={state.name} value={state.name}>
              {state.name}
            </option>
          ))}
        </select>

        <select
          value={lga}
          onChange={(e) => setLga(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#025798]"
        >
          <option value="">Select LGA</option>
          {availableLgas.map(lga => (
            <option key={lga} value={lga}>
              {lga}
            </option>
          ))}
        </select>

        <input
          type="text"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          placeholder="Area"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#025798]"
        />

        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Full Address"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#025798]"
        />

        <button
          onClick={handleSubmit}
          disabled={!isFormValid}
          className={`w-full py-3 rounded-lg text-white ${
            isFormValid
              ? 'bg-[#025798] hover:bg-[#024778] transition-colors'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Proceed
        </button>
      </div>
    </SecurityStep>
  );
};

LocationStep.propTypes = {
  onComplete: PropTypes.func.isRequired,
};

export default LocationStep;