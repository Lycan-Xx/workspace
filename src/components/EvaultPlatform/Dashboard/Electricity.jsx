import React, { useState } from "react";
import clsx from "clsx";
import { PlugZap, ArrowLeft } from "lucide-react";

// icon imports
import yedc from "../assets/power/yedc.jpeg";
import phcn from "../assets/power/phcn.jpeg";
import kedco from "../assets/power/kedco.png";
import aedc from "../assets/power/aedc.png";

// banner imports
import yedcBanner from "../assets/power/banner/yedcBanner.jpeg";
import phcnBanner from "../assets/power/banner/phcnBanner.jpeg";
import kedcoBanner from "../assets/power/banner/kedcoBanner.png";
import aedcBanner from "../assets/power/banner/aedcBanner.png";

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
    const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");

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
      setIsDialogOpen(true);
    }, 5000);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Electricity</h1>
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
                className="flex flex-col items-center p-4 border rounded-md hover:shadow-lg transition-transform duration-500 cursor-pointer"
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

          </div>

          <div className="flex flex-col justify-center space-y-6">
            <h3 className="text-xl font-bold">Enter your details</h3>

            <label className="block text-sm font-medium">Enter your Meter ID</label>
            <input
              type="text"
              placeholder="Enter Meter ID"
              value={meterId}
              onChange={(e) => setMeterId(e.target.value)}
              className="border p-2 rounded w-full"
            />

            <label className="block text-sm font-medium">Enter your Phone Number</label>
            <input
              type="text"
              placeholder="Enter Phone Number"
              value={phoneNumber}
              onChange={(e) =>
                setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 11))
              }
              className="border p-2 rounded w-full"
            />
            {phoneNumber.length !== 11 && phoneNumber.length > 0 && (
              <p className="text-red-500 text-sm">Phone number must be 11 digits.</p>
            )}

            <label className="block text-sm font-medium">Enter your Email (optional)</label>
            <input
              type="email"
              placeholder="Enter Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-2 rounded w-full"
            />

            <label className="block text-sm font-medium">Enter Amount</label>
            <input
              type="text"
              placeholder="Enter Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border p-2 rounded w-full"
            />

            <button
              onClick={handleProceed}
              disabled={!meterId || phoneNumber.length !== 11 || !amount}
              className={clsx(
                "mt-6 px-6 py-3 rounded-md text-white font-bold text-sm transition duration-500",
                meterId && phoneNumber.length === 11 && amount
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


			<button
        onClick={() => setIsDialogOpen(!isDialogOpen)}
        className="fixed bottom-6 right-6 bg-blue-500 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-600"
      >
        ?
      </button>
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
      <div className="border-b mb-4">
        <div className="grid grid-cols-2 gap-2 text-sm font-semibold text-gray-700">
          <div>Service:</div>
          <div>{selectedService ? selectedService.title : "N/A"}</div>
          <div>Meter ID:</div>
          <div>{meterId || "N/A"}</div>
          <div>Phone:</div>
          <div>{phoneNumber || "N/A"}</div>
          <div>Amount:</div>
          <div>{amount || "N/A"}</div>
        </div>
      </div>
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
        </div>
      )}
    </div>
  );
};

export default Electricity;
