import React, { useState, useEffect } from "react";
import { ArrowLeft, CheckCircle2, Loader2, XCircle } from "lucide-react";
import clsx from "clsx";
import { useSelector } from 'react-redux';

const TransferForm = ({ onBack }) => {
  // State for bank selection, account number, verified customer, amount, and loading/errors
  const [bank, setBank] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [verifiedCustomer, setVerifiedCustomer] = useState(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [transferLoading, setTransferLoading] = useState(false);
  const [error, setError] = useState("");
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [pin, setPin] = useState(Array(6).fill("")); // PIN input state
  const user = useSelector((state) => state.auth.user); // Get user from Redux state

  // Mapping bank names to banner image URLs (using Picsum images)
  const bankBanners = {
    "Access Bank": "https://picsum.photos/600/100?random=1",
    "First Bank of Nigeria": "https://picsum.photos/600/100?random=2",
    "Guaranty Trust Bank": "https://picsum.photos/600/100?random=3",
    "Zenith Bank": "https://picsum.photos/600/100?random=4",
    "United Bank for Africa": "https://picsum.photos/600/100?random=5",
  };

  // List of popular banks in Nigeria
  const popularBanks = [
    "Access Bank",
    "First Bank of Nigeria",
    "Guaranty Trust Bank",
    "Zenith Bank",
    "United Bank for Africa",
  ];

  // List of random names for customer verification
  const randomNames = [
    "John Doe",
    "Jane Smith",
    "Alice Johnson",
    "Bob Brown",
    "Charlie Davis",
  ];

  // Handle verification (simulate a 5-second delay)
  const handleVerify = (e) => {
    e.preventDefault();
    setError("");
    // Ensure that bank and account number are provided (account number length should be 10 digits)
    if (!bank || accountNumber.length !== 10) {
      setError("Please select a bank and enter a valid 10-digit account number.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Pick a random customer name as the verified account holder
      const randomName =
        randomNames[Math.floor(Math.random() * randomNames.length)];
      setVerifiedCustomer(randomName);
    }, 5000);
  };

  // Handle transfer after verification
  const handleTransfer = (e) => {
    e.preventDefault();
    setError("");
    // Ensure amount is entered
    if (!amount || Number(amount) <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    setTransferLoading(true);
    setPinModalOpen(true); // Open PIN modal
    setTimeout(() => {
      setTransferLoading(false);
    }, 500);
  };

  const handlePinChange = (index, value) => {
    if (/^\d*$/.test(value) && value.length <= 1) {
      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);
      if (value && index < 5) {
        document.getElementById(`pin-${index + 1}`).focus();
      }
    }
  };

  const handlePinSubmit = (e) => {
    e.preventDefault();
    const enteredPin = pin.join("");
    if (enteredPin === "000000") { // Check if PIN is correct
      alert("Transaction Successful!");
      // Reset all form fields to initial state
      setBank("");
      setAccountNumber("");
      setVerifiedCustomer(null);
      setAmount("");
      setPin(Array(6).fill("")); // Reset PIN
      setPinModalOpen(false); // Close PIN modal
    } else {
      alert("Invalid PIN. Please try again.");
    }
  };

  const PinModal = () => {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
        <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md mx-4">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="bg-blue-100 p-2 rounded-full">
              <CheckCircle2 className="w-6 h-6 text-blue-600" />
            </span>
            Confirm Transfer
          </h3>
          
          <div className="mb-6 grid gap-2 bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-2">
              <span className="text-gray-600">Bank:</span>
              <span className="font-medium">{bank}</span>
              <span className="text-gray-600">Account Number:</span>
              <span className="font-medium">{accountNumber}</span>
              <span className="text-gray-600">Amount:</span>
              <span className="font-medium text-green-600">₦{amount}</span>
              <span className="text-gray-600">Recipient:</span>
              <span className="font-medium">{user?.name || 'Unknown'}</span>
            </div>
          </div>
  
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Enter 6-digit PIN
            </label>
            <div className="flex justify-center gap-2">
              {pin.map((digit, index) => (
                <input
                  key={index}
                  type="password"
                  inputMode="numeric"
                  value={digit}
                  onChange={(e) => handlePinChange(index, e.target.value)}
                  maxLength="1"
                  className="w-12 h-12 border-2 border-gray-300 rounded-lg text-center text-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                  id={`pin-${index}`}
                  autoComplete="off"
                />
              ))}
            </div>
          </div>
  
          <button
            onClick={handlePinSubmit}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200"
          >
            Confirm Transfer
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6">
      <button
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 group mb-8"
        onClick={onBack}
      >
        <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
        <span className="font-medium">Back to Dashboard</span>
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Banner Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 h-32 flex items-center justify-center">
          {bank ? (
            <img
              src={bankBanners[bank]}
              alt={`${bank} banner`}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-white/80 text-lg font-medium">Select a Bank</span>
          )}
        </div>

        <form
          onSubmit={verifiedCustomer ? handleTransfer : handleVerify}
          className="p-6 sm:p-8 space-y-6"
        >
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Transfer Funds</h1>
            <p className="text-gray-500">Securely transfer money to any Nigerian bank</p>
          </div>

          {error && (
            <div className="bg-red-50 p-4 rounded-lg flex items-center gap-3 text-red-700">
              <XCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Bank Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Select Bank
            </label>
            <select
              id="bank"
              value={bank}
              onChange={(e) => {
                setBank(e.target.value);
                setVerifiedCustomer(null);
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            >
              <option value="" disabled>Choose a bank</option>
              {popularBanks.map((bankName) => (
                <option key={bankName} value={bankName}>{bankName}</option>
              ))}
            </select>
          </div>

          {/* Account Number Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Account Number
            </label>
            <div className="relative">
              <input
                id="accountNumber"
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="Enter 10-digit account number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all pr-14"
              />
              {accountNumber.length === 10 && (
                <div className="absolute right-4 top-3.5 text-green-600">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              )}
            </div>
          </div>

          {/* Verified Customer Display */}
          {verifiedCustomer && (
            <div className="bg-green-50 p-4 rounded-lg flex items-center gap-3 text-green-700 border border-green-100">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <div>
                <p className="font-medium">Account Verified</p>
                <p className="text-sm">{verifiedCustomer}</p>
              </div>
            </div>
          )}

          {/* Amount Input */}
          {verifiedCustomer && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-gray-400">₦</span>
                <input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  min="0"
                />
              </div>
            </div>
          )}

          {/* Action Button */}
          <button
            type="submit"
            disabled={
              loading ||
              transferLoading ||
              !bank ||
              !accountNumber ||
              (verifiedCustomer && (!amount || Number(amount) <= 0))
            }
            className={clsx(
              "w-full py-4 rounded-xl font-semibold text-white transition-all",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              verifiedCustomer 
                ? "bg-green-600 hover:bg-green-700"
                : "bg-blue-600 hover:bg-blue-700"
            )}
          >
            {loading || transferLoading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                {loading ? "Verifying..." : "Processing..."}
              </div>
            ) : verifiedCustomer ? (
              "Transfer Now"
            ) : (
              "Verify Account"
            )}
          </button>
        </form>
      </div>

      {pinModalOpen && <PinModal />}
    </div>
  );
};

export default TransferForm;