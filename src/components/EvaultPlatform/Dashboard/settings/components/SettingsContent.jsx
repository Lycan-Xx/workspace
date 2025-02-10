import React, { useState, useRef } from 'react';
import { ArrowLeft, Upload, CheckCircle, XCircle, Edit2, Save } from 'lucide-react';
import { clsx } from 'clsx';
import { westAfricanCountries, statesByCountry } from '../data/locations';

export const FormField = ({ 
  label, 
  type, 
  value, 
  onChange, 
  options, 
  placeholder,
  disabled = false 
}) => {
  const inputClasses = clsx(
    'w-full p-4 border border-gray-300 rounded-lg',
    'focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
    'transition-colors duration-200',
    disabled && 'bg-gray-50 cursor-not-allowed opacity-75'
  );

  switch (type) {
    case 'select':
      return (
        <div className="p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
          <select
            className={inputClasses}
            value={value}
            onChange={e => onChange(e.target.value)}
            disabled={disabled}
          >
            <option value="">Select {label}</option>
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
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
            value={value}
            onChange={e => onChange(e.target.value)}
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
  const [formState, setFormState] = useState({
    // Account & Biodata
    profilePicture: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80&w=200&h=200',
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'prefer-not-to-say',
    address: '',
    state: '',
    country: '',
    bvnVerified: false,
    ninVerified: true,
    // Security
    currentPassword: '',
    newPassword: '',
    twoFactor: false,
    // Notifications
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: false,
    // Payment
    paymentMethod: 'card',
    // Accessibility
    fontSize: 'medium',
    highContrast: false,
    reducedMotion: false,
    // Account Upgrade Fields
    businessName: '',
    businessEmail: '',
    upgradeTermsAccepted: false,
  });

  const handleChange = (field, value) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange('profilePicture', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // Save logic here
    setIsEditing(false);
  };

  const renderHeader = () => (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-gray-900">{setting.title}</h2>
      <button
        onClick={() => isEditing ? handleSave() : setIsEditing(true)}
        className={`flex items-center px-4 py-2 rounded-lg ${
          isEditing 
            ? 'bg-green-600 hover:bg-green-700 text-white' 
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {isEditing ? (
          <>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </>
        ) : (
          <>
            <Edit2 className="w-4 h-4 mr-2" />
            Edit Profile
          </>
        )}
      </button>
    </div>
  );

  const renderContent = () => {
    switch (setting.id) {
      case 'account':
        return (
          <div className="space-y-6">
            {/* Profile Picture Section */}
            <div className="p-4">
              <label className="block text-sm font-medium text-gray-700 mb-4">Profile Picture</label>
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <img
                    src={formState.profilePicture}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full text-white hover:bg-blue-700 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">
                    Upload a new profile picture. Recommended size: 200x200px.
                  </p>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <FormField
              label="Full Name"
              type="text"
              value={formState.fullName}
              onChange={value => handleChange('fullName', value)}
              placeholder="Enter your full name"
              disabled={!isEditing}
            />
            <FormField
              label="Email Address"
              type="email"
              value={formState.email}
              onChange={value => handleChange('email', value)}
              placeholder="Enter your email"
              disabled={!isEditing}
            />
            <FormField
              label="Phone Number"
              type="tel"
              value={formState.phone}
              onChange={value => handleChange('phone', value)}
              placeholder="Enter your phone number"
              disabled={!isEditing}
            />
            <FormField
              label="Date of Birth"
              type="date"
              value={formState.dateOfBirth}
              onChange={value => handleChange('dateOfBirth', value)}
              disabled={!isEditing}
            />
            <FormField
              label="Gender"
              type="select"
              value={formState.gender}
              onChange={value => handleChange('gender', value)}
              options={[
                { label: 'Male', value: 'male' },
                { label: 'Female', value: 'female' },
                { label: 'Prefer not to say', value: 'prefer-not-to-say' }
              ]}
              disabled={!isEditing}
            />
            <FormField
              label="Address"
              type="text"
              value={formState.address}
              onChange={value => handleChange('address', value)}
              placeholder="Enter your address"
              disabled={!isEditing}
            />
            <FormField
              label="Country"
              type="select"
              value={formState.country}
              onChange={value => {
                handleChange('country', value);
                handleChange('state', ''); // Reset state when country changes
              }}
              options={westAfricanCountries}
              disabled={!isEditing}
            />
            <FormField
              label="State/Region"
              type="select"
              value={formState.state}
              onChange={value => handleChange('state', value)}
              options={statesByCountry[formState.country] || []}
              disabled={!isEditing || !formState.country}
            />

            {/* ID Verification Status */}
            <div className="p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">ID Verification Status</h3>
              <div className="space-y-4">
                <div className={clsx(
                  'flex items-center justify-between p-4 rounded-lg',
                  formState.bvnVerified ? 'bg-green-50' : 'bg-red-50'
                )}>
                  <div>
                    <h4 className="font-medium text-gray-900">BVN Verification</h4>
                    <p className="text-sm text-gray-600">Bank Verification Number status</p>
                  </div>
                  {formState.bvnVerified ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-600" />
                  )}
                </div>
                <div className={clsx(
                  'flex items-center justify-between p-4 rounded-lg',
                  formState.ninVerified ? 'bg-green-50' : 'bg-red-50'
                )}>
                  <div>
                    <h4 className="font-medium text-gray-900">NIN Verification</h4>
                    <p className="text-sm text-gray-600">National Identity Number status</p>
                  </div>
                  {formState.ninVerified ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-600" />
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <>
            <FormField
              label="Current Password"
              type="password"
              value={formState.currentPassword}
              onChange={value => handleChange('currentPassword', value)}
              placeholder="Enter current password"
              disabled={!isEditing}
            />
            <FormField
              label="New Password"
              type="password"
              value={formState.newPassword}
              onChange={value => handleChange('newPassword', value)}
              placeholder="Enter new password"
              disabled={!isEditing}
            />
            <FormField
              label="Two-Factor Authentication"
              type="toggle"
              value={formState.twoFactor}
              onChange={value => handleChange('twoFactor', value)}
              disabled={!isEditing}
            />
          </>
        );

      case 'notifications':
        return (
          <>
            <FormField
              label="Email Notifications"
              type="toggle"
              value={formState.emailNotifications}
              onChange={value => handleChange('emailNotifications', value)}
              disabled={!isEditing}
            />
            <FormField
              label="Push Notifications"
              type="toggle"
              value={formState.pushNotifications}
              onChange={value => handleChange('pushNotifications', value)}
              disabled={!isEditing}
            />
            <FormField
              label="Marketing Emails"
              type="toggle"
              value={formState.marketingEmails}
              onChange={value => handleChange('marketingEmails', value)}
              disabled={!isEditing}
            />
          </>
        );

      case 'payment':
        return (
          <FormField
            label="Default Payment Method"
            type="select"
            value={formState.paymentMethod}
            onChange={value => handleChange('paymentMethod', value)}
            options={[
              { label: 'Credit Card', value: 'card' },
              { label: 'PayPal', value: 'paypal' },
              { label: 'Bank Transfer', value: 'bank' },
            ]}
            disabled={!isEditing}
          />
        );

      case 'accessibility':
        return (
          <>
            <FormField
              label="Font Size"
              type="select"
              value={formState.fontSize}
              onChange={value => handleChange('fontSize', value)}
              options={[
                { label: 'Small', value: 'small' },
                { label: 'Medium', value: 'medium' },
                { label: 'Large', value: 'large' },
              ]}
              disabled={!isEditing}
            />
            <FormField
              label="High Contrast"
              type="toggle"
              value={formState.highContrast}
              onChange={value => handleChange('highContrast', value)}
              disabled={!isEditing}
            />
            <FormField
              label="Reduced Motion"
              type="toggle"
              value={formState.reducedMotion}
              onChange={value => handleChange('reducedMotion', value)}
              disabled={!isEditing}
            />
          </>
        );

      case 'help':
        return (
          <div className="space-y-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-2">Contact Support</h3>
              <p className="text-gray-600">Email: support@evault.com</p>
              <p className="text-gray-600">Phone: 1-800-123-4567</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-2">Documentation</h3>
              <a href="#" className="text-blue-600 hover:underline">View Documentation</a>
            </div>
          </div>
        );

      case 'account-upgrade':
        return (
          <div className="space-y-6 p-4">
            <FormField
              label="Business Name"
              type="text"
              value={formState.businessName}
              onChange={value => handleChange('businessName', value)}
              placeholder="Enter your business name"
              disabled={false}
            />
            <FormField
              label="Business Email"
              type="email"
              value={formState.businessEmail}
              onChange={value => handleChange('businessEmail', value)}
              placeholder="Enter your business email"
              disabled={false}
            />
            <div className="p-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formState.upgradeTermsAccepted}
                  onChange={e => handleChange('upgradeTermsAccepted', e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">
                  I accept the terms and conditions for the upgrade
                </span>
              </label>
            </div>
            <div className="p-4">
              <button
                onClick={() => alert('Account upgraded successfully!')}
                disabled={
                  !formState.businessName ||
                  !formState.businessEmail ||
                  !formState.upgradeTermsAccepted
                }
                className={clsx(
                  "w-full py-3 rounded-md text-white font-bold text-lg flex justify-center items-center transition duration-500",
                  formState.businessName && formState.businessEmail && formState.upgradeTermsAccepted
                    ? "bg-blue-500 hover:bg-blue-600"
                    : "bg-gray-300 cursor-not-allowed"
                )}
              >
                Upgrade Account
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

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
        
        <div className="divide-y divide-gray-200">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};
