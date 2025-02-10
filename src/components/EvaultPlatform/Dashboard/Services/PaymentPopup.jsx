import { useState } from "react";

const PaymentPopup = ({ isOpen, onClose, serviceDetails }) => {
  const [otp, setOtp] = useState(Array(6).fill(""));

  const handleOtpChange = (index, value) => {
    if (/^\d*$/.test(value) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
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

  // Dynamic field rendering based on service type
  const renderServiceSpecificFields = () => {
    const fields = [];
    
    // Cable TV Specific
    if (serviceDetails.streamingService) {
      fields.push(
        { label: "Streaming Service", value: serviceDetails.streamingService },
        { label: "Subscription Plan", value: serviceDetails.plan }
      );
    }

    // Airtime/Data Specific
    if (serviceDetails.mobile && !serviceDetails.meterId) {
      fields.push(
        { label: "Mobile Number", value: serviceDetails.mobile },
        { label: "Package", value: serviceDetails.plan },
        { label: "Price", value: `₦${serviceDetails.price}` }
      );
    }

    // Electricity Specific
    if (serviceDetails.meterId) {
      fields.push(
        { label: "Meter ID", value: serviceDetails.meterId },
        { label: "Amount", value: `₦${serviceDetails.plan}` }
      );
    }

    // School Fees Specific
    if (serviceDetails.studentName) {
      fields.push(
        { label: "Student Name", value: serviceDetails.studentName },
        { label: "Class", value: serviceDetails.class },
        { label: "Purpose", value: serviceDetails.paymentPurpose }
      );
    }

    // Common Fields
    if (serviceDetails.email) fields.push({ label: "Email", value: serviceDetails.email });
    if (serviceDetails.amount) fields.push({ label: "Amount", value: `₦${serviceDetails.amount}` });

    return fields.map((field, index) => (
      <div key={index} className="grid grid-cols-3 gap-4 py-2 even:bg-gray-50 px-4 rounded">
        <span className="text-gray-600 font-medium">{field.label}</span>
        <span className="col-span-2 text-gray-800 font-semibold truncate">
          {field.value || "N/A"}
        </span>
      </div>
    ));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-xl shadow-2xl w-[95%] max-w-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-800">Payment Checkout</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Summary Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Transaction Details</h3>
          <div className="border rounded-lg overflow-hidden">
            {renderServiceSpecificFields()}
          </div>
        </div>

        {/* Wallet Payment Section */}
        <div className="mt-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Wallet Payment</h3>
            <p className="text-sm text-gray-600 mb-6">
              Enter your 6-digit security PIN to confirm payment
            </p>
            
            <div className="flex justify-center gap-3 mb-8">
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
                  className="w-12 h-12 text-center text-xl border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  autoFocus={index === 0}
                />
              ))}
            </div>

            <button
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
              onClick={() => console.log("Confirming payment with PIN")}
            >
              Confirm Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPopup;