
import React from 'react';
import PropTypes from 'prop-types';
import { CheckCircle, User, Calendar, MapPin } from 'lucide-react';
import SecurityStep from './SecurityStep';

const BvnSuccessStep = ({ verifiedData, onContinue }) => {
  // Mock verified data (in real implementation, this would come from BVN verification API)
  const mockVerifiedData = {
    fullName: verifiedData?.fullName || "John Adebayo Okafor",
    dateOfBirth: verifiedData?.dateOfBirth || "1990-03-15",
    address: verifiedData?.address || "Victoria Island, Lagos",
    profilePicture: verifiedData?.profilePicture || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80&w=200&h=200"
  };

  return (
    <SecurityStep>
      <div className="w-24 h-24 text-green-500">
        <CheckCircle className="w-full h-full" />
      </div>
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">BVN Verified Successfully!</h2>
        <p className="text-gray-600">Your identity has been verified</p>
      </div>
      
      <div className="w-full bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="flex items-center space-x-4 mb-4">
          <img
            src={mockVerifiedData.profilePicture}
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
          />
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{mockVerifiedData.fullName}</h3>
            <p className="text-sm text-gray-600">BVN Verified Account</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-700">Date of Birth</p>
              <p className="text-sm text-gray-600">{new Date(mockVerifiedData.dateOfBirth).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <MapPin className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-700">Address</p>
              <p className="text-sm text-gray-600">{mockVerifiedData.address}</p>
            </div>
          </div>
        </div>
      </div>
      
      <button
        onClick={onContinue}
        className="bg-[#025798] text-white px-6 py-3 rounded-lg text-lg hover:bg-[#024778] transition-colors w-full"
      >
        Continue to Next Step
      </button>
    </SecurityStep>
  );
};

BvnSuccessStep.propTypes = {
  verifiedData: PropTypes.object,
  onContinue: PropTypes.func.isRequired,
};

export default BvnSuccessStep;
