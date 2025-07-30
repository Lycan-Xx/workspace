"use client"

import { useState } from "react"
import { Building2, Save } from "lucide-react"
import EmailNotificationSettings from "./EmailNotificationSettings"

const BusinessProfileSetup = ({ portfolioType }) => {
  // All your existing state management here
  const [businessInfo, setBusinessInfo] = useState({
    businessName: "",
    email: "",
    phone: "",
    description: "",
    bannerImage: null,
    logoImage: null,
    bannerPreview: "",
    logoPreview: "",
  })

  const [services, setServices] = useState([])
  const [paymentOptions, setPaymentOptions] = useState({
    bankTransfer: false,
    creditCard: false,
  })
  const [accounts, setAccounts] = useState([])

  // All your existing functions here...
  const handleSubmit = () => {
    if (!businessInfo.businessName || !businessInfo.email) {
      alert("Please fill in the required business information.")
      return
    }
    alert("Your business profile has been saved successfully!")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {portfolioType === "school" ? "School" : "Business"} Profile Setup
          </h1>
          <p className="text-lg text-gray-600">Create your professional {portfolioType} profile in minutes</p>
        </div>

        {/* Business Information Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-bold">{portfolioType === "school" ? "School" : "Business"} Information</h2>
          </div>
          <p className="text-gray-600 mb-6">Set up your {portfolioType} details and upload your brand images</p>

          {/* Your existing form content here */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium">
                <Building2 className="h-4 w-4" />
                {portfolioType === "school" ? "School" : "Business"} Name *
              </label>
              <input
                type="text"
                placeholder={`Enter your ${portfolioType} name`}
                value={businessInfo.businessName}
                onChange={(e) => setBusinessInfo((prev) => ({ ...prev, businessName: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {/* Add more form fields as needed */}
          </div>
        </div>

        {/* Email Notification Settings */}
        <EmailNotificationSettings businessType={portfolioType} />

        {/* Save Button */}
        <div className="flex justify-center pb-8">
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save className="h-5 w-5" />
            Save {portfolioType === "school" ? "School" : "Business"} Profile
          </button>
        </div>
      </div>
    </div>
  )
}

export default BusinessProfileSetup
