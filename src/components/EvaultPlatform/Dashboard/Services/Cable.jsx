import React, { useState } from "react";
import { ArrowLeft, HelpCircle } from "lucide-react";
import clsx from "clsx";
import PaymentPopup from "./PaymentPopup";
import HelpDialog from './SchoolFees/HelpDialog'; // Fix the import path

//cable tv subscription  banner imports

import dstv from "../../assets/tv/dstv.jpg";
import gotv from "../../assets/tv/gotv.jpg";
import startimes from "../../assets/tv/startimes.jpg";
import multichoice from "../../assets/tv/multichoice.jpg";

const Cable = ({ onBack }) => {
  const [streamingService, setStreamingService] = useState("");
  const [subscriptionPlan, setSubscriptionPlan] = useState("");
  const [email, setEmail] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false); // Replace isHelpDialogOpen with isHelpOpen

  const serviceImages = {
    GOtv: gotv,
    StarTimes: startimes,
    DSTV: dstv,
    MultiChoice: multichoice,
    "Amazon Prime": "https://picsum.photos/600/800?random=5",
  };

  const bannerImage = "https://picsum.photos/1200/400?random=6";

  const validateForm = () => {
    const newErrors = {};
    if (!streamingService) newErrors.streamingService = "Please select a streaming service.";
    if (!subscriptionPlan) newErrors.subscriptionPlan = "Please select a subscription plan.";
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Please enter a valid email address.";
    return newErrors;
  };

  const handleProceed = () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setErrors({});
    setIsDialogOpen(true); // Open the payment popup
  };

  const handleBackClick = () => {
    onBack(); // Trigger navigation back to the dashboard
  };

  const handleDialogClose = (e) => {
    e.preventDefault();
    setIsDialogOpen(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      {/* Back Button */}
      <button
        className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md p-1 mb-4"
        aria-label="Back to Dashboard"
        onClick={handleBackClick}
      >
        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        <span>Back to Dashboard</span>
      </button>

      {/* Main Content */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div
          className="w-full h-40 sm:h-56 bg-cover bg-center"
          style={{ backgroundImage: `url(${bannerImage})` }}
        />

        <div className="flex flex-col lg:flex-row">
          {/* Service Image Section */}
          <div className="w-full lg:w-1/2 p-4 sm:p-8 bg-gray-100">
            <div className="h-48 sm:h-64 flex items-center justify-center">
              {streamingService ? (
                <img
                  src={serviceImages[streamingService]}
                  alt={streamingService}
                  className="max-h-full w-auto rounded-xl shadow-lg"
                />
              ) : (
                <p className="text-gray-600 text-center text-sm sm:text-base">
                  Select a streaming service to see its image.
                </p>
              )}
            </div>
          </div>

          {/* Form Section */}
          <div className="w-full lg:w-1/2 p-4 sm:p-8">
            <div className="max-w-xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-blue-700 text-center">
                Subscribe Now
              </h2>
              
              <div className="space-y-4">
                {/* Form Fields */}
                <div>
                  <label className="block text-sm font-medium mb-1">Streaming Service</label>
                  <select
                    value={streamingService}
                    onChange={(e) => setStreamingService(e.target.value)}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a service</option>
                    {Object.keys(serviceImages).map((service) => (
                      <option key={service} value={service}>{service}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Subscription Plan</label>
                  <select
                    value={subscriptionPlan}
                    onChange={(e) => setSubscriptionPlan(e.target.value)}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a plan</option>
                    {["Basic - $9.99", "Standard - $13.99", "Premium - $17.99"].map((plan) => (
                      <option key={plan} value={plan}>{plan}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
  onClick={handleProceed}
  disabled={!streamingService || !subscriptionPlan || !email || loading}
  className={clsx(
    "mt-4 sm:mt-6 px-4 sm:px-6 py-2 sm:py-3 rounded-md text-white font-bold text-sm transition duration-500 w-full sm:w-auto",
    streamingService && subscriptionPlan && email && !loading
      ? "bg-blue-500 hover:bg-blue-600"
      : "bg-gray-300 cursor-not-allowed"
  )}
>
  {loading ? (
    <div className="flex items-center justify-center space-x-2">
      <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4 sm:w-5 sm:h-5"></span>
      <span>Processing...</span>
    </div>
  ) : (
    "Proceed"
  )}
</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Popup Dialogue */}
      <PaymentPopup
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        serviceDetails={{
          streamingService: streamingService, // Ensure key name matches PaymentPopup
          plan: subscriptionPlan, // Ensure key name matches PaymentPopup
          email: email,
          amount: price, // Keep consistency with other fields
        }}
      />

      {/* Fixed Help Button */}
      <button
        onClick={() => setIsHelpOpen(true)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-white text-blue-500 w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-50 active:bg-blue-100 transition-colors border-2 border-blue-500 z-40"
        aria-label="Get Help"
      >
        <HelpCircle className="w-6 h-6 sm:w-7 sm:h-7" />
      </button>

      {/* Help Dialog */}
      <HelpDialog 
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  );
};

export default Cable;
