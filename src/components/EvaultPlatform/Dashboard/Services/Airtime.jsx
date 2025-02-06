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
  { title: "9 mobile", description: "Recharge airtime", icon: nine, image: nineBanner },
  { title: "Airtel", description: "Recharge airtime", icon: airtel, image: airtelBanner },
  { title: "Glo", description: "Recharge airtime", icon: glo, image: gloBanner },
  { title: "M T N", description: "Recharge airtime", icon: mtn, image: mtnBanner },
];

const Airtime = ({ onBack }) => {
  const [selectedService, setSelectedService] = useState(null);
  const [mobileNumber, setMobileNumber] = useState("");
  const [airtimePackage, setAirtimePackage] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [errors, setErrors] = useState({});

  const airtimePackages = ["₦100", "₦200", "₦500", "₦1000"];

  const handleServiceClick = (service) => {
    setSelectedService(service);
  };

  const handleBackClick = () => {
    if (selectedService) {
      setSelectedService(null);
    } else {
      onBack();
    }
    setMobileNumber("");
    setAirtimePackage("");
    setCustomAmount("");
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

  const handleCustomAmountChange = (e) => {
    const value = e.target.value;
    setCustomAmount(value);
    setAirtimePackage(""); // Deselect airtime package when custom amount is entered
  };

  const validateForm = () => {
    const errors = {};
    if (!mobileNumber) {
      errors.mobileNumber = "Mobile number is required.";
    }
    if (!airtimePackage && !customAmount) {
      errors.airtimePackage = "Airtime package or custom amount is required.";
    }
    return errors;
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-2 sm:p-6 overflow-hidden"> {/* Modify padding and add overflow control */}
      <h1 className="text-3xl font-bold mb-6">Airtime Recharge</h1>

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
          <h3 className="text-xl font-bold mb-4">Please choose your Service Provider</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                className="flex flex-col items-center p-4 border rounded-md hover:shadow-lg cursor-pointer"
                onClick={() => handleServiceClick(service)}
              >
                <img src={service.icon} alt={`${service.title} logo`} className="w-12 h-12" />
                <h4 className="text-lg font-bold">{service.title}</h4>
                <p className="text-gray-600 text-sm">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 min-h-[500px]">
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

          <div className="flex flex-col justify-center space-y-6">
            <h3 className="text-xl font-bold">Recharge Details</h3>

            {/* Mobile Number Input */}
            <label className="block text-sm font-medium">Enter your Mobile Number</label>
            <input
              type="text"
              placeholder="Enter 11-digit mobile number"
              value={mobileNumber}
              onChange={(e) =>
                setMobileNumber(e.target.value.replace(/\D/g, "").slice(0, 11))
              }
              className="border p-2 rounded w-full"
            />
            {errors.mobileNumber && (
              <p className="text-red-500 text-sm">{errors.mobileNumber}</p>
            )}

          {/* Airtime Packages */}
<label className="block text-sm font-medium text-gray-700">Select Airtime Package</label>
<div className="grid grid-cols-2 gap-4 mt-2">
  {airtimePackages.map((pkg) => (
    <button
      key={pkg}
      className={`px-4 py-2 text-lg font-semibold border border-blue-500 rounded-lg 
        transition duration-300 ${
          airtimePackage === pkg && customAmount === ""
            ? "bg-blue-500 text-white"
            : "bg-white text-blue-500 hover:bg-blue-500 hover:text-white"
        }`}
      onClick={() => {
        setAirtimePackage(pkg);
        setCustomAmount(""); // Deselect custom amount when package is selected
      }}
      disabled={customAmount !== ""}
    >
      {pkg}
    </button>
  ))}
</div>

            {/* Custom Amount Input */}
            <label className="block text-sm font-medium">Custom Amount</label>
            <input
              type="text"
              placeholder="Enter custom amount"
              value={customAmount}
              onChange={handleCustomAmountChange}
              className="border p-2 rounded w-full"
            />
            {customAmount && (
              <p className="text-green-500 text-sm">Custom amount: ₦{customAmount}</p>
            )}

            {/* Proceed Button */}
            <button
              onClick={handleProceed}
              disabled={!mobileNumber || (!customAmount && !airtimePackage) || loading}
              className={clsx(
                "mt-6 px-6 py-3 rounded-md text-white font-bold text-sm transition duration-500",
                mobileNumber && (customAmount || airtimePackage) && !loading
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
      <PaymentPopup
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        serviceDetails={{
          service: selectedService ? selectedService.title : "",
          plan: airtimePackage || customAmount,
          mobile: mobileNumber,
          email: "", // Add email if needed
        }}
      />
    </div>
  );
};

export default Airtime;
