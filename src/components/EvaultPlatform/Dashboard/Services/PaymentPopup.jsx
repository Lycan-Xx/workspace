import { useState } from "react";
import clsx from "clsx";

const PaymentPopup = ({ isOpen, onClose, serviceDetails }) => {
  const [paymentMethod, setPaymentMethod] = useState("wallet");
  const [otp, setOtp] = useState(Array(6).fill(""));

  const handleOtpChange = (index, value) => {
    if (/^\d*$/.test(value) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      // Auto-focus next input
      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text/plain").slice(0, 6);
    const newOtp = [...otp];
    pasteData.split("").forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });
    setOtp(newOtp);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#025798]">Payment Checkout</h2>
          <button
            onClick={onClose}
            className="text-red-500 hover:text-red-700"
          >
            Close
          </button>
        </div>

        {/* Summary Section */}
        <div className="border-b mb-4">
          <div className="grid grid-cols-2 gap-2 text-sm font-semibold text-gray-700">
            <div>Service:</div>
            <div>{serviceDetails.service || "N/A"}</div>
            <div>Plan:</div>
            <div>{serviceDetails.plan || "N/A"}</div>
            <div>Email:</div>
            <div>{serviceDetails.email || "N/A"}</div>
          </div>
        </div>

        {/* Tab Interface */}
        <div>
          <div className="flex border-b">
            <button
              className={`w-1/3 py-2 ${paymentMethod === "wallet" ? "border-b-4 border-blue-600 text-blue-600" : "text-gray-600"}`}
              onClick={() => setPaymentMethod("wallet")}
            >
              Wallet
            </button>
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
          </div>

          {/* Tab Content */}
          <div className="mt-4">
            {paymentMethod === "wallet" && (
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Pay from Wallet</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Enter your 6-digit PIN to confirm payment
                </p>
                
                <div className="flex justify-center space-x-2 mb-6">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onPaste={handlePaste}
                      className="w-10 h-10 text-center border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                      autoFocus={index === 0}
                    />
                  ))}
                </div>

                <button
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 font-semibold"
                  onClick={() => console.log("Confirming payment with PIN")}
                >
                  Confirm Payment
                </button>
              </div>
            )}

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
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPopup;