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

// Account Type Step Component
function AccountTypeStep({ onSelect }) {
  return (
    <div className="space-y-6 transition-opacity duration-500">
      <h3 className="text-xl font-medium text-center text-gray-700">
        Please Choose an Account Type
      </h3>
      <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
        <button
          onClick={() => onSelect("Personal")}
          className="p-6 w-full sm:w-[180px] border-2 border-gray-300 rounded-lg hover:border-[#025798] focus:outline-none focus:ring-2 focus:ring-[#025798]/20 transition-all flex flex-col items-center"
        >
          <UserPlus className="mb-3" size={40} strokeWidth={1.5} />
          <h4 className="text-xl font-medium mb-2 text-gray-800">Personal</h4>
          <p className="text-sm text-gray-600 text-center">
            For individual use and personal finances
          </p>
        </button>
        <button
          onClick={() => onSelect("Business")}
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

    // In a real app, you would call an API to send OTP
    console.log(`Sending OTP to ${countryCode}${phoneNumber}`);

    // Clear any errors
    setErrors({});
  };

  const handleResendOTP = () => {
    if (countdown === 0) {
      // Resend OTP logic
      setCountdown(60);
      console.log(`Resending OTP to ${countryCode}${phoneNumber}`);
    }
  };

  const handleContinue = () => {
    // Check if OTP is complete
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setErrors({ otp: "Please enter the complete 6-digit OTP" });
      return;
    }

    // Simulate OTP verification
    // In a real app, you would verify the OTP with an API
    console.log(`Verifying OTP: ${otpValue}`);

    // If verification is successful, proceed to the next step with phone data
    const phoneData = {
      phone: `${countryCode}${phoneNumber}`,
      otp: otpValue,
      phoneVerified: true
    };
    
    console.log("OTP verification data:", phoneData);
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
function DataInputStep({ accountType, step, onSubmit, onBack, userData = {} }) {
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (accountType === "Personal") {
      if (!formData.firstname) newErrors.firstname = "First name is required.";
      if (!formData.lastname) newErrors.lastname = "Last name is required.";
      if (!formData.email) newErrors.email = "Email is required.";
    } else if (accountType === "Business") {
      if (!formData.businessName)
        newErrors.businessName = "Business name is required.";
      if (!formData.email) newErrors.email = "Email is required.";
      if (!formData.rcNumber) newErrors.rcNumber = "RC number is required.";
      if (!formData.nin) newErrors.nin = "NIN is required.";
    }
    return newErrors;
  };

  const validateStep4 = () => {
    const newErrors = {};
    if (!formData.password) newErrors.password = "Password is required.";
    if (formData.password && formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";
    return newErrors;
  };

  const handleContinue = (e) => {
    e.preventDefault();
    const newErrors = step === 1 ? validateStep1() : validateStep4();
    if (Object.keys(newErrors).length === 0) {
      console.log(`Step ${step} form data:`, formData);
      onSubmit(formData);
    } else {
      console.log(`Step ${step} validation errors:`, newErrors);
      setErrors(newErrors);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-bold text-center text-gray-700 mb-6">
        {accountType === "Personal"
          ? step === 1
            ? "Personal Details"
            : "Set Your Password"
          : step === 1
            ? "Business Details"
            : "Set Your Password"}
      </h3>
      <form className="space-y-4">
        {step === 1 && accountType === "Personal" && (
          <>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  name="firstname"
                  placeholder="First Name"
                  value={formData.firstname}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#025798] focus:ring-2 focus:ring-[#025798]/20 transition-all outline-none"
                />
                {errors.firstname && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.firstname}
                  </p>
                )}
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  name="lastname"
                  placeholder="Last Name"
                  value={formData.lastname}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#025798] focus:ring-2 focus:ring-[#025798]/20 transition-all outline-none"
                />
                {errors.lastname && (
                  <p className="text-red-500 text-sm mt-1">{errors.lastname}</p>
                )}
              </div>
            </div>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#025798] focus:ring-2 focus:ring-[#025798]/20 transition-all outline-none"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </>
        )}
        {step === 1 && accountType === "Business" && (
          <>
            <input
              type="text"
              name="businessName"
              placeholder="Business Name"
              value={formData.businessName}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#025798] focus:ring-2 focus:ring-[#025798]/20 transition-all outline-none"
            />
            {errors.businessName && (
              <p className="text-red-500 text-sm mt-1">{errors.businessName}</p>
            )}
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#025798] focus:ring-2 focus:ring-[#025798]/20 transition-all outline-none"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
            <input
              type="text"
              name="rcNumber"
              placeholder="RC Number"
              value={formData.rcNumber}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#025798] focus:ring-2 focus:ring-[#025798]/20 transition-all outline-none"
            />
            {errors.rcNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.rcNumber}</p>
            )}
            <input
              type="text"
              name="nin"
              placeholder="NIN"
              value={formData.nin}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#025798] focus:ring-2 focus:ring-[#025798]/20 transition-all outline-none"
            />
            {errors.nin && (
              <p className="text-red-500 text-sm mt-1">{errors.nin}</p>
            )}
          </>
        )}
        {step === 4 && (
          <>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-lg focus:border-[#025798] focus:ring-2 focus:ring-[#025798]/20 transition-all outline-none"
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
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-lg focus:border-[#025798] focus:ring-2 focus:ring-[#025798]/20 transition-all outline-none"
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
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
            <input
              type="text"
              name="referralCode"
              placeholder="Referral Code (Optional)"
              value={formData.referralCode}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#025798] focus:ring-2 focus:ring-[#025798]/20 transition-all outline-none"
            />
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
            type="submit"
            onClick={handleContinue}
            className="px-6 py-3 bg-[#025798] text-white rounded-lg font-medium hover:bg-[#025798]/90 transition duration-300"
          >
            {step === 4 ? "Submit" : "Continue"}
          </button>
        </div>
      </form>
    </div>
  );
}

// Success Step Component
function SuccessStep({ accountType, onSignIn }) {
  return (
    <div className="text-center py-8">
      <Check className="mx-auto mb-6 text-green-500" size={64} />
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        Account Created Successfully!
      </h3>
      <p className="text-gray-600 text-xl">
        Your {accountType} account has been successfully created.
      </p>
      <button
        className="mt-8 px-6 py-3 bg-[#025798] text-white rounded-lg font-medium hover:bg-[#025798]/90 transition duration-300"
        onClick={onSignIn}
      >
        Sign In
      </button>
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

  const handleAccountTypeSelect = (type) => {
    setAccountType(type);
    setCurrentStep(Steps.DATA_INPUT);
  };

  const handleDataSubmit = async (data) => {
    let updatedUserData = {};

    if (currentStep === Steps.DATA_INPUT) {
      // Store the initial form data (personal/business details)
      updatedUserData = { ...userData, ...data };
      setUserData(updatedUserData);
      console.log("Step 1 data stored:", updatedUserData);
      setCurrentStep(Steps.OTP_VERIFICATION);
    } else if (currentStep === Steps.OTP_VERIFICATION) {
      // Store the phone verification data while preserving previous data
      updatedUserData = { ...userData, ...data };
      setUserData(updatedUserData);
      console.log("Step 2 data stored:", updatedUserData);
      setCurrentStep(Steps.PASSWORD_INPUT);
    } else if (currentStep === Steps.PASSWORD_INPUT) {
      // Merge all data including password and referral code
      updatedUserData = { ...userData, ...data };
      setUserData(updatedUserData);
      console.log("Account creation data:", updatedUserData);

      try {
        const { apiService } = await import("../../../services/api.js");

        // Validate required fields before API call
        if (!updatedUserData.email || !updatedUserData.password) {
          alert('Email and password are required');
          return;
        }

        if (accountType === 'Personal' && (!updatedUserData.firstname || !updatedUserData.lastname)) {
          alert('First name and last name are required for personal accounts');
          return;
        }

        if (accountType === 'Business' && !updatedUserData.businessName) {
          alert('Business name is required for business accounts');
          return;
        }

        // Prepare data for API
        const signupData = {
          email: updatedUserData.email,
          password: updatedUserData.password,
          confirmPassword: updatedUserData.confirmPassword,
          accountType: accountType,
          phone: updatedUserData.phone,
          firstname: updatedUserData.firstname,
          lastname: updatedUserData.lastname,
          businessName: updatedUserData.businessName,
          rcNumber: updatedUserData.rcNumber,
          nin: updatedUserData.nin,
          referralCode: updatedUserData.referralCode,
        };

        console.log("Final signup data being sent:", signupData);

        // Use the signup thunk from Redux store
        const result = await dispatch(signup(signupData));

        if (result.success) {
          console.log("Account created successfully:", result);
          
          if (result.requiresEmailConfirmation) {
            // Show email confirmation message
            alert("Please check your email to confirm your account before signing in.");
            setCurrentStep(Steps.SUCCESS);
          } else {
            // User is automatically signed in
            setCurrentStep(Steps.SUCCESS);
          }
        } else {
          console.error("Signup failed:", result.error);
          alert("Signup failed: " + (result.error || result.message));
        }
      } catch (error) {
        console.error("Signup error:", error);
        alert("Signup failed. Please try again.");
      }
    }
  };

  const handleBack = () => {
    if (currentStep === Steps.DATA_INPUT) {
      setCurrentStep(Steps.ACCOUNT_TYPE);
    } else if (currentStep === Steps.OTP_VERIFICATION) {
      setCurrentStep(Steps.DATA_INPUT);
    } else if (currentStep === Steps.PASSWORD_INPUT) {
      setCurrentStep(Steps.OTP_VERIFICATION);
    }
  };

  const handleSignIn = () => {
    navigate("/sign-in");
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
            userData={userData} // Pass the userData
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
            userData={userData} // Pass the userData
          />
        )}
        {currentStep === Steps.SUCCESS && (
          <SuccessStep accountType={accountType} onSignIn={handleSignIn} />
        )}
      </div>
    </div>
  );
}
