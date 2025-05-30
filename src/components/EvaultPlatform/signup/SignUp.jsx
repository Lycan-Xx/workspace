
import React, { useState } from "react";
import { UserPlus, Mail, Check } from "lucide-react";

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

// Data Input Step Component
function DataInputStep({ accountType, step, onSubmit, onBack }) {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    businessName: "",
    rcNumber: "",
    nin: "",
    password: "",
    confirmPassword: "",
    vaultPhrase: "",
    referralCode: "",
  });

  const [errors, setErrors] = useState({});

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
      if (!formData.phone) newErrors.phone = "Phone number is required.";
    } else if (accountType === "Business") {
      if (!formData.businessName) newErrors.businessName = "Business name is required.";
      if (!formData.email) newErrors.email = "Email is required.";
      if (!formData.rcNumber) newErrors.rcNumber = "RC number is required.";
      if (!formData.nin) newErrors.nin = "NIN is required.";
    }
    return newErrors;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.password) newErrors.password = "Password is required.";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";
    if (!formData.vaultPhrase) newErrors.vaultPhrase = "Vault phrase is required.";
    return newErrors;
  };

  const handleContinue = (e) => {
    e.preventDefault();
    const newErrors = step === 1 ? validateStep1() : validateStep2();
    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
    } else {
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
                {errors.firstname && <p className="text-red-500 text-sm mt-1">{errors.firstname}</p>}
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
                {errors.lastname && <p className="text-red-500 text-sm mt-1">{errors.lastname}</p>}
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
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#025798] focus:ring-2 focus:ring-[#025798]/20 transition-all outline-none"
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
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
            {errors.businessName && <p className="text-red-500 text-sm mt-1">{errors.businessName}</p>}
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#025798] focus:ring-2 focus:ring-[#025798]/20 transition-all outline-none"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            <input
              type="text"
              name="rcNumber"
              placeholder="RC Number"
              value={formData.rcNumber}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#025798] focus:ring-2 focus:ring-[#025798]/20 transition-all outline-none"
            />
            {errors.rcNumber && <p className="text-red-500 text-sm mt-1">{errors.rcNumber}</p>}
            <input
              type="text"
              name="nin"
              placeholder="NIN"
              value={formData.nin}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#025798] focus:ring-2 focus:ring-[#025798]/20 transition-all outline-none"
            />
            {errors.nin && <p className="text-red-500 text-sm mt-1">{errors.nin}</p>}
          </>
        )}
        {step === 2 && (
          <>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#025798] focus:ring-2 focus:ring-[#025798]/20 transition-all outline-none"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#025798] focus:ring-2 focus:ring-[#025798]/20 transition-all outline-none"
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            <input
              type="text"
              name="vaultPhrase"
              placeholder="Vault Phrase/PIN"
              value={formData.vaultPhrase}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#025798] focus:ring-2 focus:ring-[#025798]/20 transition-all outline-none"
            />
            {errors.vaultPhrase && <p className="text-red-500 text-sm mt-1">{errors.vaultPhrase}</p>}
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
            {step === 2 ? "Submit" : "Continue"}
          </button>
        </div>
      </form>
    </div>
  );
}

// Success Step Component
function SuccessStep({ accountType }) {
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
        onClick={() => window.location.reload()}
      >
        Sign In
      </button>
    </div>
  );
}

// Main SignUp Component
export default function SignUp() {
  const Steps = {
    ACCOUNT_TYPE: 1,
    DATA_INPUT: 2,
    PASSWORD_INPUT: 3,
    SUCCESS: 4,
  };

  const [currentStep, setCurrentStep] = useState(Steps.ACCOUNT_TYPE);
  const [accountType, setAccountType] = useState(null);

  const handleAccountTypeSelect = (type) => {
    setAccountType(type);
    setCurrentStep(Steps.DATA_INPUT);
  };

  const handleDataSubmit = (data) => {
    if (currentStep === Steps.DATA_INPUT) {
      setCurrentStep(Steps.PASSWORD_INPUT);
    } else if (currentStep === Steps.PASSWORD_INPUT) {
      setCurrentStep(Steps.SUCCESS);
    }
  };

  const handleBack = () => {
    if (currentStep === Steps.DATA_INPUT) {
      setCurrentStep(Steps.ACCOUNT_TYPE);
    } else if (currentStep === Steps.PASSWORD_INPUT) {
      setCurrentStep(Steps.DATA_INPUT);
    }
  };

  return (
    <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-10 mx-auto">
      <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6 text-center">
        Create Your Account
      </h2>

      {/* Progressive Line */}
      <ProgressiveLine currentStep={currentStep} totalSteps={4} />

      <div>
        {currentStep === Steps.ACCOUNT_TYPE && (
          <AccountTypeStep onSelect={handleAccountTypeSelect} />
        )}
        {(currentStep === Steps.DATA_INPUT || currentStep === Steps.PASSWORD_INPUT) && (
          <DataInputStep
            accountType={accountType}
            step={currentStep === Steps.DATA_INPUT ? 1 : 2}
            onSubmit={handleDataSubmit}
            onBack={handleBack}
          />
        )}
        {currentStep === Steps.SUCCESS && (
          <SuccessStep accountType={accountType} />
        )}
      </div>
    </div>
  );
}
