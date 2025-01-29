import React from "react";
import clsx from "clsx";

const PaymentSummaryPopup = ({
  selectedSchool,
  classLevel,
  studentName,
  email,
  amount,
  paymentMethod,
  setPaymentMethod,
  setIsPaymentDialogOpen,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-blue-600">Payment Summary</h2>
          <button
            className="text-gray-600 hover:text-red-600 text-xl"
            onClick={() => setIsPaymentDialogOpen(false)}
          >
            &times;
          </button>
        </div>

        {/* Summary Details */}
        <div className="border-b mb-4">
          <div className="grid grid-cols-2 gap-2 text-sm font-bold text-gray-700">
            <div>School:</div>
            <div>{selectedSchool.name}</div>
            <div>Class:</div>
            <div>{classLevel}</div>
            <div>Student:</div>
            <div>{studentName}</div>
            <div>Email:</div>
            <div>{email || "N/A"}</div>
            <div>Amount:</div>
            <div>${amount}</div>
          </div>
        </div>

        {/* Payment Methods Tabs */}
        <div>
          <div className="flex border-b">
            {["card", "transfer", "ussd"].map((method) => (
              <button
                key={method}
                className={clsx(
                  "w-1/3 py-2 text-center",
                  paymentMethod === method
                    ? "border-b-4 border-blue-600 text-blue-600"
                    : "text-gray-600"
                )}
                onClick={() => setPaymentMethod(method)}
              >
                {method === "card" ? "Card" : method === "transfer" ? "Transfer" : "USSD"}
              </button>
            ))}
          </div>

          {/* Payment Method Content */}
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
  );
};

export default PaymentSummaryPopup;
