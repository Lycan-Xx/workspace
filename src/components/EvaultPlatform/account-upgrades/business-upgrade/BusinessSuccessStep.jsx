import React from "react";
import PropTypes from "prop-types";
import { Building2, CheckCircle, Star } from "lucide-react";
import SecurityStep from "../shared/SecurityStep";

const BusinessSuccessStep = ({ businessData, onComplete }) => {
  return (
    <SecurityStep>
      <div className="w-32 h-32 text-green-500">
        <Building2 className="w-full h-full" />
      </div>
      
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Business Account Upgraded! 🎉
        </h2>
        <p className="text-gray-600">
          Your business account has been successfully verified
        </p>
      </div>

      {/* Business Features */}
      <div className="w-full bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold text-blue-800 flex items-center gap-2">
          <Star className="w-5 h-5" />
          Business Account Benefits
        </h3>
        
        <div className="space-y-3 text-sm text-blue-700">
          {[
            "Higher transaction limits",
            "Business analytics dashboard",
            "Multiple user accounts",
            "Priority customer support",
            "Automated reconciliation",
            "Bulk payment processing"
          ].map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Business Details Summary */}
      <div className="w-full bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-green-800">Business Details</h3>
        <div className="mt-2 grid grid-cols-2 gap-3 text-sm text-green-700">
          <div>
            <p className="font-medium">Business Name:</p>
            <p>{businessData.businessName}</p>
          </div>
          <div>
            <p className="font-medium">Registration No:</p>
            <p>{businessData.businessRegistration}</p>
          </div>
          <div>
            <p className="font-medium">Business Type:</p>
            <p>{businessData.businessType}</p>
          </div>
          <div>
            <p className="font-medium">Tax ID:</p>
            <p>{businessData.taxId}</p>
          </div>
        </div>
      </div>

      {/* Complete Button */}
      <button
        onClick={onComplete}
        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
      >
        <CheckCircle className="w-5 h-5" />
        Start Using Business Account
      </button>
    </SecurityStep>
  );
};

BusinessSuccessStep.propTypes = {
  businessData: PropTypes.object.isRequired,
  onComplete: PropTypes.func.isRequired,
};

export default BusinessSuccessStep;
