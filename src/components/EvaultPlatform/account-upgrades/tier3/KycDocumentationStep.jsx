
import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import { Camera, CheckCircle, SkipForward, User } from "lucide-react";
import SecurityStep from "./SecurityStep";

const KycDocumentationStep = ({ verifiedData, onComplete }) => {
  const [capturedImage, setCapturedImage] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const startCamera = async () => {
    try {
      setIsCapturing(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'user'
        } 
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please ensure camera permissions are granted.');
      setIsCapturing(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCapturing(false);
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert to blob
      canvas.toBlob((blob) => {
        setCapturedImage(blob);
        stopCamera();
      }, 'image/jpeg', 0.8);
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  const handleContinue = () => {
    const kycData = {
      faceVerification: capturedImage ? 'completed' : 'skipped',
      capturedAt: new Date().toISOString(),
      deviceInfo: navigator.userAgent,
    };
    
    onComplete(kycData);
  };

  const handleSkip = () => {
    stopCamera();
    const kycData = {
      faceVerification: 'skipped',
      capturedAt: new Date().toISOString(),
      deviceInfo: navigator.userAgent,
    };
    
    onComplete(kycData);
  };

  return (
    <SecurityStep>
      <div className="w-32 h-32 text-[#025798]">
        <User className="w-full h-full" />
      </div>
      
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">KYC Documentation</h2>
        <p className="text-gray-600">
          Complete your verification with face capture for enhanced security
        </p>
      </div>

      {/* Display Verified ID Data */}
      <div className="w-full bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
        <h3 className="text-sm font-semibold text-green-800 flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          ID Verification Completed
        </h3>
        <div className="text-sm text-green-700 space-y-1">
          <p><span className="font-medium">Name:</span> {verifiedData.name}</p>
          <p><span className="font-medium">ID Type:</span> {verifiedData.idType}</p>
          <p><span className="font-medium">ID Number:</span> {verifiedData.idNumber}</p>
          <p><span className="font-medium">Date of Birth:</span> {verifiedData.dateOfBirth}</p>
          <p><span className="font-medium">Date of Issuance:</span> {verifiedData.dateOfIssuance}</p>
          {verifiedData.expiryDate && (
            <p><span className="font-medium">Expiry Date:</span> {verifiedData.expiryDate}</p>
          )}
        </div>
      </div>

      {/* Face Verification Section */}
      <div className="w-full space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 text-center">
          Face Verification
        </h3>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          {!isCapturing && !capturedImage && (
            <div className="space-y-4">
              <Camera className="w-12 h-12 text-gray-400 mx-auto" />
              <p className="text-sm text-gray-600">
                Take a live photo for face verification
              </p>
              <button
                onClick={startCamera}
                className="bg-[#025798] text-white px-6 py-2 rounded-lg hover:bg-[#024680] transition-colors flex items-center gap-2 mx-auto"
              >
                <Camera className="w-4 h-4" />
                Start Camera
              </button>
            </div>
          )}

          {isCapturing && (
            <div className="space-y-4">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full max-w-sm mx-auto rounded-lg"
              />
              <div className="flex gap-3 justify-center">
                <button
                  onClick={captureImage}
                  className="bg-[#025798] text-white px-6 py-2 rounded-lg hover:bg-[#024680] transition-colors flex items-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  Capture
                </button>
                <button
                  onClick={stopCamera}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {capturedImage && (
            <div className="space-y-4">
              <img
                src={URL.createObjectURL(capturedImage)}
                alt="Captured face"
                className="w-full max-w-sm mx-auto rounded-lg"
              />
              <div className="flex gap-3 justify-center">
                <button
                  onClick={retakePhoto}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Retake
                </button>
                <button
                  onClick={handleContinue}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Continue
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Skip Button */}
        <div className="text-center">
          <button
            onClick={handleSkip}
            className="text-gray-500 hover:text-gray-700 text-sm underline flex items-center gap-1 mx-auto"
          >
            <SkipForward className="w-4 h-4" />
            Skip Face Verification
          </button>
        </div>

        {/* Continue Button (when no camera access or skipped) */}
        {!isCapturing && !capturedImage && (
          <button
            onClick={handleContinue}
            className="w-full bg-[#025798] text-white py-3 rounded-lg hover:bg-[#024680] transition-colors"
          >
            Continue Without Face Verification
          </button>
        )}
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </SecurityStep>
  );
};

KycDocumentationStep.propTypes = {
  verifiedData: PropTypes.object.isRequired,
  onComplete: PropTypes.func.isRequired,
};

export default KycDocumentationStep;
