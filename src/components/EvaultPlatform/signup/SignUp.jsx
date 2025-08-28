import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signup } from '../store/authSlice';
import {
  UserPlus,
  Mail,
  Check,
  PhoneCall,
  EyeOff,
  Eye,
  Lock,
} from "lucide-react";

// Progressive Line Component
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

// Simple Error Message Component
function ErrorMessage({ message, onDismiss }) {
  if (!message) return null;
  
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex justify-between items-center">
      <span className="text-sm">{message}</span>
      {onDismiss && (
        <button 
          onClick={onDismiss}
          className="text-red-500 hover:text-red-700 ml-2"
        >
          ×
        </button>
      )}
    </div>
  );
}

// Simple Success Message Component
function SuccessMessage({ message }) {
  if (!message) return null;
  
  return (
    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
      <span className="text-sm">{message}</span>
    </div>
  );
}

// Account Type Step Component
function AccountTypeStep({ onSelect }) {
  return (
    <div className="space-y-6 transition-opacity duration-500">
      <h3 className="text-xl font-medium text-center text-gray-700">
        Please Choose an Account Type
      </h3>
      <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
        <button
          onClick={() => onSelect("personal")}
          className="p-6 w-full sm:w-[180px] border-2 border-gray-300 rounded-lg hover:border-[#025798] focus:outline-none focus:ring-2 focus:ring-[#025798]/20 transition-all flex flex-col items-center"
        >
          <UserPlus className="mb-3" size={40} strokeWidth={1.5} />
          <h4 className="text-xl font-medium mb-2 text-gray-800">Personal</h4>
          <p className="text-sm text-gray-600 text-center">
            For individual use and personal finances
          </p>
        </button>
        <button
          onClick={() => onSelect("business")}
          className="p-6 w-full sm:w-[180px] border-2 border-gray-300 rounded-lg hover:border-[#025798] focus:outline-none focus:ring-2 focus:ring-[#025798]/20 transition-all flex flex-col items-center"
        >
          <Mail className="mb-3" size={40} strokeWidth={1.5} />
          <h4 className="text-xl font-medium mb-2 text-gray-800">Business</h4>
          <p className="text-sm text-gray-600 text-center">
            For companies and business operations
          </p>
        </button>
      </div>
    </div>
  );
}

// OTP Verification Step Component
function OTPVerificationStep({ onSubmit, onBack }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+234");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [errors, setErrors] = useState({});

  const countryCodes = [
    { code: "+234", flag: "🇳🇬", name: "Nigeria" },
    { code: "+1", flag: "🇺🇸", name: "USA" },
    { code: "+44", flag: "🇬🇧", name: "UK" },
    { code: "+27", flag: "🇿🇦", name: "South Africa" },
    { code: "+254", flag: "🇰🇪", name: "Kenya" },
    { code: "+233", flag: "🇬🇭", name: "Ghana" },
  ];

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setPhoneNumber(value);
    setErrors({});
  };

  const handleCountryCodeChange = (e) => {
    setCountryCode(e.target.value);
  };

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
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerifyPhone = () => {
    // Basic validation
    if (!phoneNumber) {
      setErrors({ phone: "Phone number is required" });
      return;
    }

    // Simulate OTP sending
    setIsPhoneVerified(true);
    setCountdown(60);
    console.log(`Sending OTP to ${countryCode}${phoneNumber}`);
    setErrors({});
  };

  const handleResendOTP = () => {
    if (countdown === 0) {
      setCountdown(60);
      console.log(`Resending OTP to ${countryCode}${phoneNumber}`);
    }
  };

  const handleContinue = () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setErrors({ otp: "Please enter the complete 6-digit OTP" });
      return;
    }

    console.log(`Verifying OTP: ${otpValue}`);
    
    const phoneData = {
      phone: `${countryCode}${phoneNumber}`,
      otp: otpValue,
      phone_verified: true
    };
    
    onSubmit(phoneData);
  };

  return (
    <div>
      <h3 className="text-lg font-bold text-center text-gray-700 mb-6">
        Verify Your Phone Number
      </h3>
      <div className="space-y-4">
        <div className="flex flex-row items-center gap-2">
          <div className="w-1/3">
            <select
              value={countryCode}
              onChange={handleCountryCodeChange}
              disabled={isPhoneVerified}
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
              disabled={isPhoneVerified}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#025798] focus:ring-2 focus:ring-[#025798]/20 transition-all outline-none"
            />
          </div>
        </div>
        {errors.phone && (
          <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
        )}

        {!isPhoneVerified ? (
          <button
            onClick={handleVerifyPhone}
            className="w-full px-6 py-3 bg-[#025798] hover:bg-white text-white hover:text-[#025798] transition duration-300 border-2 border-[#025798] rounded-lg ease-linear font-medium"
          >
            Verify Number
          </button>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Enter the 6-digit code sent to {countryCode}
                {phoneNumber}
              </p>
              {countdown > 0 ? (
                <span className="text-sm text-gray-500">
                  Resend in {countdown}s
                </span>
              ) : (
                <button
                  onClick={handleResendOTP}
                  className="text-sm text-[#025798] font-medium hover:underline"
                >
                  Resend OTP
                </button>
              )}
            </div>

            <div className="flex justify-between gap-2 my-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-[#025798] focus:ring-2 focus:ring-[#025798]/20 transition-all outline-none"
                />
              ))}
            </div>
            {errors.otp && (
              <p className="text-red-500 text-sm mt-1">{errors.otp}</p>
            )}
          </>
        )}

        <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg font-medium hover:bg-gray-400 transition duration-300"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleContinue}
            disabled={!isPhoneVerified || otp.join("").length !== 6}
            className={`px-6 py-3 ${
              !isPhoneVerified || otp.join("").length !== 6
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#025798] hover:bg-[#025798]/90"
            } text-white rounded-lg font-medium border-2 rounded-lg ease-linear`}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

