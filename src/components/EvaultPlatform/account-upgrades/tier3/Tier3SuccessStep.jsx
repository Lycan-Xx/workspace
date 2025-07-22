
import React from "react";
import PropTypes from "prop-types";
import { CheckCircle, Star, Award } from "lucide-react";
import SecurityStep from "../shared/SecurityStep";

const Tier3SuccessStep = ({ verificationData, kycData, onComplete }) => {
  return (
    <SecurityStep>
      <div className="w-32 h-32 text-green-500">
        <Award className="w-full h-full" />
      </div>
      
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Congratulations! 🎉
        </h2>
        <p className="text-gray-600">
          You have successfully upgraded to TIER 3 (Premium Account)
        </p>
      </div>

      {/* Premium Features */}
      <div className="w-full bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold text-yellow-800 flex items-center gap-2">
          <Star className="w-5 h-5" />
          Premium Account Benefits
        </h3>
        
        <div className="space-y-3 text-sm text-yellow-700">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>Advanced security features</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>Premium support 24/7</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>Multiple virtual cards</span>
          </div>
        </div>
      </div>

      {/* Verification Summary */}
      <div className="w-full bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
        <h3 className="text-sm font-semibold text-green-800">
          Verification Summary
        </h3>
        
        <div className="space-y-2 text-sm text-green-700">
          <div className="flex items-center justify-between">
            <span>ID Verification:</span>
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              <span className="font-medium">Completed</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span>Face Verification:</span>
            <div className="flex items-center gap-1">
              {kycData.faceVerification === 'completed' ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span className="font-medium">Completed</span>
                </>
              ) : (
                <>
                  <div className="w-4 h-4 rounded-full bg-yellow-400"></div>
                  <span className="font-medium">Skipped</span>
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span>Account Tier:</span>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="font-medium">Tier 3 Premium</span>
            </div>
          </div>
        </div>
      </div>

      {/* Complete Button */}
      <button
        onClick={onComplete}
        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 font-medium"
      >
        <CheckCircle className="w-5 h-5" />
        Complete Upgrade
      </button>

      <div className="text-center text-sm text-gray-500">
        Your new account privileges are now active!
      </div>
    </SecurityStep>
  );
};

Tier3SuccessStep.propTypes = {
  verificationData: PropTypes.object.isRequired,
  kycData: PropTypes.object.isRequired,
  onComplete: PropTypes.func.isRequired,
};

export default Tier3SuccessStep;
