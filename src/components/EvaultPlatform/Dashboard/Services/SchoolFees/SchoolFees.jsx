import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import clsx from "clsx";
import SchoolSearch from "./SchoolSearch"; // Import the SchoolSearch component
import PaymentPopup from "../PaymentPopup"; // Import PaymentPopup
import { number } from "zod";

const SchoolFees = ({ onBack }) => {
  const [selectedSchool, setSelectedSchool] = useState(null); // Holds the selected school object
  const [studentName, setStudentName] = useState("");
  const [email, setEmail] = useState("");
  const [text, setText] = useState("");
  const [amount, setAmount] = useState("");
  const [classLevel, setClassLevel] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);

  // Reset form and handle back navigation
  const handleBackClick = () => {
    if (selectedSchool) {
      setSelectedSchool(null); // Deselect the school
    } else {
      onBack(); // Navigate back to the Dashboard
    }
    // Reset form data
    setStudentName("");
    setEmail("");
    setMobileNumber("");
    setText("");
    setAmount("");
    setClassLevel("");
  };

  const handleProceed = () => {
    if (!classLevel || !studentName || !amount) return;
    setIsPaymentDialogOpen(true); // Open payment popup
  };

  return (
    <div className="max-w-6xl mx-auto p-6">


      {/* Back Button */}
      <button
        className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md p-1 mb-4"
        aria-label="Go back"
        onClick={handleBackClick}
      >
        <ArrowLeft className="w-5 h-5" />
        <span>{selectedSchool ? "Back" : "Go to Dashboard"}</span>
      </button>

      <div className="grid grid-cols-1 gap-8">
        {/* School Search Component */}
        {!selectedSchool && (
          <SchoolSearch onSelectSchool={(school) => setSelectedSchool(school)} />
        )}

        {/* Selected School Page */}
        {selectedSchool && (
          <div>
            {/* Top Banner Section */}
            <div
            className="w-full h-56 sm:h-64 bg-cover bg-center relative"
            style={{
              backgroundImage: `url('https://picsum.photos/1200/400?random=${selectedSchool.name}')`,
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <h2 className="text-3xl sm:text-4xl text-white font-bold">{selectedSchool.name}</h2>
            </div>

            {/* Profile Picture Positioned to the Right */}
            <div className="absolute -bottom-12 right-4 sm:right-8">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl border-4 border-white overflow-hidden shadow-lg">
                <img
                  src={`https://picsum.photos/100?random=${selectedSchool.name}`}
                  alt={`${selectedSchool.name} Owner`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

			 

			{/* Description */}
			<div className="mb-8">
          <h3 className="text-xl font-bold text-gray-800">About {selectedSchool.name}</h3>
          <p className="mt-2 text-gray-600">{selectedSchool.description}</p>
        </div>

            {/* Payment Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 min-h-[500px]">
              {/* Left Column: Image Section */}
              <div
                className="rounded-lg bg-cover bg-center text-white flex flex-col items-center justify-center h-72 sm:h-96 md:h-full w-13"
                style={{
                  backgroundImage: `url('https://picsum.photos/600/800?random=${selectedSchool.name}')`,
                }}
              >
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 md:mb-4 bg-black bg-opacity-50 p-1 md:p-2 rounded-md">
                  {selectedSchool.name}
                </h3>

				
              </div>

			  

              {/* Payment Form Section */}
              <div className="flex flex-col justify-center space-y-6">
                <h3 className="text-lg sm:text-xl font-bold">Enter Payment Details</h3>

                {/* Class Level Selection */}
                <label className="block text-sm font-medium">Select Class</label>
                <select
                  value={classLevel}
                  onChange={(e) => setClassLevel(e.target.value)}
                  className="border p-2 rounded w-full"
                >
                  <option value="" disabled>
                    Select class
                  </option>
                  {["Class 1", "Class 2", "Class 3", "Class 4"].map((className) => (
                    <option key={className} value={className}>
                      {className}
                    </option>
                  ))}
                </select>

                {/* Student Name Input */}
                <label className="block text-sm font-medium">Student's Name</label>
                <input
                  type="text"
                  placeholder="Enter student's name"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="border p-2 rounded w-full"
                />

                {/* Email Address Input */}
                <label className="block text-sm font-medium">Email Address (Optional)</label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border p-2 rounded w-full"
                />                
				
				{/* Mobile Number Input */}
                <label className="block text-sm font-medium">Phone Number (Optional)</label>
                <input
                  type="text"
                  placeholder="Enter your phone number"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="border p-2 rounded w-full"
                />
                

                {/* Payment Purpose */}
                <label className="block text-sm font-medium">
                  What are you paying for (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Enter the payment info."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="border p-2 rounded w-full"
                />

                {/* Amount Input */}
                <label className="block text-sm font-medium">Amount</label>
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="border p-2 rounded w-full"
                />

                {/* Proceed Button */}
                <button
                  onClick={handleProceed}
                  disabled={!studentName || !classLevel || !amount || loading}
                  className={clsx(
                    "mt-6 px-6 py-3 rounded-md text-white font-bold text-sm transition duration-500",
                    studentName && classLevel && amount
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
          </div>
        )}
      </div>

	  {/* Payment Summary Popup */}
      {isPaymentDialogOpen && (

		<PaymentPopup
		isOpen={isPaymentDialogOpen}
		onClose={() => setIsPaymentDialogOpen(false)}
		serviceDetails={{
			service: selectedSchool ? selectedSchool.name : "",
			class: classLevel,
			mobile: mobileNumber,
			email: email,
			studentName: studentName,
			paymentPurpose: text,
		}}
		/> 
		
      )}

      {/* Help Dialog */}
	  <button
        onClick={() => setIsDialogOpen(!isDialogOpen)}
        className="fixed bottom-6 right-6 bg-blue-500 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-600"
      >
        ?
      </button>
	  {isDialogOpen && (
  <div className="fixed bottom-20 right-6 bg-white shadow-lg rounded-lg p-4 w-64">
    <h3 className="text-lg font-bold mb-2">Contact Us</h3>
    <div className="flex flex-col space-y-2">
      <button
        onClick={() => window.location.href = "mailto:contact@school.com"}
        className="border p-2 rounded-lg bg-white hover:bg-blue-300 transition duration-200 flex items-center space-x-2"
      >
        <span>📧</span>
        <span>Email: contact@school.com</span>
      </button>
      <button
        onClick={() => window.location.href = "tel:+1234567890"}
        className="border p-2 rounded-lg bg-white hover:bg-blue-300 transition duration-200 flex items-center space-x-2"
      >
        <span>📞</span>
        <span>Phone: +1234567890</span>
      </button>
      <button
        onClick={() => window.location.href = "/livechat"}
        className="border p-2 rounded-lg bg-white hover:bg-blue-300 transition duration-200 flex items-center space-x-2"
      >
        <span>💬</span>
        <span>Live Chat</span>
      </button>
    </div>
    <button
      onClick={() => setIsDialogOpen(false)}
      className="mt-4 text-sm text-gray-500 underline"
    >
      Close
    </button>
  </div>
)}


    </div>
  );
};

export default SchoolFees;