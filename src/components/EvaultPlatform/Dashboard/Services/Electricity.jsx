import React, { useState } from "react";
import clsx from "clsx";
import { PlugZap, ArrowLeft } from "lucide-react";
import PaymentPopup from "./PaymentPopup"; // Import PaymentPopup

// icon imports
import yedc from "../../assets/power/yedc.jpeg";
import phcn from "../../assets/power/phcn.jpeg";
import kedco from "../../assets/power/kedco.png";
import aedc from "../../assets/power/aedc.png";

// banner imports
import yedcBanner from "../../assets/power/banner/yedcBanner.jpeg";
import phcnBanner from "../../assets/power/banner/phcnBanner.jpeg";
import kedcoBanner from "../../assets/power/banner/kedcoBanner.png";
import aedcBanner from "../../assets/power/banner/aedcBanner.png";

const services = [
  { title: "YEDC", description: "Yola Electricity Distribution Company", icon: yedc, image: yedcBanner },
  { title: "PHCN", description: "Power Holding Company of Nigeria", icon: phcn, image: phcnBanner },
  { title: "KEDCO", description: "Kaduna Electricity Distribution Company", icon: kedco, image: kedcoBanner },
  { title: "AEDC", description: "Abuja Electricity Distribution Company", icon: aedc, image: aedcBanner },
];

const Electricity = ({ onBack }) => {
  const [selectedService, setSelectedService] = useState(null);
  const [meterId, setMeterId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleServiceClick = (service) => {
    setSelectedService(service);
  };

  const handleBackClick = () => {
    if (selectedService) setSelectedService(null);
    else onBack();
    setMeterId("");
    setPhoneNumber("");
    setEmail("");
    setAmount("");
  };

  const handleProceed = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsDialogOpen(true); // Open the payment popup
    }, 5000);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Electricity</h1>
      <button
        className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md p-1 mb-4"
        aria-label="Go back"
        onClick={handleBackClick}
      >
        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        <span>{selectedService ? "Back" : "Go to Dashboard"}</span>
      </button>

      {!selectedService ? (
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md">
          <h3 className="text-lg sm:text-xl font-bold mb-4">Please choose your Service provider</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                className="flex flex-col items-center p-3 sm:p-4 border rounded-md hover:shadow-lg transition-transform duration-500 cursor-pointer"
                onClick={() => handleServiceClick(service)}
              >
                <img src={service.icon} alt={`${service.title} logo`} className="w-8 h-8 sm:w-12 sm:h-12 mb-2" />
                <h4 className="text-base sm:text-lg font-bold text-center">{service.title}</h4>
                <p className="text-gray-600 text-xs sm:text-sm text-center">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 min-h-[400px] sm:min-h-[500px]">
          <div
            className="flex flex-col items-center rounded-lg justify-center bg-cover bg-center text-white h-48 sm:h-auto"
            style={{
              backgroundImage: `url(${selectedService.image})`,
            }}
          >
            <h3 className="text-xl sm:text-2xl font-bold mb-4 bg-black bg-opacity-50 p-2 rounded-md">
              {selectedService.title}
            </h3>
          </div>

          <div className="flex flex-col justify-center space-y-4 sm:space-y-6 p-4">
            <h3 className="text-lg sm:text-xl font-bold">Enter your details</h3>

            {/* Form Fields */}
            {[
              { label: "Meter ID", value: meterId, setter: setMeterId },
              { label: "Phone Number", value: phoneNumber, setter: setPhoneNumber, type: "tel" },
              { label: "Email (optional)", value: email, setter: setEmail, type: "email" },
              { label: "Amount", value: amount, setter: setAmount, type: "text" }
            ].map((field) => (
              <div key={field.label}>
                <label className="block text-sm font-medium mb-1">{field.label}</label>
                <input
                  type={field.type || "text"}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  value={field.value}
                  onChange={(e) => {
                    if (field.type === "tel") {
                      field.setter(e.target.value.replace(/\D/g, "").slice(0, 11));
                    } else {
                      field.setter(e.target.value);
                    }
                  }}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {field.type === "tel" && field.value.length > 0 && field.value.length !== 11 && (
                  <p className="text-red-500 text-xs mt-1">Phone number must be 11 digits.</p>
                )}
              </div>
            ))}

            <button
              onClick={handleProceed}
              disabled={!meterId || phoneNumber.length !== 11 || !amount || loading}
              className={clsx(
                "mt-4 sm:mt-6 px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-white font-bold text-sm transition duration-300 w-full sm:w-auto",
                meterId && phoneNumber.length === 11 && amount && !loading
                  ? "bg-blue-500 hover:bg-blue-600 active:bg-blue-700"
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
      )}

      {/* Payment Popup */}
      <PaymentPopup
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        serviceDetails={{
          service: selectedService?.title || "",
          plan: amount,
          mobile: phoneNumber,
          email: email,
          meterId: meterId,
        }}
      />
    </div>
  );
};

export default Electricity;
