import React, { useState, useEffect } from "react";
import { Eye, EyeOff, ArrowLeft, Check, PhoneCall } from "lucide-react";

// Progressive Line Component (reused from SignUp)
function ProgressiveLine({ currentStep, totalSteps }) {
  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="w-full bg-gray-300 rounded-full h-2.5 mb-6">
      <div
        className="bg-[#025798] h-2.5 rounded-full transition-all duration-500"
        style={{ width: `${progressPercentage}%` }}
      ></div>
    </div>
  );
}

// Phone Number Input Step
function PhoneNumberStep({ onSubmit, onBack }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+234");
  const [errors, setErrors] = useState({});

  const countryCodes = [
    { code: "+234", flag: "🇳🇬", name: "Nigeria" },
    { code: "+1", flag: "🇺🇸", name: "USA" },
    { code: "+44", flag: "🇬🇧", name: "UK" },
    { code: "+27", flag: "🇿🇦", name: "South Africa" },
    { code: "+254", flag: "🇰🇪", name: "Kenya" },
    { code: "+233", flag: "🇬🇭", name: "Ghana" },
  ];

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setPhoneNumber(value);
    setErrors({});
  };

  const handleCountryCodeChange = (e) => {
    setCountryCode(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!phoneNumber) {
      setErrors({ phone: "Phone number is required" });
      return;
    }
    
    if (phoneNumber.length < 8) {
      setErrors({ phone: "Please enter a valid phone number" });
      return;
    }

    setErrors({});
    onSubmit({ phone: `${countryCode}${phoneNumber}` });
  };

  const maskedNumber = phoneNumber ? `*****${phoneNumber.slice(-3)}` : "*****789";

  return (
    <div>
      <h3 className="text-lg font-bold text-center text-gray-700 mb-4">
        Reset Your Password
      </h3>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-gray-700 text-center leading-relaxed">
          To reset your password, enter your registered mobile number{" "}
          <span className="font-medium text-[#025798]">({maskedNumber})</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-row items-center gap-2">
          <div className="w-1/3">
            <select
              value={countryCode}
              onChange={handleCountryCodeChange}
              className="w-full px-3 py-3 border-2 border-gray-300 rounded-lg focus:border-[#025798] focus:ring-2 focus:ring-[#025798]/20 transition-all outline-none appearance-none"
            >
              {countryCodes.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.flag} {country.code}
                </option>
              ))}
            </select>
          </div>
          <div className="w-2/3">
            <input
              type="tel"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={handlePhoneChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#025798] focus:ring-2 focus:ring-[#025798]/20 transition-all outline-none"
              required
            />
          </div>
        </div>
        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        
        <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg font-medium hover:bg-gray-400 transition duration-300 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Sign In
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-[#025798] text-white rounded-lg font-medium hover:bg-[#025798]/90 transition duration-300"
          >
            Send OTP
          </button>
        </div>
      </form>
    </div>
  );
}

// OTP Verification Step (similar to SignUp but adapted for forgot password)
function OTPVerificationStep({ phoneNumber, onSubmit, onBack, onResend }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(60);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      value = value.charAt(0);
    }
    
    if (value && !/^\d+$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus to the next input field
    if (value && index < 5) {
      const nextInput = document.getElementById(`reset-otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`reset-otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleResendOTP = () => {
    if (countdown === 0) {
      setCountdown(60);
      onResend();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setErrors({ otp: "Please enter the complete 6-digit OTP" });
      return;
    }
    
    setErrors({});
    onSubmit({ otp: otpValue });
  };

  const maskedPhone = phoneNumber ? `*****${phoneNumber.slice(-3)}` : "*****789";

  return (
    <div>
      <h3 className="text-lg font-bold text-center text-gray-700 mb-6">
        Verify Your Phone Number
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-gray-600">
            Enter the 6-digit code sent to {maskedPhone}
          </p>
          {countdown > 0 ? (
            <span className="text-sm text-gray-500">Resend in {countdown}s</span>
          ) : (
            <button
              type="button"
              onClick={handleResendOTP}
              className="text-sm text-[#025798] font-medium hover:underline"
            >
              Resend OTP
            </button>
          )}
        </div>
        
        <div className="flex justify-between gap-2 my-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`reset-otp-${index}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-[#025798] focus:ring-2 focus:ring-[#025798]/20 transition-all outline-none"
            />
          ))}
        </div>
        {errors.otp && <p className="text-red-500 text-sm mt-1">{errors.otp}</p>}
        
        <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg font-medium hover:bg-gray-400 transition duration-300"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={otp.join("").length !== 6}
            className={`px-6 py-3 ${
              otp.join("").length !== 6
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#025798] hover:bg-[#025798]/90"
            } text-white rounded-lg font-medium transition duration-300`}
          >
            Verify OTP
          </button>
        </div>
      </form>
    </div>
  );
}

