"use client"

import { useState } from "react"
import { ArrowLeft, MapPin, Phone, Mail, DollarSign, CreditCard, Banknote, CheckCircle } from "lucide-react"
import SchoolPaymentForm from "./SchoolPaymentForm"
import BusinessPaymentForm from "./BusinessPaymentForm"

const BusinessDetails = ({ business, onBack }) => {
  const [selectedService, setSelectedService] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleServiceSelect = (service) => {
    setSelectedService(service)
  }

  const handlePaymentSubmit = async (paymentData) => {
    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      alert(`Payment of $${paymentData.amount} processed successfully!`)
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Businesses
        </button>

        {/* Business Header */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="relative">
            {/* Banner */}
            <div className="h-64 bg-gradient-to-r from-blue-500 to-purple-600 overflow-hidden">
              {business.bannerImage ? (
                <img
                  src={business.bannerImage || "/placeholder.svg"}
                  alt={`${business.businessName} banner`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white text-4xl font-bold">{business.businessName.charAt(0)}</span>
                </div>
              )}
            </div>

            {/* Logo */}
            <div className="absolute -bottom-12 left-8">
              <div className="w-24 h-24 rounded-xl border-4 border-white overflow-hidden shadow-lg bg-white">
                {business.logoImage ? (
                  <img
                    src={business.logoImage || "/placeholder.svg"}
                    alt={`${business.businessName} logo`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-600 text-xl font-bold">{business.businessName.charAt(0)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-16 pb-6 px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Business Info */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{business.businessName}</h1>
                  <p className="text-gray-600 text-lg">{business.description}</p>
                </div>

                {/* Contact Info */}
                <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{business.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{business.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>Available Online</span>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-700">Accepts:</span>
                  {business.paymentOptions.bankTransfer && (
                    <span className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md border">
                      <Banknote className="w-3 h-3" />
                      Bank Transfer
                    </span>
                  )}
                  {business.paymentOptions.creditCard && (
                    <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-md border">
                      <CreditCard className="w-3 h-3" />
                      Credit Card
                    </span>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{business.services.length}</div>
                    <div className="text-sm text-gray-600">Services Available</div>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      ${Math.min(...business.services.map((s) => s.price))}+
                    </div>
                    <div className="text-sm text-gray-600">Starting Price</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Services List */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-2">Available Services</h2>
            <p className="text-gray-600 mb-6">Select a service to proceed with payment</p>

            <div className="space-y-4">
              {business.services.map((service) => (
                <div
                  key={service.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedService?.id === service.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => handleServiceSelect(service)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{service.name}</h3>
                    <div className="flex items-center gap-1 text-green-600 font-bold">
                      <DollarSign className="w-4 h-4" />
                      <span>${service.price}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{service.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      {service.category && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md">{service.category}</span>
                      )}
                    </div>
                    {selectedService?.id === service.id && <CheckCircle className="w-5 h-5 text-blue-500" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dynamic Payment Form */}
          {business.portfolioType === "school" ? (
            <SchoolPaymentForm business={business} onPaymentSubmit={handlePaymentSubmit} isProcessing={isProcessing} />
          ) : (
            <BusinessPaymentForm
              business={business}
              onPaymentSubmit={handlePaymentSubmit}
              isProcessing={isProcessing}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default BusinessDetails
