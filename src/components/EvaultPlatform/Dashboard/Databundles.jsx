import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import clsx from "clsx";

// icon imports
import airtel from "../assets/telecomm/airtel.jpg";
import mtn from "../assets/telecomm/mtn.png";
import glo from "../assets/telecomm/glo.png";
import nine from "../assets/telecomm/nine.jpg";

// banner imports
import airtelBanner from "../assets/telecomm/banner/airtelBanner.jpg";
import mtnBanner from "../assets/telecomm/banner/mtnBanner.png";
import gloBanner from "../assets/telecomm/banner/gloBanner.jpg";
import nineBanner from "../assets/telecomm/banner/nineBanner.jpg";

// Define the services for data bundles
const services = [
  { title: "9 mobile", description: "9 mobile", icon: nine, image: nineBanner },
  { title: "Airtel", description: "Airtel", icon: airtel, image: airtelBanner },
  { title: "Glo", description: "Glo", icon: glo, image: gloBanner },
  { title: "M T N", description: "M T N", icon: mtn, image: mtnBanner },
];

const Databundles = ({ onBack }) => {
  const [selectedService, setSelectedService] = useState(null);
  const [mobileNumber, setMobileNumber] = useState("");
  const [planType, setPlanType] = useState("");
  const [dataPlan, setDataPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");

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
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsDialogOpen(true); // Open the payment popup
    }, 3000);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
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
              className="border p-2 rounded w-full"
            />
            {!mobileNumber && (
              <p className="text-red-500 text-sm">Mobile number is required.</p>
            )}

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
            <label className="block text-sm font-medium">Select Data Plan</label>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="border p-2 rounded w-full text-left">
                  {dataPlan || "Select a plan"}
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content className="w-full bg-white shadow rounded mt-2">
                {["1GB", "2GB", "5GB", "10GB"].map((plan) => (
                  <DropdownMenu.Item
                    key={plan}
                    onClick={() => setDataPlan(plan)}
                    className="p-2 hover:bg-gray-100 cursor-pointer dropdown-item"
                  >
                    {plan}
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Root>

            {/* Proceed Button */}
            <button
              onClick={handleProceed}
              disabled={!mobileNumber || !planType || !dataPlan || loading}
              className={clsx(
                "mt-6 px-6 py-3 rounded-md text-white font-bold text-sm transition duration-500",
                mobileNumber && planType && dataPlan
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-gray-300 cursor-not-allowed"
              )}
            >
              {loading ? (
                <span className="animate-pulse">Processing...</span>
              ) : (
                "Proceed"
              )}
            </button>
          </div>
        </div>
      )}

      {/* Payment Popup Dialogue */}
      {isDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#025798]">Payment Checkout</h2>
              <button
                onClick={() => setIsDialogOpen(false)}
                className="text-red-500 hover:text-red-700"
              >
                Close
              </button>
            </div>
            {/* Summary Section */}
            <div className="border-b mb-4">
              <div className="grid grid-cols-2 gap-2 text-sm font-semibold text-gray-700">
                <div>Service:</div>
                <div>{selectedService ? selectedService.title : "N/A"}</div>
                <div>Plan:</div>
                <div>{dataPlan || "N/A"}</div>
                <div>Mobile:</div>
                <div>{mobileNumber || "N/A"}</div>
              </div>
            </div>
            {/* Tab Interface */}
            <div>
              <div className="flex border-b">
                <button
                  className={`w-1/3 py-2 ${paymentMethod === "card" ? "border-b-4 border-blue-600 text-blue-600" : "text-gray-600"}`}
                  onClick={() => setPaymentMethod("card")}
                >
                  Card
                </button>
                <button
                  className={`w-1/3 py-2 ${paymentMethod === "transfer" ? "border-b-4 border-blue-600 text-blue-600" : "text-gray-600"}`}
                  onClick={() => setPaymentMethod("transfer")}
                >
                  Transfer
                </button>
                <button
                  className={`w-1/3 py-2 ${paymentMethod === "ussd" ? "border-b-4 border-blue-600 text-blue-600" : "text-gray-600"}`}
                  onClick={() => setPaymentMethod("ussd")}
                >
                  USSD
                </button>
              </div>

              {/* Tab Content */}
              <div className="mt-4">
                {paymentMethod === "card" && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">Card Payment</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition duration-300"
                          placeholder="Enter Card Number"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition duration-300"
                          placeholder="MM/YY"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition duration-300"
                          placeholder="CVV"
                        />
                      </div>
                    </div>
                    <button
                      className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
                      onClick={() => console.log("Proceed with Card Payment")}
                    >
                      Proceed
                    </button>
                  </div>
                )}

                {paymentMethod === "transfer" && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">Bank Transfer Details</h3>
                    <p className="text-gray-700 text-sm">Account Number: 1234567890</p>
                    <p className="text-gray-700 text-sm">Account Name: John Doe</p>
                    <p className="text-gray-700 text-sm">Bank Name: ABC Bank</p>
                    <button
                      className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
                      onClick={() => console.log("Proceed with Bank Transfer")}
                    >
                      Proceed
                    </button>
                  </div>
                )}

                {paymentMethod === "ussd" && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">USSD Payment</h3>
                    <p className="text-sm text-gray-700">Dial *123*456# to proceed with the payment.</p>
                    <button
                      className="mt-4 px-6 py-2 bg-yellow-600 text-white rounded-lg shadow hover:bg-yellow-700"
                      onClick={() => console.log("Proceed with USSD Payment")}
                    >
                      Proceed
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Databundles;