// Password Reset Step (similar to SignUp password step)
function PasswordResetStep({ onSubmit, onBack }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!password) newErrors.password = "Password is required.";
    if (password && password.length < 6) newErrors.password = "Password must be at least 6 characters.";
    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match.";
    
    if (Object.keys(newErrors).length === 0) {
      onSubmit({ password });
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-bold text-center text-gray-700 mb-6">
        Set New Password
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-lg focus:border-[#025798] focus:ring-2 focus:ring-[#025798]/20 transition-all outline-none"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-lg focus:border-[#025798] focus:ring-2 focus:ring-[#025798]/20 transition-all outline-none"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showConfirmPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
        {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
        
        <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg font-medium hover:bg-gray-400 transition duration-300"
          >
            Back
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-[#025798] text-white rounded-lg font-medium hover:bg-[#025798]/90 transition duration-300"
          >
            Reset Password
          </button>
        </div>
      </form>
    </div>
  );
}

// Success Step
function SuccessStep({ onSignIn }) {
  return (
    <div className="text-center py-8">
      <Check className="mx-auto mb-6 text-green-500" size={64} />
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        Password Reset Successfully!
      </h3>
      <p className="text-gray-600 text-lg mb-6">
        Your password has been updated successfully.
      </p>
      <button
        onClick={onSignIn}
        className="px-6 py-3 bg-[#025798] text-white rounded-lg font-medium hover:bg-[#025798]/90 transition duration-300"
      >
        Sign In Now
      </button>
    </div>
  );
}

// Main Forgot Password Component
export default function ForgotPassword({ onBackToSignIn }) {
  const Steps = {
    PHONE_INPUT: 1,
    OTP_VERIFICATION: 2,
    PASSWORD_RESET: 3,
    SUCCESS: 4,
  };

  const [currentStep, setCurrentStep] = useState(Steps.PHONE_INPUT);
  const [phoneNumber, setPhoneNumber] = useState("");

  const handlePhoneSubmit = (data) => {
    setPhoneNumber(data.phone);
    setCurrentStep(Steps.OTP_VERIFICATION);
    // In a real app, you would make an API call to send OTP
    console.log("Sending OTP to:", data.phone);
  };

  const handleOTPSubmit = (data) => {
    setCurrentStep(Steps.PASSWORD_RESET);
    // In a real app, you would verify the OTP
    console.log("Verifying OTP:", data.otp);
  };

  const handlePasswordSubmit = (data) => {
    setCurrentStep(Steps.SUCCESS);
    // In a real app, you would update the password
    console.log("Updating password for phone:", phoneNumber);
  };

  const handleResendOTP = () => {
    // In a real app, you would resend the OTP
    console.log("Resending OTP to:", phoneNumber);
  };

  const handleBack = () => {
    if (currentStep === Steps.PHONE_INPUT) {
      onBackToSignIn();
    } else if (currentStep === Steps.OTP_VERIFICATION) {
      setCurrentStep(Steps.PHONE_INPUT);
    } else if (currentStep === Steps.PASSWORD_RESET) {
      setCurrentStep(Steps.OTP_VERIFICATION);
    }
  };

  return (
    <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-10 mx-auto">
      <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6 text-center">
        Reset Password
      </h2>

      {/* Progressive Line */}
      {currentStep !== Steps.SUCCESS && (
        <ProgressiveLine currentStep={currentStep} totalSteps={3} />
      )}

      <div>
        {currentStep === Steps.PHONE_INPUT && (
          <PhoneNumberStep onSubmit={handlePhoneSubmit} onBack={handleBack} />
        )}
        {currentStep === Steps.OTP_VERIFICATION && (
          <OTPVerificationStep
            phoneNumber={phoneNumber}
            onSubmit={handleOTPSubmit}
            onBack={handleBack}
            onResend={handleResendOTP}
          />
        )}
        {currentStep === Steps.PASSWORD_RESET && (
          <PasswordResetStep onSubmit={handlePasswordSubmit} onBack={handleBack} />
        )}
        {currentStep === Steps.SUCCESS && (
          <SuccessStep onSignIn={onBackToSignIn} />
        )}
      </div>
    </div>
  );
}