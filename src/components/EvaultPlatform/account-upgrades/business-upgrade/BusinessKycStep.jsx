import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import { Building2, AlertCircle, FileText, X, Upload } from "lucide-react";
import SecurityStep from "../shared/SecurityStep";

const BusinessKycStep = ({ onComplete }) => {
  const fileInputRefs = {
    memorandum: useRef(),
    cacCertificate: useRef(),
    directorsParticulars: useRef(),
    boardResolution: useRef(),
    tinCertificate: useRef(),
  };

  const [formData, setFormData] = useState({
    businessRegistration: "",
    businessName: "",
    taxId: "",
    businessType: "",
    businessAddress: "",
    faceVerification: "skipped", // or "completed"
    documents: {
      memorandum: null,
      cacCertificate: null,
      directorsParticulars: null,
      boardResolution: null,
      tinCertificate: null,
    },
  });

  const [errors, setErrors] = useState({});
  const [previews, setPreviews] = useState({});

  const validateForm = () => {
    const newErrors = {};
    // Only validate required documents
    const requiredDocs = ["memorandum", "cacCertificate", "directorsParticulars", "boardResolution", "tinCertificate"];
    requiredDocs.forEach(doc => {
      if (!formData.documents[doc]) {
        newErrors[doc] = `${getDocumentName(doc)} is required`;
      }
    });
    return newErrors;
  };

  const getDocumentName = (key) => {
    const names = {
      memorandum: "Memorandum of association",
      cacCertificate: "CAC certificate",
      directorsParticulars: "Particulars of directors and shareholders allocation documents",
      boardResolution: "Board resolution",
      tinCertificate: "TIN certificate"
    };
    return names[key] || key;
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

  const handleFileChange = (docType, e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type (PDF or JPEG)
    const fileType = file.type;
    if (fileType !== "application/pdf" && fileType !== "image/jpeg" && fileType !== "image/jpg") {
      setErrors(prev => ({
        ...prev,
        [docType]: "Only PDF or JPEG files are allowed"
      }));
      return;
    }

    // Update form data
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [docType]: file
      }
    }));

    // Create preview
    if (fileType.includes("image")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviews(prev => ({
          ...prev,
          [docType]: event.target.result
        }));
      };
      reader.readAsDataURL(file);
    } else {
      // For PDF, just show an icon
      setPreviews(prev => ({
        ...prev,
        [docType]: "pdf"
      }));
    }

    // Clear error
    if (errors[docType]) {
      setErrors(prev => ({
        ...prev,
        [docType]: undefined
      }));
    }
  };

  const removeFile = (docType) => {
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [docType]: null
      }
    }));
    
    setPreviews(prev => {
      const newPreviews = {...prev};
      delete newPreviews[docType];
      return newPreviews;
    });
  };

  const triggerFileInput = (docType) => {
    fileInputRefs[docType].current.click();
  };

  return (
    <SecurityStep>
      <div className="w-32 h-32 text-[#025798]">
        <Building2 className="w-full h-full" />
      </div>
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Business Verification</h2>
        <p className="text-gray-600">Please provide your business documents</p>
      </div>
      <div className="w-full space-y-6">
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Documents required for business verification</h3>

          {/* Document Upload Section */}
          <div className="space-y-6">
            {Object.keys(fileInputRefs).map((docType) => (
              <div key={docType} className="relative">
                <div className={`flex flex-col sm:flex-row items-start gap-4 p-4 border ${
                  errors[docType] ? 'border-red-500' : 'border-gray-300'
                } rounded-lg`}>
                  
                  {/* Preview area */}
                  {previews[docType] && (
                    <div className="w-20 h-20 flex-shrink-0 relative bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                      {previews[docType] === "pdf" ? (
                        <FileText className="w-10 h-10 text-[#025798]" />
                      ) : (
                        <img src={previews[docType]} alt="Preview" className="w-full h-full object-cover" />
                      )}
                      <button 
                        type="button"
                        onClick={() => removeFile(docType)}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  
                  {/* Document upload button/info */}
                  <div className="flex-grow w-full sm:w-auto">
                    <div className="font-medium text-gray-700 mb-1">{getDocumentName(docType)}</div>
                    
                    {!formData.documents[docType] ? (
                      <div 
                        onClick={() => triggerFileInput(docType)}
                        className="flex items-center justify-center gap-2 p-3 border border-dashed border-gray-400 rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <Upload className="w-5 h-5 text-gray-500" />
                        <span className="text-sm text-gray-500">Upload PDF or JPEG</span>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-600 truncate max-w-full">
                        {formData.documents[docType].name}
                      </div>
                    )}
                    
                    <input
                      type="file"
                      ref={fileInputRefs[docType]}
                      onChange={(e) => handleFileChange(docType, e)}
                      accept=".pdf,.jpg,.jpeg"
                      className="hidden"
                    />
                  </div>
                </div>
                
                {errors[docType] && (
                  <div className="mt-1 text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors[docType]}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full py-3 rounded-lg text-white bg-[#025798] hover:bg-[#024778] transition-colors mt-8"
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