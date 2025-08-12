import { useState } from "react"
import { Building2, GraduationCap, Save, Upload, Plus, Trash2, Mail, Phone, MapPin, CreditCard, Banknote, User, Globe } from "lucide-react"
import EmailNotificationSettings from "./EmailNotificationSettings"

const BusinessProfileSetup = ({ portfolioType }) => {
  const [businessInfo, setBusinessInfo] = useState({
    businessName: "",
    email: "",
    phone: "",
    description: "",
    website: "",
    address: "",
    bannerImage: null,
    logoImage: null,
    bannerPreview: "",
    logoPreview: "",
  })

  const [services, setServices] = useState([
    { id: Date.now(), name: "", description: "", price: "", category: "", duration: "" }
  ])

  const [paymentOptions, setPaymentOptions] = useState({
    bankTransfer: false,
    creditCard: false,
  })

  const [accounts, setAccounts] = useState([
    { id: Date.now(), accountName: "", accountNumber: "", bankName: "", accountType: "checking" }
  ])

  const handleImageUpload = (event, type) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (type === 'banner') {
          setBusinessInfo(prev => ({
            ...prev,
            bannerImage: file,
            bannerPreview: e.target.result
          }))
        } else {
          setBusinessInfo(prev => ({
            ...prev,
            logoImage: file,
            logoPreview: e.target.result
          }))
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const addService = () => {
    const newService = {
      id: Date.now(),
      name: "",
      description: "",
      price: "",
      category: portfolioType === "school" ? "Education" : "Service",
      duration: portfolioType === "school" ? "Annual" : ""
    }
    setServices(prev => [...prev, newService])
  }

  const updateService = (id, field, value) => {
    setServices(prev => prev.map(service => 
      service.id === id ? { ...service, [field]: value } : service
    ))
  }

  const removeService = (id) => {
    setServices(prev => prev.filter(service => service.id !== id))
  }

  const addAccount = () => {
    const newAccount = {
      id: Date.now(),
      accountName: "",
      accountNumber: "",
      bankName: "",
      accountType: "checking"
    }
    setAccounts(prev => [...prev, newAccount])
  }

  const updateAccount = (id, field, value) => {
    setAccounts(prev => prev.map(account => 
      account.id === id ? { ...account, [field]: value } : account
    ))
  }

  const removeAccount = (id) => {
    setAccounts(prev => prev.filter(account => account.id !== id))
  }

  const handleSubmit = async () => {
    // Validation
    if (!businessInfo.businessName || !businessInfo.email || !businessInfo.phone) {
      alert("Please fill in all required business information.")
      return
    }

    if (services.some(service => !service.name || !service.price)) {
      alert("Please complete all service information.")
      return
    }

    if (!paymentOptions.bankTransfer && !paymentOptions.creditCard) {
      alert("Please select at least one payment option.")
      return
    }

    if (paymentOptions.bankTransfer && accounts.some(account => !account.accountName || !account.accountNumber)) {
      alert("Please complete all bank account information.")
      return
    }

    // Here you would save to your PocketBase backend
    const profileData = {
      ...businessInfo,
      services: services.filter(s => s.name && s.price),
      paymentOptions,
      accounts: paymentOptions.bankTransfer ? accounts.filter(a => a.accountName && a.accountNumber) : [],
      portfolioType,
      isActive: true,
      createdAt: new Date().toISOString()
    }

    console.log("Profile Data:", profileData)
    alert(`Your ${portfolioType} profile has been saved successfully!`)
  }

  const isSchool = portfolioType === "school"

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center py-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            {isSchool ? (
              <GraduationCap className="h-10 w-10 text-blue-600" />
            ) : (
              <Building2 className="h-10 w-10 text-green-600" />
            )}
            <h1 className="text-4xl font-bold text-gray-900">
              {isSchool ? "School" : "Business"} Profile Setup
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Create your professional {portfolioType} profile and get listed on Instant Payments
          </p>
        </div>

        {/* Business Information Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            {isSchool ? (
              <GraduationCap className="h-5 w-5 text-blue-600" />
            ) : (
              <Building2 className="h-5 w-5 text-green-600" />
            )}
            <h2 className="text-xl font-bold">
              {isSchool ? "School" : "Business"} Information
            </h2>
          </div>

          {/* Banner Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Banner Image</label>
            <div className="relative">
              <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                {businessInfo.bannerPreview ? (
                  <img
                    src={businessInfo.bannerPreview}
                    alt="Banner preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Click to upload banner image (1200x400 recommended)</p>
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'banner')}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* Logo and Basic Info */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
            {/* Logo Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">Logo</label>
              <div className="relative">
                <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                  {businessInfo.logoPreview ? (
                    <img
                      src={businessInfo.logoPreview}
                      alt="Logo preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Upload className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'logo')}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>

            {/* Basic Info */}
            <div className="lg:col-span-3 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium">
                    {isSchool ? (
                      <GraduationCap className="h-4 w-4" />
                    ) : (
                      <Building2 className="h-4 w-4" />
                    )}
                    {isSchool ? "School" : "Business"} Name *
                  </label>
                  <input
                    type="text"
                    placeholder={`Enter your ${portfolioType} name`}
                    value={businessInfo.businessName}
                    onChange={(e) => setBusinessInfo(prev => ({ ...prev, businessName: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <Mail className="h-4 w-4" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={businessInfo.email}
                    onChange={(e) => setBusinessInfo(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <Phone className="h-4 w-4" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={businessInfo.phone}
                    onChange={(e) => setBusinessInfo(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <Globe className="h-4 w-4" />
                    Website (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://yourwebsite.com"
                    value={businessInfo.website}
                    onChange={(e) => setBusinessInfo(prev => ({ ...prev, website: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <MapPin className="h-4 w-4" />
                  Address
                </label>
                <input
                  type="text"
                  placeholder="Enter your address"
                  value={businessInfo.address}
                  onChange={(e) => setBusinessInfo(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  placeholder={`Describe your ${portfolioType} and what you offer`}
                  value={businessInfo.description}
                  onChange={(e) => setBusinessInfo(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">
              {isSchool ? "Classes & Programs" : "Services Offered"}
            </h2>
            <button
              onClick={addService}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add {isSchool ? "Class" : "Service"}
            </button>
          </div>

          <div className="space-y-4">
            {services.map((service, index) => (
              <div key={service.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {isSchool ? "Class/Grade Name" : "Service Name"} *
                    </label>
                    <input
                      type="text"
                      placeholder={isSchool ? "e.g., Grade 1, Mathematics" : "e.g., Web Development"}
                      value={service.name}
                      onChange={(e) => updateService(service.id, 'name', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {isSchool ? "Annual Fee" : "Price"} *
                    </label>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={service.price}
                      onChange={(e) => updateService(service.id, 'price', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <select
                      value={service.category}
                      onChange={(e) => updateService(service.id, 'category', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {isSchool ? (
                        <>
                          <option value="Education">Education</option>
                          <option value="Elementary">Elementary</option>
                          <option value="Secondary">Secondary</option>
                          <option value="Higher Education">Higher Education</option>
                        </>
                      ) : (
                        <>
                          <option value="Service">General Service</option>
                          <option value="Technology">Technology</option>
                          <option value="Healthcare">Healthcare</option>
                          <option value="Finance">Finance</option>
                          <option value="Retail">Retail</option>
                          <option value="Consulting">Consulting</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div className="lg:col-span-2 space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <textarea
                      placeholder={isSchool ? "Describe the curriculum and what's included" : "Describe what this service includes"}
                      value={service.description}
                      onChange={(e) => updateService(service.id, 'description', e.target.value)}
                      rows={2}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="flex items-end">
                    {services.length > 1 && (
                      <button
                        onClick={() => removeService(service.id)}
                        className="flex items-center gap-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Options */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Payment Options</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={paymentOptions.bankTransfer}
                  onChange={(e) => setPaymentOptions(prev => ({ ...prev, bankTransfer: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <Banknote className="h-4 w-4 text-blue-600" />
                Bank Transfer
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={paymentOptions.creditCard}
                  onChange={(e) => setPaymentOptions(prev => ({ ...prev, creditCard: e.target.checked }))}
                  className="rounded border-gray-300 text-green-600 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                />
                <CreditCard className="h-4 w-4 text-green-600" />
                Credit Card
              </label>
            </div>
          </div>
        </div>

        {/* Bank Accounts Section */}
        {paymentOptions.bankTransfer && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Bank Accounts</h2>
              <button
                onClick={addAccount}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Account
              </button>
            </div>

            <div className="space-y-4">
              {accounts.map((account) => (
                <div key={account.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Account Name *</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={account.accountName}
                        onChange={(e) => updateAccount(account.id, 'accountName', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Account Number *</label>
                      <input
                        type="text"
                        placeholder="1234567890"
                        value={account.accountNumber}
                        onChange={(e) => updateAccount(account.id, 'accountNumber', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Bank Name *</label>
                      <input
                        type="text"
                        placeholder="First Bank"
                        value={account.bankName}
                        onChange={(e) => updateAccount(account.id, 'bankName', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="flex items-end">
                      {accounts.length > 1 && (
                        <button
                          onClick={() => removeAccount(account.id)}
                          className="flex items-center gap-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Email Notification Settings */}
        <EmailNotificationSettings businessType={portfolioType} />

        {/* Save Button */}
        <div className="flex justify-center pb-8">
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium"
          >
            <Save className="h-5 w-5" />
            Save {isSchool ? "School" : "Business"} Profile
          </button>
        </div>
      </div>
    </div>
  )
}

export default BusinessProfileSetup