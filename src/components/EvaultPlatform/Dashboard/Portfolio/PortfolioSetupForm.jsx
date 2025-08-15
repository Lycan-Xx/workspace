import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { 
  Building2, GraduationCap, Save, Upload, Plus, Trash2, Mail, 
  Phone, MapPin, CreditCard, Banknote, User, Globe, Edit3, 
  CheckCircle, AlertCircle, Bookmark, Clock, BookOpen,
  Users, Calendar, FileText, Bell, Settings
} from "lucide-react";

const PortfolioSetupForm = ({ portfolioType }) => {
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
  });

  // Fetch business/school data from PocketBase on mount
  useEffect(() => {
    async function fetchBusinessData() {
      try {
        const { apiService } = await import('../../../../services/api');
        const res = await apiService.getCurrentUser();
        if (res.success && res.user) {
          setBusinessInfo(prev => ({
            ...prev,
            businessName: res.user.businessName || '',
            email: res.user.email || '',
            phone: res.user.phone || '',
            website: res.user.website || '',
            address: res.user.address || '',
            description: res.user.description || ''
          }));
        }
      } catch (e) {
        console.error("Error fetching business data:", e);
      }
    }
    fetchBusinessData();
  }, []);

  const [services, setServices] = useState([]);
  const [activeService, setActiveService] = useState(null);
  const [newService, setNewService] = useState({
    id: Date.now(),
    name: "",
    description: "",
    price: "",
    category: portfolioType === "school" ? "Nursery" : "General Service",
    duration: portfolioType === "school" ? "Annual" : ""
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [activeTab, setActiveTab] = useState("info");

  const handleImageUpload = (event, type) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (type === 'banner') {
          setBusinessInfo(prev => ({
            ...prev,
            bannerImage: file,
            bannerPreview: e.target.result
          }));
        } else {
          setBusinessInfo(prev => ({
            ...prev,
            logoImage: file,
            logoPreview: e.target.result
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const validateBusinessInfo = () => {
    const errors = {};
    if (!businessInfo.businessName) errors.businessName = "Name is required";
    if (!businessInfo.email) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(businessInfo.email)) errors.email = "Email is invalid";
    if (!businessInfo.phone) errors.phone = "Phone number is required";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateService = (service) => {
    const errors = {};
    if (!service.name) errors.name = "Name is required";
    if (!service.price) errors.price = "Price is required";
    else if (isNaN(service.price) || parseFloat(service.price) < 0) errors.price = "Price must be a positive number";
    
    return errors;
  };

  const addService = () => {
    const errors = validateService(newService);
    
    if (Object.keys(errors).length === 0) {
      setServices(prev => [...prev, {...newService, id: Date.now()}]);
      setNewService({
        id: Date.now() + 1,
        name: "",
        description: "",
        price: "",
        category: portfolioType === "school" ? "Nursery" : "General Service",
        duration: portfolioType === "school" ? "Annual" : ""
      });
      setActiveService(null);
    } else {
      setFormErrors(errors);
    }
  };

  const updateService = (id, field, value) => {
    if (id === newService.id) {
      setNewService(prev => ({...prev, [field]: value}));
    } else {
      setServices(prev => prev.map(service => 
        service.id === id ? { ...service, [field]: value } : service
      ));
    }
  };

  const editService = (service) => {
    setActiveService(service.id);
  };

  const removeService = (id) => {
    setServices(prev => prev.filter(service => service.id !== id));
    if (activeService === id) {
      setActiveService(null);
    }
  };

  const handleSubmit = async () => {
    if (!validateBusinessInfo()) {
      setActiveTab("info");
      return;
    }

    if (services.length === 0) {
      setFormErrors({services: "Add at least one service"});
      setActiveTab("services");
      return;
    }

    // Here you would save to your PocketBase backend
    const profileData = {
      ...businessInfo,
      services,
      portfolioType,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    console.log("Profile Data:", profileData);
    alert(`Your ${portfolioType} profile has been saved successfully!`);
  };

  const isSchool = portfolioType === "school";
  const serviceLabel = isSchool ? "Class" : "Service";
  const serviceLabelPlural = isSchool ? "Classes" : "Services";

  // Enhanced service creation UI
  const ServiceCreationWizard = () => (
    <div className="bg-white rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          {activeService === newService.id ? `Edit ${serviceLabel}` : `Add New ${serviceLabel}`}
        </h3>
        {activeService === newService.id && (
          <button
            onClick={() => setActiveService(null)}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isSchool ? "Class/Grade Name" : "Service Name"} *
            </label>
            <input
              type="text"
              placeholder={isSchool ? "e.g., Grade 1, Mathematics" : "e.g., Web Development"}
              value={newService.name}
              onChange={(e) => updateService(newService.id, 'name', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors
                ${formErrors.name ? 'border-red-500' : 'border-gray-300'}`}
            />
            {formErrors.name && (
              <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={newService.category}
              onChange={(e) => updateService(newService.id, 'category', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              {isSchool ? (
                <>
                  <option value="Nursery">Nursery</option>
                  <option value="Primary">Primary</option>
                  <option value="Secondary">Secondary</option>
                  <option value="Special Education">Special Education</option>
                  <option value="Extracurricular">Extracurricular</option>
                </>
              ) : (
                <>
                  <option value="General Service">General Service</option>
                  <option value="Technology">Technology</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Finance">Finance</option>
                  <option value="Retail">Retail</option>
                  <option value="Consulting">Consulting</option>
                </>
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isSchool ? "Annual Fee (₦)" : "Price (₦)"} *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400">₦</span>
              </div>
              <input
                type="number"
                placeholder="0.00 ₦"
                value={newService.price}
                onChange={(e) => updateService(newService.id, 'price', e.target.value)}
                className={`w-full pl-10 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors
                  ${formErrors.price ? 'border-red-500' : 'border-gray-300'}`}
              />
            </div>
            {formErrors.price && (
              <p className="text-red-500 text-xs mt-1">{formErrors.price}</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              placeholder={isSchool ? "Describe the curriculum and what's included" : "Describe what this service includes"}
              value={newService.description}
              onChange={(e) => updateService(newService.id, 'description', e.target.value)}
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
            />
          </div>

          {isSchool && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration
              </label>
              <select
                value={newService.duration}
                onChange={(e) => updateService(newService.id, 'duration', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="Annual">Annual</option>
                <option value="Semester">Semester</option>
                <option value="Term">Term</option>
                <option value="Monthly">Monthly</option>
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
        <button
          onClick={() => setActiveService(null)}
          className="px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          Cancel
        </button>
        <button
          onClick={addService}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          {activeService === newService.id ? `Update ${serviceLabel}` : `Add ${serviceLabel}`}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#e5e5e5] p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center py-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            {isSchool ? (
              <div className="p-3 bg-blue-100 rounded-full">
                <GraduationCap className="h-8 w-8 text-blue-600" />
              </div>
            ) : (
              <div className="p-3 bg-green-100 rounded-full">
                <Building2 className="h-8 w-8 text-green-600" />
              </div>
            )}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              {isSchool ? "School" : "Business"} Profile Setup
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Create your professional {portfolioType} profile and get listed on Instant Payments
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-lg mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("info")}
              className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 text-sm font-medium transition-colors relative
                ${activeTab === "info" 
                  ? "text-blue-600 bg-blue-50 border-b-2 border-blue-600" 
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}
            >
              <Building2 className="h-5 w-5" />
              <span className="hidden sm:inline">Information</span>
            </button>
            
            <button
              onClick={() => setActiveTab("services")}
              className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 text-sm font-medium transition-colors relative
                ${activeTab === "services" 
                  ? "text-blue-600 bg-blue-50 border-b-2 border-blue-600" 
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}
            >
              <BookOpen className="h-5 w-5" />
              <span className="hidden sm:inline">{serviceLabelPlural}</span>
              {services.length > 0 && (
                <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                  {services.length}
                </span>
              )}
            </button>
            
            <button
              onClick={() => setActiveTab("notifications")}
              className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 text-sm font-medium transition-colors relative
                ${activeTab === "notifications" 
                  ? "text-blue-600 bg-blue-50 border-b-2 border-blue-600" 
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}
            >
              <Bell className="h-5 w-5" />
              <span className="hidden sm:inline">Notifications</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Business/School Information Section */}
          {activeTab === "info" && (
            <div className="bg-white rounded-lg shadow-lg p-6 animate-fadeIn">
              <div className="flex items-center gap-3 mb-6">
                {isSchool ? (
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <GraduationCap className="h-6 w-6 text-blue-600" />
                  </div>
                ) : (
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Building2 className="h-6 w-6 text-green-600" />
                  </div>
                )}
                <h2 className="text-2xl font-bold text-gray-900">
                  {isSchool ? "School" : "Business"} Information
                </h2>
              </div>

              {/* Banner Upload */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-3">Banner Image</label>
                <div className="relative">
                  <div className={`w-full h-48 border-2 border-dashed rounded-xl flex items-center justify-center overflow-hidden transition-all
                    ${businessInfo.bannerPreview ? 'border-transparent' : 'border-gray-300 hover:border-blue-400'}`}>
                    {businessInfo.bannerPreview ? (
                      <img
                        src={businessInfo.bannerPreview}
                        alt="Banner preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center">
                        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500">Click to upload banner image (1200x400 recommended)</p>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all flex items-center justify-center">
                      {businessInfo.bannerPreview && (
                        <div className="opacity-0 hover:opacity-100 p-3 bg-white rounded-full shadow-lg transition-opacity">
                          <Edit3 className="h-5 w-5 text-blue-600" />
                        </div>
                      )}
                    </div>
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
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Logo Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Logo</label>
                  <div className="relative">
                    <div className={`w-32 h-32 border-2 border-dashed rounded-xl flex items-center justify-center overflow-hidden transition-all
                      ${businessInfo.logoPreview ? 'border-transparent' : 'border-gray-300 hover:border-blue-400'}`}>
                      {businessInfo.logoPreview ? (
                        <img
                          src={businessInfo.logoPreview}
                          alt="Logo preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Upload className="h-8 w-8 text-gray-400" />
                      )}
                      <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all flex items-center justify-center">
                        {businessInfo.logoPreview && (
                          <div className="opacity-0 hover:opacity-100 p-2 bg-white rounded-full shadow-lg transition-opacity">
                            <Edit3 className="h-4 w-4 text-blue-600" />
                          </div>
                        )}
                      </div>
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
                <div className="lg:col-span-3 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
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
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors
                          ${formErrors.businessName ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {formErrors.businessName && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.businessName}</p>
                      )}
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Mail className="h-4 w-4" />
                        Email Address *
                      </label>
                      <input
                        type="email"
                        placeholder="your@email.com"
                        value={businessInfo.email}
                        onChange={(e) => setBusinessInfo(prev => ({ ...prev, email: e.target.value }))}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors
                          ${formErrors.email ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {formErrors.email && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Phone className="h-4 w-4" />
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        placeholder="+234 0703456789"
                        value={businessInfo.phone}
                        onChange={(e) => setBusinessInfo(prev => ({ ...prev, phone: e.target.value }))}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors
                          ${formErrors.phone ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {formErrors.phone && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>
                      )}
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Globe className="h-4 w-4" />
                        Website (Optional)
                      </label>
                      <input
                        type="url"
                        placeholder="https://yourwebsite.com"
                        value={businessInfo.website}
                        onChange={(e) => setBusinessInfo(prev => ({ ...prev, website: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="h-4 w-4" />
                      Address
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your address"
                      value={businessInfo.address}
                      onChange={(e) => setBusinessInfo(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      placeholder={`Describe your ${portfolioType} and what you offer`}
                      value={businessInfo.description}
                      onChange={(e) => setBusinessInfo(prev => ({ ...prev, description: e.target.value }))}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end mt-8 pt-6 border-t border-gray-200"></div>
            </div>
          )}

          {/* Services Section - Enhanced */}
          {activeTab === "services" && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-lg p-6 animate-fadeIn">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <BookOpen className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {isSchool ? "Classes & Programs" : "Services Offered"}
                      </h2>
                      <p className="text-gray-600">
                        {services.length === 0 
                          ? `Add your first ${serviceLabel.toLowerCase()} to get started` 
                          : `You have ${services.length} ${services.length === 1 ? serviceLabel.toLowerCase() : serviceLabelPlural.toLowerCase()} configured`}
                      </p>
                    </div>
                  </div>
                </div>
                
                {services.length === 0 && formErrors.services && (
                  <div className="flex items-center p-4 mb-6 text-amber-800 bg-amber-100 rounded-lg">
                    <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
                    <span>{formErrors.services}</span>
                  </div>
                )}
                
                {/* Service Creation Wizard */}
                <ServiceCreationWizard />
                
                {/* Existing Services List */}
                {services.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Your {serviceLabelPlural}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {services.map((service) => (
                        <div 
                          key={service.id} 
                          className="group relative p-5 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all duration-200"
                        >
                          <div className="absolute top-3 right-3 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => editService(service)}
                              className="p-1.5 text-gray-500 hover:text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => removeService(service.id)}
                              className="p-1.5 text-gray-500 hover:text-red-600 rounded-md hover:bg-red-100 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          
                          <div className="flex items-start mb-4">
                            <div className={`p-2 rounded-lg mr-3 
                              ${isSchool ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                              {isSchool ? <GraduationCap className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900 truncate">{service.name}</h4>
                              <p className="text-sm text-gray-500 truncate">{service.category}</p>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                            {service.description || "No description provided"}
                          </p>
                          
                          <div className="flex justify-between items-center">
                            <div className="flex items-center text-green-600 font-semibold">
                              <span className="mr-1">₦</span>
                              <span>{service.price}</span>
                            </div>
                            {isSchool && service.duration && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {service.duration}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between"></div>
            </div>
          )}

          {/* Email Notification Settings */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-lg p-6 animate-fadeIn">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Bell className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Notification Settings</h2>
                    <p className="text-gray-600">Configure how you want to receive notifications</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Bell className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-blue-900">Email Notifications</h3>
                        <p className="text-sm text-blue-700 mt-1">
                          Receive important updates about payments, bookings, and account activity
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900">Payment Notifications</h3>
                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                          <span className="ml-3 text-sm text-gray-700">Instant payment received</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                          <span className="ml-3 text-sm text-gray-700">Payment reminders</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                          <span className="ml-3 text-sm text-gray-700">Weekly payment summary</span>
                        </label>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900">Booking Notifications</h3>
                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                          <span className="ml-3 text-sm text-gray-700">New bookings</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                          <span className="ml-3 text-sm text-gray-700">Booking cancellations</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                          <span className="ml-3 text-sm text-gray-700">Booking reminders</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Email Preferences</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Primary Email</label>
                        <input
                          type="email"
                          value={businessInfo.email}
                          readOnly
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Email (Optional)</label>
                        <input
                          type="email"
                          placeholder="secondary@email.com"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={handleSubmit}
                  className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <Save className="h-5 w-5" />
                  Update {isSchool ? "School" : "Business"} Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Add some CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default PortfolioSetupForm;