
import React, { useState } from "react";
import PropTypes from "prop-types";
import { CreditCard, Upload, AlertCircle, Check } from "lucide-react";
import SecurityStep from "./SecurityStep";

const IdVerificationStep = ({ onVerify, isLoading }) => {
  const [selectedIdType, setSelectedIdType] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [errors, setErrors] = useState({});

  const idTypes = [
    { value: "PVC", label: "Permanent Voter's Card (PVC)", placeholder: "Enter PVC number" },
    { value: "NIN", label: "National Identification Number (NIN)", placeholder: "Enter 11-digit NIN" },
    { value: "DRIVERS_LICENSE", label: "Driver's License", placeholder: "Enter license number" },
  ];

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors({ ...errors, file: "Please upload an image file" });
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

    if (!selectedIdType) {
      newErrors.idType = "Please select an ID type";
    }

    if (!idNumber) {
      newErrors.idNumber = "Please enter your ID number";
    } else {
      // Validate ID number based on type
      if (selectedIdType === "NIN" && idNumber.length !== 11) {
        newErrors.idNumber = "NIN must be 11 digits";
      } else if (selectedIdType === "PVC" && idNumber.length < 8) {
        newErrors.idNumber = "PVC number must be at least 8 characters";
      } else if (selectedIdType === "DRIVERS_LICENSE" && idNumber.length < 6) {
        newErrors.idNumber = "Driver's license number must be at least 6 characters";
      }
    }

    if (!uploadedFile) {
      newErrors.file = "Please upload your ID document";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleVerify = () => {
    if (validateForm()) {
      onVerify(selectedIdType, idNumber, uploadedFile);
    }
  };

  return (
    <SecurityStep>
      <div className="w-32 h-32 text-[#025798]">
        <CreditCard className="w-full h-full" />
      </div>
      
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">ID Verification</h2>
        <p className="text-gray-600">
          Please select and verify your valid identification document
        </p>
      </div>

      <div className="w-full space-y-6">
        {/* ID Type Selection */}
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

        {/* ID Number Input */}
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

        {/* File Upload */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Upload ID Document
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              accept="image/*"
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
                  <p className="text-sm text-gray-600">Click to upload your ID</p>
                  <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
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
          disabled={isLoading || !selectedIdType || !idNumber || !uploadedFile}
          className={`w-full py-3 ${
            isLoading || !selectedIdType || !idNumber || !uploadedFile
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#025798] hover:bg-[#024680] text-white"
          } text-white rounded-lg transition-colors flex items-center justify-center gap-2`}
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <CreditCard className="w-5 h-5" />
              Verify ID Document
            </>
          )}
        </button>
      </div>
    </SecurityStep>
  );
};

IdVerificationStep.propTypes = {
  onVerify: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default IdVerificationStep;
