import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  ArrowLeft,
  Upload,
  CheckCircle,
  XCircle,
  Edit2,
  Save,
  Star,
} from "lucide-react";
import { clsx } from "clsx";
import { westAfricanCountries, statesByCountry } from "../data/locations";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Tier2Upgrade from "../../../account-upgrades/tier2/Tier2Upgrade";
import Tier3Upgrade from "../../../account-upgrades/tier3/Tier3Upgrade";
import BusinessKycStep from "../../../account-upgrades/business-upgrade/BusinessKycStep";
import BusinessSuccessStep from "../../../account-upgrades/business-upgrade/BusinessSuccessStep";
import LoadingStep from "../../../account-upgrades/shared/LoadingStep";

export const FormField = ({
  label,
  type,
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
}) => {
  const inputClasses = clsx(
    "w-full p-4 border border-gray-300 rounded-lg",
    "focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
    "transition-colors duration-200",
    disabled && "bg-gray-50 cursor-not-allowed opacity-75",
  );

  // Ensure value is handled correctly based on type
  const getSafeValue = () => {
    if (type === "toggle") {
      return Boolean(value);
    }
    return value !== null && value !== undefined ? String(value) : '';
  };

  const safeValue = getSafeValue();

  switch (type) {
    case "select":
      return (
        <div className="p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
          <select
            className={inputClasses}
            value={String(safeValue)}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
          >
            <option value="">Select {label}</option>
            {options && options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      );

    case "toggle":
      return (
        <div className="p-4">
          <label className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">{label}</span>
            <input
              type="checkbox"
              checked={safeValue}
              onChange={(e) => onChange(e.target.checked)}
              disabled={disabled}
              className="ml-2"
            />
          </label>
        </div>
      );

    default:
      return (
        <div className="p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
          <input
            type={type}
            className={inputClasses}
            value={String(safeValue)}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
          />
        </div>
      );
  }
};

export const SettingsContent = ({ setting, onBack }) => {
  const fileInputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showTier2Upgrade, setShowTier2Upgrade] = useState(false);
  const [showTier3Upgrade, setShowTier3Upgrade] = useState(false);
  const [currentTier, setCurrentTier] = useState(1);
  const [showBusinessKYC, setShowBusinessKYC] = useState(false);
  const [businessKYCData, setBusinessKYCData] = useState(null);
  const [showBusinessSuccess, setShowBusinessSuccess] = useState(false);
  const [isBusinessLoading, setIsBusinessLoading] = useState(false);
  const userRole = useSelector((state) => state.auth.user?.role);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle successful upgrade return from security verification
  useEffect(() => {
    if (
      location.state?.verificationComplete &&
      location.state?.upgradedToTier
    ) {
      // Update the tier state if verification was successful
      setCurrentTier(location.state.upgradedToTier);
      // Clear the location state to prevent re-updating on re-renders
      navigate("/settings", { replace: true });
    }
  }, [location.state, navigate]);

  const [formState, setFormState] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'prefer-not-to-say',
    country: '',
  });

  // Fetch user data from PocketBase on mount
  useEffect(() => {
    async function fetchUser() {
      try {
        const { apiService } = await import('../../../../../services/api');
        const res = await apiService.getCurrentUser();
        if (res.success && res.user) {
          setFormState((prev) => ({
            ...prev,
            firstname: res.user.firstname || '',
            lastname: res.user.lastname || '',
            email: res.user.email || '',
            phone: res.user.phone || '',
            dateOfBirth: res.user.dateOfBirth || '',
            gender: res.user.gender || 'prefer-not-to-say',
            country: res.user.country || '',
          }));
        }
      } catch (e) {
        // handle error
      }
    }
    fetchUser();
  }, []);

  const handleChange = (field, value) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange("profilePicture", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // Save logic here
    setIsEditing(false);
  };

  const handleTier2UpgradeComplete = (upgradeData) => {
    console.log('Tier 2 upgrade completed:', upgradeData);
    setCurrentTier(2);
    setShowTier2Upgrade(false);
    // You can save the upgrade data to your backend here
  };

  const handleTier2UpgradeCancel = () => {
    setShowTier2Upgrade(false);
  };

        const handleTier3UpgradeComplete = (upgradeData) => {
    console.log('Tier 3 upgrade completed:', upgradeData);
    setCurrentTier(3);
    setShowTier3Upgrade(false);
    // You can save the upgrade data to your backend here
  };

  const handleTier3UpgradeCancel = () => {
    setShowTier3Upgrade(false);
  };

  const handleBusinessUpgradeStart = () => {
    if (formState.businessName && formState.businessEmail && formState.upgradeTermsAccepted) {
      setShowBusinessKYC(true);
    }
  };

  const handleBusinessKYCComplete = (kycData) => {
    setBusinessKYCData({
      ...kycData,
      businessName: formState.businessName,
      businessEmail: formState.businessEmail,
    });
    setShowBusinessKYC(false);
    setIsBusinessLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsBusinessLoading(false);
      setShowBusinessSuccess(true);
    }, 3000);
  };

  const handleBusinessUpgradeComplete = () => {
    // Handle final completion
    setShowBusinessSuccess(false);
    // You might want to refresh the page or update the UI
    window.location.reload();
  };

  const renderHeader = () => (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-gray-900">{setting.title}</h2>
    </div>
  );

  const renderContent = () => {
    switch (setting.id) {
      case "account":
        return (
          <div className="space-y-6">
            <FormField
              label="First Name"
              type="text"
              value={formState.firstname}
              onChange={() => {}}
              placeholder="First Name"
              disabled={true}
            />
            <FormField
              label="Last Name"
              type="text"
              value={formState.lastname}
              onChange={() => {}}
              placeholder="Last Name"
              disabled={true}
            />
            <FormField
              label="Email Address"
              type="email"
              value={formState.email}
              onChange={() => {}}
              placeholder="Email Address"
              disabled={true}
            />
            <FormField
              label="Phone Number"
              type="tel"
              value={formState.phone}
              onChange={() => {}}
              placeholder="Phone Number"
              disabled={true}
            />
            <FormField
              label="Date of Birth"
              type="date"
              value={formState.dateOfBirth}
              onChange={() => {}}
              placeholder="Date of Birth"
              disabled={true}
            />
            <FormField
              label="Gender"
              type="select"
              value={formState.gender}
              onChange={() => {}}
              options={[
                { label: "Male", value: "male" },
                { label: "Female", value: "female" },
                { label: "Prefer not to say", value: "prefer-not-to-say" },
              ]}
              disabled={true}
            />
            <FormField
              label="Country"
              type="select"
              value={formState.country}
              onChange={() => {}}
              options={westAfricanCountries}
              disabled={true}
            />
          </div>
        );

      case "security":
        return (
          <>
            <FormField
              label="Current Password"
              type="password"
              value={formState.currentPassword}
              onChange={(value) => handleChange("currentPassword", value)}
              placeholder="Enter current password"
              disabled={!isEditing}
            />
            <FormField
              label="New Password"
              type="password"
              value={formState.newPassword}
              onChange={(value) => handleChange("newPassword", value)}
              placeholder="Enter new password"
              disabled={!isEditing}
            />
            <FormField
              label="Two-Factor Authentication"
              type="toggle"
              value={formState.twoFactor}
              onChange={(value) => handleChange("twoFactor", value)}
              disabled={!isEditing}
            />
          </>
        );

      case "notifications":
        return (
          <>
            <FormField
              label="Email Notifications"
              type="toggle"
              value={formState.emailNotifications}
              onChange={(value) => handleChange("emailNotifications", value)}
              disabled={!isEditing}
            />
            <FormField
              label="Push Notifications"
              type="toggle"
              value={formState.pushNotifications}
              onChange={(value) => handleChange("pushNotifications", value)}
              disabled={!isEditing}
            />
            <FormField
              label="Marketing Emails"
              type="toggle"
              value={formState.marketingEmails}
              onChange={(value) => handleChange("marketingEmails", value)}
              disabled={!isEditing}
            />
          </>
        );

      case "payment":
        return (
          <FormField
            label="Default Payment Method"
            type="select"
            value={formState.paymentMethod}
            onChange={(value) => handleChange("paymentMethod", value)}
            options={[
              { label: "Credit Card", value: "card" },
              { label: "PayPal", value: "paypal" },
              { label: "Bank Transfer", value: "bank" },
            ]}
            disabled={!isEditing}
          />
        );

      case "accessibility":
        return (
          <>
            <FormField
              label="Font Size"
              type="select"
              value={formState.fontSize}
              onChange={(value) => handleChange("fontSize", value)}
              options={[
                { label: "Small", value: "small" },
                { label: "Medium", value: "medium" },
                { label: "Large", value: "large" },
              ]}
              disabled={!isEditing}
            />
            <FormField
              label="High Contrast"
              type="toggle"
              value={formState.highContrast}
              onChange={(value) => handleChange("highContrast", value)}
              disabled={!isEditing}
            />
            <FormField
              label="Reduced Motion"
              type="toggle"
              value={formState.reducedMotion}
              onChange={(value) => handleChange("reducedMotion", value)}
              disabled={!isEditing}
            />
          </>
        );

      case "help":
        return (
          <div className="space-y-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-2">Contact Support</h3>
              <p className="text-gray-600">Email: support@evault.com</p>
              <p className="text-gray-600">Phone: 1-800-123-4567</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-2">Documentation</h3>
              <a href="#" className="text-blue-600 hover:underline">
                View Documentation
              </a>
            </div>
          </div>
        );

      case "account-upgrade":
        const tiers = [
          {
            id: 1,
            name: "Tier 1",
            features: [
              "Basic account features",
              "Up to ₦50,000 daily transfer limit",
              "Basic support",
            ],
          },
          {
            id: 2,
            name: "Tier 2",
            features: [
              "Dedicated account number",
              "Increased daily transfer limit up to ₦200,000",
              "Priority support",
              "Virtual card access",
              "Bill payments",
            ],
          },
          {
            id: 3,
            name: "Tier 3",
            features: [
              "Increased daily transfer limit up to ₦500,000",
              "Premium support 24/7",
              "Multiple virtual cards",
            ],
          },
        ];

        if (userRole === "business") {
          if (showBusinessKYC) {
            return (
              <BusinessKycStep
                onComplete={handleBusinessKYCComplete}
              />
            );
          }

          if (isBusinessLoading) {
            return (
              <LoadingStep
                onAnimationComplete={() => setIsBusinessLoading(false)}
              />
            );
          }

          if (showBusinessSuccess) {
            return (
              <BusinessSuccessStep
                businessData={businessKYCData}
                onComplete={handleBusinessUpgradeComplete}
              />
            );
          }

          return (
            <div className="space-y-6 p-4">
              <FormField
                label="Business Name"
                type="text"
                value={formState.businessName}
                onChange={(value) => handleChange("businessName", value)}
                placeholder="Enter your business name"
                disabled={false}
              />
              <FormField
                label="Business Email"
                type="email"
                value={formState.businessEmail}
                onChange={(value) => handleChange("businessEmail", value)}
                placeholder="Enter your business email"
                disabled={false}
              />
              <div className="p-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formState.upgradeTermsAccepted}
                    onChange={(e) =>
                      handleChange("upgradeTermsAccepted", e.target.checked)
                    }
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">
                    I accept the terms and conditions for the upgrade
                  </span>
                </label>
              </div>
              <div className="p-4">
                <button
                  onClick={handleBusinessUpgradeStart}
                  disabled={
                    !formState.businessName ||
                    !formState.businessEmail ||
                    !formState.upgradeTermsAccepted
                  }
                  className={clsx(
                    "w-full py-3 rounded-md text-white font-bold text-lg flex justify-center items-center transition duration-500",
                    formState.businessName &&
                      formState.businessEmail &&
                      formState.upgradeTermsAccepted
                      ? "bg-blue-500 hover:bg-blue-600"
                      : "bg-gray-300 cursor-not-allowed",
                  )}
                >
                  Start Business Verification
                </button>
              </div>
            </div>
          );
        }

        // Personal account tiers interface (stateful, with banner and upgrade restrictions)
        const currentTierObj = tiers.find((t) => t.id === currentTier);

        return (
          <div className="space-y-6 p-4">
            {/* Current Tier Banner */}
            <div className="mb-6 p-4 rounded-lg bg-blue-50 border border-blue-200 flex items-center">
              <Star
                className={clsx(
                  "w-8 h-8 mr-4",
                  currentTier === 1
                    ? "text-gray-400"
                    : currentTier === 2
                      ? "text-blue-500"
                      : "text-purple-500",
                )}
                fill="currentColor"
              />
              <div>
                <div className="font-bold text-lg text-blue-900">
                  Current Tier: {currentTierObj.name}
                </div>
                <div className="text-gray-700 text-sm mt-1">
                  {currentTierObj.features.join(", ")}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {tiers.map((tier) => {
                // Only allow upgrade to the next tier
                const isCurrent = tier.id === currentTier;
                const isNext = tier.id === currentTier + 1;
                return (
                  <div
                    key={tier.id}
                    className={clsx(
                      "rounded-xl border p-6 space-y-4",
                      isCurrent
                        ? "border-blue-500 shadow-lg"
                        : "border-gray-200",
                    )}
                  >
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Star
                          className={clsx(
                            "w-8 h-8",
                            tier.id === 1
                              ? "text-gray-400"
                              : tier.id === 2
                                ? "text-blue-500"
                                : "text-purple-500",
                          )}
                          fill="currentColor"
                        />
                      </div>
                      <h3 className="text-xl font-bold">{tier.name}</h3>
                      <p className="text-2xl font-bold mt-2 text-gray-900">
                        {tier.price}
                      </p>
                    </div>
                    <div className="space-y-2">
                      {tier.features.map((feature, index) => (
                        <div key={index} className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                          <span className="text-gray-600 text-sm">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => {
                        if (isNext) {
                          if (tier.id === 2) {
                            // Start Tier 2 upgrade flow
                            setShowTier2Upgrade(true);
                          } else if (tier.id === 3) {
                            // Start Tier 3 upgrade flow
                            setShowTier3Upgrade(true);
                          }
                        }
                      }}
                      disabled={!isNext}
                      className={clsx(
                        "w-full py-2 rounded-lg font-medium mt-4 transition-colors",
                        isCurrent
                          ? "bg-gray-100 text-gray-800 cursor-default"
                          : isNext
                            ? "bg-blue-500 text-white hover:bg-blue-600"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed",
                      )}
                    >
                      {isCurrent
                        ? "Current Plan"
                        : isNext
                          ? "Upgrade"
                          : "Locked"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Show only the upgrade interface when it's active
  if (showTier2Upgrade) {
    return (
      <div className="fixed inset-0 z-[9999] bg-white">
        <Tier2Upgrade
          onComplete={handleTier2UpgradeComplete}
          onCancel={handleTier2UpgradeCancel}
        />
      </div>
    );
  }

  if (showTier3Upgrade) {
    return (
      <div className="fixed inset-0 z-[9999] bg-white">
        <Tier3Upgrade
          onComplete={handleTier3UpgradeComplete}
          onCancel={handleTier3UpgradeCancel}
        />
      </div>
    );
  }

  // Main Settings Content - only show when no upgrade is active
  return (
    <div>
      <button
        onClick={onBack}
        className="mb-6 inline-flex items-center text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Settings
      </button>

      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-8 border-b border-gray-200">
          {renderHeader()}
          <p className="text-gray-600 mt-2">{setting.description}</p>
        </div>

        <div className="divide-y divide-gray-200">{renderContent()}</div>
      </div>
    </div>
  );
};