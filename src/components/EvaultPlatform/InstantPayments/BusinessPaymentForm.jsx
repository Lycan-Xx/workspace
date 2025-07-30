"use client"

import { useState } from "react"
import { Building2, User, Mail, DollarSign, Shield, Package } from "lucide-react"

const BusinessPaymentForm = ({ business, onPaymentSubmit, isProcessing }) => {
  const [selectedService, setSelectedService] = useState(null)
  const [paymentForm, setPaymentForm] = useState({
    payerName: "",
    email: "",
    paymentPurpose: "",
    amount: "",
    companyName: "",
  })

  const handleServiceSelect = (serviceId) => {
    const service = business.services.find((s) => s.id === serviceId)
    if (service) {
      setSelectedService(service)
      setPaymentForm((prev) => ({
        ...prev,
        paymentPurpose: service.name,
        amount: service.price.toString(),
      }))
    }
  }

  const handleSubmit = async () => {
    if (!paymentForm.payerName || !paymentForm.email || !selectedService) {
      alert("Please fill in all required fields and select a service.")
      return
    }

    const transactionId = `INV_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const paymentData = {
      ...paymentForm,
      selectedService,
      businessId: business.id,
      paymentType: "business",
      transactionId,
    }

    onPaymentSubmit(paymentData)
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Building2 className="h-5 w-5 text-green-600" />
        <h2 className="text-xl font-bold">Business Payment Details</h2>
      </div>
      <p className="text-gray-600 mb-6">Select a service and complete your payment information</p>

      <div className="space-y-6">
        {/* Selected Service Summary */}
        {selectedService && (
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-semibold text-green-900">{selectedService.name}</h4>
                <p className="text-sm text-green-700">{selectedService.description}</p>
                {selectedService.category && (
                  <span className="inline-block mt-2 px-2 py-1 bg-white text-green-800 text-xs rounded-md border">
                    {selectedService.category}
                  </span>
                )}
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-green-600">${selectedService.price}</div>
                {selectedService.duration && <div className="text-sm text-gray-500">{selectedService.duration}</div>}
              </div>
            </div>
          </div>
        )}

        {/* Service Selection */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium">
            <Package className="h-4 w-4" />
            Select Service *
          </label>
          <select
            onChange={(e) => handleServiceSelect(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">Choose the service you want to pay for</option>
            {business.services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name} - ${service.price} {service.category && `(${service.category})`}
              </option>
            ))}
          </select>
        </div>

        {/* Payer Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium">
              <User className="h-4 w-4" />
              Payer's Full Name *
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={paymentForm.payerName}
              onChange={(e) => setPaymentForm((prev) => ({ ...prev, payerName: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
              value={paymentForm.email}
              onChange={(e) => setPaymentForm((prev) => ({ ...prev, email: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>

        {/* Company Name (Optional) */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Company Name (Optional)</label>
          <input
            type="text"
            placeholder="Your company or organization name"
            value={paymentForm.companyName}
            onChange={(e) => setPaymentForm((prev) => ({ ...prev, companyName: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        {/* Payment Amount */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium">
            <DollarSign className="h-4 w-4" />
            Payment Amount *
          </label>
          <input
            type="number"
            placeholder="0.00"
            value={paymentForm.amount}
            onChange={(e) => setPaymentForm((prev) => ({ ...prev, amount: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        {/* Security Notice */}
        <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
          <Shield className="w-5 h-5 text-green-600" />
          <span className="text-sm text-green-700">Your payment is secured with 256-bit SSL encryption</span>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={isProcessing || !selectedService}
          className={`w-full h-12 text-lg font-medium rounded-lg transition-all ${
            isProcessing || !selectedService
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-700"
          }`}
        >
          {isProcessing ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing Payment...
            </div>
          ) : (
            `Pay $${paymentForm.amount || selectedService?.price || 0}`
          )}
        </button>
      </div>
    </div>
  )
}

export default BusinessPaymentForm
