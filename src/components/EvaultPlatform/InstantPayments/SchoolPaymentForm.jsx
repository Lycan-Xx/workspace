"use client"

import { useState } from "react"
import { GraduationCap, User, Mail, Phone, BookOpen, DollarSign, Shield } from "lucide-react"

const SchoolPaymentForm = ({ business, onPaymentSubmit, isProcessing }) => {
  const [selectedClass, setSelectedClass] = useState("")
  const [selectedService, setSelectedService] = useState(null)
  const [paymentForm, setPaymentForm] = useState({
    studentName: "",
    parentEmail: "",
    parentPhone: "",
    paymentPurpose: "",
    amount: "",
    additionalNotes: "",
  })

  // Get classes from services (for schools, services represent classes/grades)
  const classes = business.services.filter(
    (service) =>
      service.category === "Education" ||
      service.name.toLowerCase().includes("grade") ||
      service.name.toLowerCase().includes("class"),
  )

  const handleClassSelect = (classId) => {
    const selectedClassService = classes.find((c) => c.id === classId)
    if (selectedClassService) {
      setSelectedClass(classId)
      setSelectedService(selectedClassService)
      setPaymentForm((prev) => ({
        ...prev,
        paymentPurpose: selectedClassService.name,
        amount: selectedClassService.price.toString(),
      }))
    }
  }

  const handleSubmit = async () => {
    if (!paymentForm.studentName || !paymentForm.parentEmail || !selectedService) {
      alert("Please fill in all required fields and select a class/service.")
      return
    }

    const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const paymentData = {
      ...paymentForm,
      selectedService,
      selectedClass,
      businessId: business.id,
      paymentType: "school",
      transactionId,
    }

    onPaymentSubmit(paymentData)
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <GraduationCap className="h-5 w-5 text-blue-600" />
        <h2 className="text-xl font-bold">School Payment Details</h2>
      </div>
      <p className="text-gray-600 mb-6">Complete the student information and select the class or service for payment</p>

      <div className="space-y-6">
        {/* Selected Service Summary */}
        {selectedService && (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-semibold text-blue-900">{selectedService.name}</h4>
                <p className="text-sm text-blue-700">{selectedService.description}</p>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-green-600">${selectedService.price}</div>
                {selectedService.duration && <div className="text-sm text-gray-500">{selectedService.duration}</div>}
              </div>
            </div>
          </div>
        )}

        {/* Class Selection */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium">
            <BookOpen className="h-4 w-4" />
            Select Class/Grade *
          </label>
          <select
            value={selectedClass}
            onChange={(e) => handleClassSelect(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Choose student's class or grade</option>
            {classes.map((classItem) => (
              <option key={classItem.id} value={classItem.id}>
                {classItem.name} - ${classItem.price}
              </option>
            ))}
          </select>
        </div>

        {/* Student Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium">
              <User className="h-4 w-4" />
              Student's Full Name *
            </label>
            <input
              type="text"
              placeholder="Enter student's full name"
              value={paymentForm.studentName}
              onChange={(e) => setPaymentForm((prev) => ({ ...prev, studentName: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium">
              <Mail className="h-4 w-4" />
              Parent/Guardian Email *
            </label>
            <input
              type="email"
              placeholder="parent@example.com"
              value={paymentForm.parentEmail}
              onChange={(e) => setPaymentForm((prev) => ({ ...prev, parentEmail: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium">
            <Phone className="h-4 w-4" />
            Parent/Guardian Phone Number
          </label>
          <input
            type="tel"
            placeholder="+1 (555) 123-4567"
            value={paymentForm.parentPhone}
            onChange={(e) => setPaymentForm((prev) => ({ ...prev, parentPhone: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              : "bg-blue-600 text-white hover:bg-blue-700"
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

export default SchoolPaymentForm
