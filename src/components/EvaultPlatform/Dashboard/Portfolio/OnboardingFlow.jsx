"use client"

import { useState } from "react"
import { GraduationCap, Building2, Users, Briefcase } from "lucide-react"

const OnboardingFlow = ({ onSelectPortfolioType }) => {
  const [selectedType, setSelectedType] = useState(null)

  const portfolioTypes = [
    {
      type: "school",
      title: "Educational Institution",
      description: "Perfect for schools, colleges, universities, and training centers",
      icon: GraduationCap,
      features: [
        "Student fee management",
        "Class-based organization",
        "Academic year tracking",
        "Parent communication tools",
        "Grade-specific services",
      ],
      color: "bg-blue-500",
      examples: ["Elementary School", "High School", "University", "Training Center"],
    },
    {
      type: "business",
      title: "Business & Services",
      description: "Ideal for businesses, freelancers, and service providers",
      icon: Building2,
      features: [
        "Service catalog management",
        "Client payment processing",
        "Invoice generation",
        "Business analytics",
        "Multi-service offerings",
      ],
      color: "bg-green-500",
      examples: ["Consulting Firm", "Healthcare Clinic", "Tech Company", "Freelancer"],
    },
  ]

  const handleContinue = () => {
    if (selectedType) {
      onSelectPortfolioType(selectedType)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to eVault Portfolio</h1>
          <p className="text-xl text-gray-600 mb-2">Let's set up your profile</p>
          <p className="text-lg text-gray-500">Choose the template that best fits your organization</p>
        </div>

        {/* Portfolio Type Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {portfolioTypes.map((portfolio) => {
            const Icon = portfolio.icon
            const isSelected = selectedType === portfolio.type

            return (
              <div
                key={portfolio.type}
                className={`cursor-pointer transition-all duration-300 hover:shadow-xl p-6 rounded-lg border-2 ${
                  isSelected
                    ? "border-blue-500 shadow-xl transform scale-105 bg-white"
                    : "border-gray-200 hover:shadow-lg bg-white hover:border-gray-300"
                }`}
                onClick={() => setSelectedType(portfolio.type)}
              >
                <div className="text-center pb-4">
                  <div
                    className={`w-16 h-16 ${portfolio.color} rounded-full flex items-center justify-center mx-auto mb-4`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">{portfolio.title}</h2>
                  <p className="text-base text-gray-600">{portfolio.description}</p>
                </div>

                <div className="space-y-6">
                  {/* Features */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Key Features
                    </h4>
                    <ul className="space-y-2">
                      {portfolio.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Examples */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      Perfect For
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {portfolio.examples.map((example, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                          {example}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Selection Indicator */}
                  {isSelected && (
                    <div className="flex items-center justify-center pt-4">
                      <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        ✓ Selected
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Continue Button */}
        <div className="flex justify-center pt-8">
          <button
            onClick={handleContinue}
            disabled={!selectedType}
            className={`px-12 py-3 text-lg font-medium rounded-lg transition-all ${
              selectedType
                ? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {selectedType
              ? `Continue with ${selectedType === "school" ? "School" : "Business"} Template`
              : "Select a Template to Continue"}
          </button>
        </div>

        {/* Help Text */}
        <div className="text-center text-sm text-gray-500">
          <p>Don't worry, you can always change this later in your profile settings</p>
        </div>
      </div>
    </div>
  )
}

export default OnboardingFlow
