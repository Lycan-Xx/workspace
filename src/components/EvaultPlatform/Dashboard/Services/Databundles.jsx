import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import clsx from "clsx";
import PaymentPopup from "./PaymentPopup"; // Import PaymentPopup

// icon imports
import airtel from "../../assets/telecomm/airtel.jpg";
import mtn from "../../assets/telecomm/mtn.png";
import glo from "../../assets/telecomm/glo.png";
import nine from "../../assets/telecomm/nine.jpg";

// banner imports
import airtelBanner from "../../assets/telecomm/banner/airtelBanner.jpg";
import mtnBanner from "../../assets/telecomm/banner/mtnBanner.png";
import gloBanner from "../../assets/telecomm/banner/gloBanner.jpg";
import nineBanner from "../../assets/telecomm/banner/nineBanner.jpg";

// Define the services for data bundles
const services = [
  { title: "9 mobile", description: "9 mobile", icon: nine, image: nineBanner },
  { title: "Airtel", description: "Airtel", icon: airtel, image: airtelBanner },
  { title: "Glo", description: "Glo", icon: glo, image: gloBanner },
  { title: "M T N", description: "M T N", icon: mtn, image: mtnBanner },
];

// Add dataPlans object
const dataPlans = {
  SME: [
    { id: 'sme1', name: '1GB SME Data', price: '300' },
    { id: 'sme2', name: '2GB SME Data', price: '600' },
    { id: 'sme3', name: '5GB SME Data', price: '1500' },
  ],
  Corporate: [
    { id: 'corp1', name: '1GB Corporate Data', price: '400' },
    { id: 'corp2', name: '2GB Corporate Data', price: '800' },
    { id: 'corp3', name: '5GB Corporate Data', price: '2000' },
  ],
  Gifting: [
    { id: 'gift1', name: '1GB Gift Data', price: '350' },
    { id: 'gift2', name: '2GB Gift Data', price: '700' },
    { id: 'gift3', name: '5GB Gift Data', price: '1750' },
  ]
};

const Databundles = ({ onBack }) => {
  const [selectedService, setSelectedService] = useState(null);
  const [mobileNumber, setMobileNumber] = useState("");
  const [planType, setPlanType] = useState("");
  const [dataPlan, setDataPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({});

  // Handle service selection
  const handleServiceClick = (service) => {
    setSelectedService(service);
  };

  // Handle back button click
  const handleBackClick = () => {
    if (selectedService) {
      setSelectedService(null);
      setMobileNumber("");
      setPlanType("");
      setDataPlan("");
    } else {
      onBack();
    }
  };
  

  const handleProceed = () => {
    setIsPaymentDialogOpen(true);
    const selectedPlanDetails = dataPlans[planType].find(plan => plan.id === dataPlan);
    
    setPaymentDetails({
      mobile: mobileNumber,
      plan: selectedPlanDetails.name,
      price: selectedPlanDetails.price,
      service: selectedService.title
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-2 sm:p-6 overflow-hidden"> {/* Modify padding and add overflow control */}
      <h1 className="text-3xl font-bold mb-6">Data Bundles</h1>

      {/* Back Button */}
      <button
        className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md p-1"
        aria-label="Go back"
        onClick={handleBackClick}
      >
        <ArrowLeft className="w-5 h-5" />
        <span>{selectedService ? "Back" : "Go to Dashboard"}</span>
      </button>

      {!selectedService ? (
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-xl font-bold mb-4">Please choose your Service provider</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                className="flex flex-col items-center p-4 border rounded-md hover:shadow-lg cursor-pointer"
                onClick={() => handleServiceClick(service)}
              >
                <img 
                  src={service.icon}
                  alt={service.title}
                  className="w-12 h-12 object-contain mb-2"
                />
                <h4 className="text-lg font-bold">{service.title}</h4>
                <p className="text-gray-600 text-sm">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 min-h-[500px]">
          {/* Left Column: Service Image or Background */}
          <div
            className="flex flex-col items-center rounded-lg justify-center bg-cover bg-center text-white"
            style={{
              backgroundImage: `url(${selectedService.image})`,
            }}
          >
            <h3 className="text-2xl font-bold mb-4 bg-black bg-opacity-50 p-2 rounded-md">
              {selectedService.title}
            </h3>
          </div>

          {/* Right Column: Form for entering details */}
          <div className="flex flex-col justify-center space-y-6">
            <h3 className="text-xl font-bold">Enter your details</h3>

            {/* Mobile Number Input */}
            <label className="block text-sm font-medium">
              Enter your Mobile Number
            </label>
            <input
              type="text"
              placeholder="Enter 11-digit mobile number"
              value={mobileNumber}
              onChange={(e) =>
                setMobileNumber(e.target.value.replace(/\D/g, "").slice(0, 11))
              }
              className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

            {/* Plan Type (Radio Buttons) */}
            <label className="block text-sm font-medium">Select Plan Type</label>
            <div className="flex gap-4">
              {["SME", "Corporate", "Gifting"].map((type) => (
                <button
                  key={type}
                  onClick={() => setPlanType(type)}
                  className={clsx(
                    "px-4 py-2 border rounded-md transition text-sm font-bold duration-500",
                    planType === type
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  )}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Data Plan Dropdown */}
            <label className="block text-sm font-medium mt-4">
              Select Data Plan
            </label>
            <select
              value={dataPlan}
              onChange={(e) => setDataPlan(e.target.value)}
              className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Choose a plan</option>
              {planType && dataPlans[planType]?.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.name} - ₦{plan.price}
                </option>
              ))}
            </select>

            {/* Proceed Button */}
            <button
              onClick={handleProceed}
              disabled={!mobileNumber || !planType || !dataPlan || loading}
              className={clsx(
                "mt-6 px-6 py-3 rounded-md text-white font-bold text-sm transition duration-500",
                mobileNumber && planType && dataPlan && !loading
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-gray-300 cursor-not-allowed"
              )}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
                  <span>Processing...</span>
                </div>
              ) : (
                "Proceed"
              )}
            </button>
          </div>
        </div>
      )}
      {isPaymentDialogOpen && (
        <PaymentPopup
          isOpen={isPaymentDialogOpen}
          onClose={() => setIsPaymentDialogOpen(false)}
          serviceDetails={{
            mobile: mobileNumber,
            plan: dataPlans[planType].find(plan => plan.id === dataPlan)?.name,
            price: dataPlans[planType].find(plan => plan.id === dataPlan)?.price,
            service: selectedService.title
          }}
        />
      )}
    </div>
  );
};

export default Databundles;
