"use client"

import { useState } from "react"
import OnboardingFlow from "./OnboardingFlow"
import BusinessProfileSetup from "./BusinessProfileSetup"

const Portfolio = () => {
  const [portfolioType, setPortfolioType] = useState(null)
  const [showOnboarding, setShowOnboarding] = useState(true)

  const handlePortfolioTypeSelect = (type) => {
    setPortfolioType(type)
    setShowOnboarding(false)
  }

  const handleBackToOnboarding = () => {
    setShowOnboarding(true)
    setPortfolioType(null)
  }

  if (showOnboarding) {
    return <OnboardingFlow onSelectPortfolioType={handlePortfolioTypeSelect} />
  }

  return (
    <div>
      {/* Back to onboarding button */}
      <div className="p-4">
        <button
          onClick={handleBackToOnboarding}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
        >
          ← Back to Template Selection
        </button>
      </div>

      <BusinessProfileSetup portfolioType={portfolioType} />
    </div>
  )
}

export default Portfolio
