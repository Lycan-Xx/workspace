import React, { useState } from "react";
import PropTypes from "prop-types";
import { Receipt, Upload, AlertCircle, Check } from "lucide-react";
import SecurityStep from "../shared/SecurityStep";

const UtilityBillVerification = ({ onVerify, isLoading }) => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [errors, setErrors] = useState({});

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/') && !file.type.startsWith('application/pdf')) {
        setErrors({ ...errors, file: "Please upload an image or PDF file" });
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, file: "File size must be less than 5MB" });
        return;
      }

      setUploadedFile(file);
      setErrors({ ...errors, file: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!uploadedFile) {
      newErrors.file = "Please upload your utility bill";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleVerify = () => {
    if (validateForm()) {
      onVerify('UTILITY_BILL', null, uploadedFile);
    }
  };

  return (
    <SecurityStep>
      <div className="w-32 h-32 text-[#025798]">
        <Receipt className="w-full h-full" />
      </div>
      
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Utility Bill Verification</h2>
        <p className="text-gray-600">
          Please upload your most recent utility bill (not older than 3 months)
        </p>
      </div>

      <div className="w-full space-y-6">
        {/* Commented out ID Type Selection for future use
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Select ID Type
          </label>
          {idTypes.map((idType) => (
            <label key={idType.value} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="idType"
                value={idType.value}
                checked={selectedIdType === idType.value}
                onChange={(e) => setSelectedIdType(e.target.value)}
                className="w-4 h-4 text-[#025798] focus:ring-[#025798]"
              />
              <span className="text-sm text-gray-700">{idType.label}</span>
            </label>
          ))}
          {errors.idType && (
            <div className="text-red-500 text-sm flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.idType}
            </div>
          )}
        </div>
        */}

        {/* Commented out ID Number Input for future use
        {selectedIdType && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              ID Number
            </label>
            <input
              type="text"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
              placeholder={idTypes.find(type => type.value === selectedIdType)?.placeholder}
              className={`w-full px-4 py-3 border ${
                errors.idNumber ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B7A9E] transition-all`}
            />
            {errors.idNumber && (
              <div className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.idNumber}
              </div>
            )}
          </div>
        )}
        */}

        {/* File Upload */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Upload Utility Bill
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              {uploadedFile ? (
                <div className="space-y-2">
                  <Check className="w-8 h-8 text-green-500 mx-auto" />
                  <p className="text-sm text-green-600">{uploadedFile.name}</p>
                  <p className="text-xs text-gray-500">Click to change file</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                  <p className="text-sm text-gray-600">Click to upload your utility bill</p>
                  <p className="text-xs text-gray-500">PNG, JPG, PDF up to 5MB</p>
                </div>
              )}
            </label>
          </div>
          {errors.file && (
            <div className="text-red-500 text-sm flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.file}
            </div>
          )}
        </div>

        {/* Verify Button */}
        <button
          onClick={handleVerify}
          disabled={isLoading || !uploadedFile}
          className={`w-full py-3 ${
            isLoading || !uploadedFile
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#025798] hover:bg-[#024680] text-white"
          } text-white rounded-lg transition-colors flex items-center justify-center gap-2`}
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Receipt className="w-5 h-5" />
              Verify Utility Bill
            </>
          )}
        </button>
      </div>
    </SecurityStep>
  );
};

UtilityBillVerification.propTypes = {
  onVerify: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default UtilityBillVerification;