// Data Input Step Component
function DataInputStep({ accountType, step, onSubmit, onBack, userData = {}, loading = false, error = null, onClearError }) {
  const [formData, setFormData] = useState({
    firstname: userData.firstname || "",
    lastname: userData.lastname || "",
    email: userData.email || "",
    businessName: userData.businessName || "",
    rcNumber: userData.rcNumber || "",
    nin: userData.nin || "",
    password: userData.password || "",
    confirmPassword: userData.confirmPassword || "",
    vaultPhrase: userData.vaultPhrase || "",
    referralCode: userData.referralCode || "",
  });

  const [errors, setErrors] = useState({});
  const [fieldTouched, setFieldTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Enhanced validation functions
  const validateEmail = (email) => {
    if (!email) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return null;
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'firstname':
        if (!value.trim()) return "First name is required";
        if (value.trim().length < 2) return "First name must be at least 2 characters";
        return null;
        
      case 'lastname':
        if (!value.trim()) return "Last name is required";
        if (value.trim().length < 2) return "Last name must be at least 2 characters";
        return null;
        
      case 'businessName':
        if (!value.trim()) return "Business name is required";
        if (value.trim().length < 2) return "Business name must be at least 2 characters";
        return null;
        
      case 'email':
        return validateEmail(value);
        
      case 'rcNumber':
        if (accountType === 'business' && !value.trim()) return "RC number is required for business accounts";
        if (value && value.trim().length < 6) return "RC number must be at least 6 characters";
        return null;
        
      case 'nin':
        if (accountType === 'business' && !value.trim()) return "NIN is required for business accounts";
        if (value && value.trim().length !== 11) return "NIN must be exactly 11 digits";
        if (value && !/^\d+$/.test(value.trim())) return "NIN must contain only numbers";
        return null;
        
      case 'password':
        if (!value) return "Password is required";
        if (value.length < 6) return "Password must be at least 6 characters";
        return null;
        
      case 'confirmPassword':
        if (!value) return "Please confirm your password";
        if (value !== formData.password) return "Passwords do not match";
        return null;
        
      default:
        return null;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null
      }));
    }

    // Real-time validation for touched fields
    if (fieldTouched[name]) {
      const fieldError = validateField(name, value);
      if (fieldError) {
        setErrors((prev) => ({
          ...prev,
          [name]: fieldError
        }));
      }
    }

    // Special case: validate confirmPassword when password changes
    if (name === 'password' && fieldTouched.confirmPassword && formData.confirmPassword) {
      const confirmError = validateField('confirmPassword', formData.confirmPassword);
      setErrors((prev) => ({
        ...prev,
        confirmPassword: confirmError
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    setFieldTouched((prev) => ({
      ...prev,
      [name]: true
    }));

    const fieldError = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: fieldError
    }));
  };

  const validateStep1 = () => {
    const newErrors = {};
    const fieldsToValidate = accountType === "personal" 
      ? ['firstname', 'lastname', 'email']
      : ['businessName', 'email', 'rcNumber', 'nin'];

    fieldsToValidate.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    return newErrors;
  };

  const validateStep4 = () => {
    const newErrors = {};
    const fieldsToValidate = ['password', 'confirmPassword'];

    fieldsToValidate.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    return newErrors;
  };

  const handleContinue = (e) => {
    e.preventDefault();
    
    // Clear any previous global error
    if (onClearError) onClearError();
    
    // Mark all relevant fields as touched
    const fieldsToTouch = step === 1 
      ? (accountType === "personal" ? ['firstname', 'lastname', 'email'] : ['businessName', 'email', 'rcNumber', 'nin'])
      : ['password', 'confirmPassword'];
    
    const newTouched = {};
    fieldsToTouch.forEach(field => {
      newTouched[field] = true;
    });
    setFieldTouched(prev => ({ ...prev, ...newTouched }));

    const newErrors = step === 1 ? validateStep1() : validateStep4();
    
    if (Object.keys(newErrors).length === 0) {
      console.log(`Step ${step} form data validated`);
      onSubmit(formData);
    } else {
      console.log(`Step ${step} validation failed`);
      setErrors(newErrors);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-bold text-center text-gray-700 mb-6">
        {accountType === "personal"
          ? step === 1
            ? "Personal Details"
            : "Set Your Password"
          : step === 1
            ? "Business Details"
            : "Set Your Password"}
      </h3>

      {error && step === 4 && (
        <ErrorMessage message={error} onDismiss={onClearError} />
      )}

      <form className="space-y-4">
        {step === 1 && accountType === "personal" && (
          <>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  name="firstname"
                  placeholder="First Name"
                  value={formData.firstname}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-[#025798]/20 transition-all outline-none ${
                    errors.firstname 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:border-[#025798]'
                  }`}
                />
                {errors.firstname && (
                  <p className="text-red-500 text-sm mt-1">{errors.firstname}</p>
                )}
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  name="lastname"
                  placeholder="Last Name"
                  value={formData.lastname}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-[#025798]/20 transition-all outline-none ${
                    errors.lastname 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:border-[#025798]'
                  }`}
                />
                {errors.lastname && (
                  <p className="text-red-500 text-sm mt-1">{errors.lastname}</p>
                )}
              </div>
            </div>
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-[#025798]/20 transition-all outline-none ${
                  errors.email 
                    ? 'border-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:border-[#025798]'
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
          </>
        )}
        {step === 1 && accountType === "business" && (
          <>
            <div>
              <input
                type="text"
                name="businessName"
                placeholder="Business Name"
                value={formData.businessName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-[#025798]/20 transition-all outline-none ${
                  errors.businessName 
                    ? 'border-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:border-[#025798]'
                }`}
              />
              {errors.businessName && (
                <p className="text-red-500 text-sm mt-1">{errors.businessName}</p>
              )}
            </div>
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-[#025798]/20 transition-all outline-none ${
                  errors.email 
                    ? 'border-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:border-[#025798]'
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
            <div>
              <input
                type="text"
                name="rcNumber"
                placeholder="RC Number"
                value={formData.rcNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-[#025798]/20 transition-all outline-none ${
                  errors.rcNumber 
                    ? 'border-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:border-[#025798]'
                }`}
              />
              {errors.rcNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.rcNumber}</p>
              )}
            </div>
            <div>
              <input
                type="text"
                name="nin"
                placeholder="NIN (11 digits)"
                value={formData.nin}
                onChange={handleChange}
                onBlur={handleBlur}
                maxLength="11"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-[#025798]/20 transition-all outline-none ${
                  errors.nin 
                    ? 'border-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:border-[#025798]'
                }`}
              />
              {errors.nin && (
                <p className="text-red-500 text-sm mt-1">{errors.nin}</p>
              )}
            </div>
          </>
        )}
        {step === 4 && (
          <>
            <div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password (minimum 6 characters)"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 pr-12 border-2 rounded-lg focus:ring-2 focus:ring-[#025798]/20 transition-all outline-none ${
                    errors.password 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:border-[#025798]'
                  }`}
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
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>
            <div>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 pr-12 border-2 rounded-lg focus:ring-2 focus:ring-[#025798]/20 transition-all outline-none ${
                    errors.confirmPassword 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:border-[#025798]'
                  }`}
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
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>
            <div>
              <input
                type="text"
                name="referralCode"
                placeholder="Referral Code (Optional)"
                value={formData.referralCode}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#025798] focus:ring-2 focus:ring-[#025798]/20 transition-all outline-none"
              />
            </div>
          </>
        )}
        
        <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
          <button
            type="button"
            onClick={onBack}
            disabled={loading}
            className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg font-medium hover:bg-gray-400 transition duration-300 disabled:opacity-50"
          >
            Back
          </button>
          <button
            type="submit"
            onClick={handleContinue}
            disabled={loading}
            className="px-6 py-3 bg-[#025798] text-white rounded-lg font-medium hover:bg-[#025798]/90 transition duration-300 disabled:opacity-50 min-w-[120px] flex items-center justify-center"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {step === 4 ? "Creating..." : "Processing..."}
              </div>
            ) : (
              step === 4 ? "Create Account" : "Continue"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

// Success Step Component
function SuccessStep({ accountType, onSignIn, isAuthenticated = false }) {
  return (
    <div className="text-center py-8">
      <Check className="mx-auto mb-6 text-green-500" size={64} />
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        Account Created Successfully!
      </h3>
      <p className="text-gray-600 text-xl mb-4">
        Your {accountType} account has been successfully created.
      </p>
      
      {isAuthenticated ? (
        <div className="space-y-4">
          <SuccessMessage message="You are now logged in! Redirecting to dashboard..." />
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#025798] mr-2"></div>
            <span className="text-gray-500 text-sm">Loading dashboard...</span>
          </div>
        </div>
      ) : (
        <button
          className="mt-8 px-6 py-3 bg-[#025798] text-white rounded-lg font-medium hover:bg-[#025798]/90 transition duration-300"
          onClick={onSignIn}
        >
          Sign In
        </button>
      )}
    </div>
  );
}

// Main SignUp Component
export default function SignUp({ onCancel }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const Steps = {
    ACCOUNT_TYPE: 1,
    DATA_INPUT: 2,
    OTP_VERIFICATION: 3,
    PASSWORD_INPUT: 4,
    SUCCESS: 5,
  };

  const [currentStep, setCurrentStep] = useState(Steps.ACCOUNT_TYPE);
  const [accountType, setAccountType] = useState(null);
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleAccountTypeSelect = (type) => {
    setAccountType(type);
    setCurrentStep(Steps.DATA_INPUT);
  };

  const clearError = () => {
    setError(null);
  };

  const clearSuccess = () => {
    setSuccess(null);
  };

  const handleDataSubmit = async (data) => {
    let updatedUserData = {};

    if (currentStep === Steps.DATA_INPUT) {
      // Store the initial form data (personal/business details)
      updatedUserData = {
        ...userData,
        firstname: data.firstname || userData.firstname,
        lastname: data.lastname || userData.lastname,
        email: data.email || userData.email,
        businessName: data.businessName || userData.businessName,
        rcNumber: data.rcNumber || userData.rcNumber,
        nin: data.nin || userData.nin
      };
      setUserData(updatedUserData);
      console.log("Step 1 data stored");
      setCurrentStep(Steps.OTP_VERIFICATION);
    } else if (currentStep === Steps.OTP_VERIFICATION) {
      // Store the phone verification data while preserving previous data
      updatedUserData = {
        ...userData,
        phone: data.phone || userData.phone,
        otp: data.otp || userData.otp,
        phone_verified: data.phone_verified || userData.phone_verified
      };
      setUserData(updatedUserData);
      console.log("Step 2 data stored");
      setCurrentStep(Steps.PASSWORD_INPUT);
    } else if (currentStep === Steps.PASSWORD_INPUT) {
      // Merge all data including password and referral code
      updatedUserData = {
        ...userData,
        password: data.password || userData.password,
        confirmPassword: data.confirmPassword || userData.confirmPassword,
        vaultPhrase: data.vaultPhrase || userData.vaultPhrase,
        referralCode: data.referralCode || userData.referralCode
      };
      setUserData(updatedUserData);
      console.log("Creating account...");

      // Validate required fields before API call
      if (!updatedUserData.email || !updatedUserData.password) {
        setError('Email and password are required');
        return;
      }

      if (accountType === 'personal' && (!updatedUserData.firstname || !updatedUserData.lastname)) {
        setError('First name and last name are required for personal accounts');
        return;
      }

      if (accountType === 'business' && !updatedUserData.businessName) {
        setError('Business name is required for business accounts');
        return;
      }

      // Prepare data for API with correct field names
      const signupData = {
        email: updatedUserData.email,
        password: updatedUserData.password,
        confirmPassword: updatedUserData.confirmPassword,
        account_type: accountType,
        phone: updatedUserData.phone,
        referral_code: updatedUserData.referralCode,
        phone_verified: updatedUserData.phone_verified,
      };

      // Add account-specific fields only if they have values
      if (accountType === 'personal') {
        if (updatedUserData.firstname) signupData.first_name = updatedUserData.firstname;
        if (updatedUserData.lastname) signupData.last_name = updatedUserData.lastname;
      } else if (accountType === 'business') {
        if (updatedUserData.businessName) signupData.business_name = updatedUserData.businessName;
        if (updatedUserData.rcNumber) signupData.rc_number = updatedUserData.rcNumber;
        if (updatedUserData.nin) signupData.nin = updatedUserData.nin;
      }

      console.log("Sending signup request");
      setLoading(true);
      setError(null);

      try {
        const result = await dispatch(signup(signupData));

        if (result.success) {
          console.log("Account created successfully");
          
          // Check if immediate authentication occurred
          if (result.immediateAuth) {
            console.log("User authenticated immediately, redirecting to dashboard");
            setCurrentStep(Steps.SUCCESS);
            setTimeout(() => {
              navigate('/dashboard');
            }, 2500);
          } else {
            setCurrentStep(Steps.SUCCESS);
          }
        } else {
          console.error("Signup failed:", result.error);
          setError(result.error || 'Account creation failed. Please try again.');
        }
      } catch (err) {
        console.error("Signup error:", err);
        setError('Account creation failed. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBack = () => {
    setError(null); // Clear errors when going back
    if (currentStep === Steps.DATA_INPUT) {
      setCurrentStep(Steps.ACCOUNT_TYPE);
    } else if (currentStep === Steps.OTP_VERIFICATION) {
      setCurrentStep(Steps.DATA_INPUT);
    } else if (currentStep === Steps.PASSWORD_INPUT) {
      setCurrentStep(Steps.OTP_VERIFICATION);
    }
  };

  const handleSignIn = () => {
    navigate("/dashboard");
  };

  return (
    <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-10 mx-auto">
      <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6 text-center">
        Create Your Account
      </h2>

      {/* Progressive Line */}
      <ProgressiveLine currentStep={currentStep} totalSteps={5} />

      <div>
        {currentStep === Steps.ACCOUNT_TYPE && (
          <AccountTypeStep onSelect={handleAccountTypeSelect} />
        )}
        {currentStep === Steps.DATA_INPUT && (
          <DataInputStep
            accountType={accountType}
            step={1}
            onSubmit={handleDataSubmit}
            onBack={handleBack}
            userData={userData}
          />
        )}
        {currentStep === Steps.OTP_VERIFICATION && (
          <OTPVerificationStep
            onSubmit={handleDataSubmit}
            onBack={handleBack}
          />
        )}
        {currentStep === Steps.PASSWORD_INPUT && (
          <DataInputStep
            accountType={accountType}
            step={4}
            onSubmit={handleDataSubmit}
            onBack={handleBack}
            userData={userData}
            loading={loading}
            error={error}
            onClearError={clearError}
          />
        )}
        {currentStep === Steps.SUCCESS && (
          <SuccessStep 
            accountType={accountType} 
            onSignIn={handleSignIn}
            isAuthenticated={true}
          />
        )}
      </div>
    </div>
  );
}