import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Portal from "./Portal";

const VirtualCardRequest = ({ onClose, addCard }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cardType: "Visa",
    spendingLimit: "",
    expirationDate: "1 month",
  });

  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.spendingLimit) {
      alert("Please fill out all required fields.");
      return;
    }

    const newCard = {
      name: formData.cardType,
      balance: `₦${Number(formData.spendingLimit).toFixed(2)}`,
      cardNumber: "**** **** **** " + Math.floor(1000 + Math.random() * 9000),
      expiry: "12/" + (new Date().getFullYear() + 3).toString().substr(-2),
      cardholder: formData.name,
    };

    setSuccess(true);

    // Add the new card immediately
    addCard(newCard);
    
    // Close modal after success message
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <Portal>
      <motion.div
        className="fixed inset-0 bg-black/50 flex items-start justify-center z-[9999] overflow-y-auto pt-20 pb-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 relative"
          initial={{ scale: 0.8, opacity: 0, y: -20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: -20 }}
        >
          {/* Header */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-blue-600">Request a Virtual Card</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          {success ? (
            <div className="text-center">
              <h3 className="text-lg font-semibold text-green-600">Success!</h3>
              <p className="text-gray-600 mt-2">Your virtual card has been successfully created.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* User Information */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>

              {/* Card Details */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Card Type</label>
                <select
                  name="cardType"
                  value={formData.cardType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option>Visa</option>
                  <option>MasterCard</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Spending Limit (₦)</label>
                <input
                  type="number"
                  name="spendingLimit"
                  value={formData.spendingLimit}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiration Date</label>
                <select
                  name="expirationDate"
                  value={formData.expirationDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option>1 month</option>
                  <option>3 months</option>
                  <option>6 months</option>
                </select>
              </div>

              {/* Security Features */}
              <div className="mb-4">
                <p className="text-sm text-gray-600">CVV will be generated for secure transactions.</p>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  Note: This virtual card can only be used for online purchases.
                </p>
              </div>

              {/* Confirmation */}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Request Card
              </button>
            </form>
          )}
        </motion.div>
      </motion.div>
    </Portal>
  );
};

export default VirtualCardRequest;
