"use client"

/**
 * PortfolioWizard - Main component for portfolio creation flow
 * Handles switching between onboarding and profile setup screens
 */
import { useState } from "react"
import OnboardingFlow from "./OnboardingFlow"
import PortfolioSetupForm from "./PortfolioSetupForm"
const PortfolioWizard = () => {
  // State management for portfolio flow
  const [portfolioType, setPortfolioType] = useState(null) // 'business' or 'school'
  const [showOnboarding, setShowOnboarding] = useState(true) // Controls which screen to show

  /**
   * Handles portfolio type selection from onboarding
   * @param {string} type - Selected portfolio type ('business' or 'school')
   */
  const handlePortfolioTypeSelect = (type) => {
    setPortfolioType(type)
    setShowOnboarding(false)
  }

  /**
   * Returns user to onboarding screen
   */
  const handleBackToOnboarding = () => {
    setShowOnboarding(true)
    setPortfolioType(null)
  }

  // Render onboarding flow if showOnboarding is true
  if (showOnboarding) {
    return <OnboardingFlow onSelectPortfolioType={handlePortfolioTypeSelect} />
  }

  // Main portfolio setup view
  return (
    <div>
      {/* Navigation back to onboarding */}
      <div className="p-4">
        <button
          onClick={handleBackToOnboarding}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
        >
          ← Back to Template Selection
        </button>
      </div>

      <PortfolioSetupForm portfolioType={portfolioType} />
    </div>
  )
}

export default PortfolioWizard
