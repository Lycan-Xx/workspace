import React, { useState } from "react";
import PropTypes from "prop-types";
import { Building2, AlertCircle } from "lucide-react";
import SecurityStep from "../shared/SecurityStep";

const BusinessKycStep = ({ onComplete }) => {
  const [formData, setFormData] = useState({
    businessRegistration: "",
    businessName: "",
    taxId: "",
    businessType: "",
    businessAddress: "",
    faceVerification: "skipped", // or "completed"
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.businessRegistration) {
      newErrors.businessRegistration = "Business registration number is required";
    }
    if (!formData.businessName) {
      newErrors.businessName = "Business name is required";
    }
    if (!formData.taxId) {
      newErrors.taxId = "Tax ID is required";
    }
    if (!formData.businessType) {
      newErrors.businessType = "Business type is required";
    }
    if (!formData.businessAddress) {
      newErrors.businessAddress = "Business address is required";
    }
    return newErrors;
  };

  const handleSubmit = () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length === 0) {
      onComplete(formData);
    } else {
      setErrors(newErrors);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  return (
    <SecurityStep>
      <div className="w-32 h-32 text-[#025798]">
        <Building2 className="w-full h-full" />
      </div>
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Business Verification</h2>
        <p className="text-gray-600">Please provide your business details</p>
      </div>
      <div className="w-full space-y-4">
        <div className="relative">
          <input
            type="text"
            value={formData.businessRegistration}
            onChange={(e) => handleChange("businessRegistration", e.target.value)}
            placeholder="Business Registration Number"
            className={`w-full px-4 py-3 border ${
              errors.businessRegistration ? "border-red-500" : "border-gray-300"
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#025798] transition-all`}
          />
          {errors.businessRegistration && (
            <div className="absolute -bottom-6 left-0 text-red-500 text-sm flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.businessRegistration}
            </div>
          )}
        </div>

        <div className="relative">
          <input
            type="text"
            value={formData.businessName}
            onChange={(e) => handleChange("businessName", e.target.value)}
            placeholder="Business Name"
            className={`w-full px-4 py-3 border ${
              errors.businessName ? "border-red-500" : "border-gray-300"
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#025798] transition-all`}
          />
          {errors.businessName && (
            <div className="absolute -bottom-6 left-0 text-red-500 text-sm flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.businessName}
            </div>
          )}
        </div>

        <div className="relative">
          <input
            type="text"
            value={formData.taxId}
            onChange={(e) => handleChange("taxId", e.target.value)}
            placeholder="Tax ID"
            className={`w-full px-4 py-3 border ${
              errors.taxId ? "border-red-500" : "border-gray-300"
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#025798] transition-all`}
          />
          {errors.taxId && (
            <div className="absolute -bottom-6 left-0 text-red-500 text-sm flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.taxId}
            </div>
          )}
        </div>

        <div className="relative">
          <select
            value={formData.businessType}
            onChange={(e) => handleChange("businessType", e.target.value)}
            className={`w-full px-4 py-3 border ${
              errors.businessType ? "border-red-500" : "border-gray-300"
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#025798] transition-all`}
          >
            <option value="">Select Business Type</option>
            <option value="sole_proprietorship">Sole Proprietorship</option>
            <option value="partnership">Partnership</option>
            <option value="limited_company">Limited Company</option>
            <option value="corporation">Corporation</option>
          </select>
          {errors.businessType && (
            <div className="absolute -bottom-6 left-0 text-red-500 text-sm flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.businessType}
            </div>
          )}
        </div>

        <div className="relative">
          <textarea
            value={formData.businessAddress}
            onChange={(e) => handleChange("businessAddress", e.target.value)}
            placeholder="Business Address"
            className={`w-full px-4 py-3 border ${
              errors.businessAddress ? "border-red-500" : "border-gray-300"
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#025798] transition-all`}
            rows={3}
          />
          {errors.businessAddress && (
            <div className="absolute -bottom-6 left-0 text-red-500 text-sm flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.businessAddress}
            </div>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={Object.keys(formData).some(key => !formData[key] && key !== 'faceVerification')}
          className={`w-full py-3 rounded-lg text-white ${
            Object.keys(formData).some(key => !formData[key] && key !== 'faceVerification')
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#025798] hover:bg-[#024778] transition-colors"
          }`}
        >
          Continue
        </button>
      </div>
    </SecurityStep>
  );
};

BusinessKycStep.propTypes = {
  onComplete: PropTypes.func.isRequired,
};

export default BusinessKycStep;
