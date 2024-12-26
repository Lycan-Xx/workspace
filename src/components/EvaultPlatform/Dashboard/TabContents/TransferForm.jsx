import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import clsx from "clsx";

const TransferForm = ({ onBack }) => {
  const [bank, setBank] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleProceed = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Reset error message

    // Simulate a transaction process
    setTimeout(() => {
      setLoading(false);
      if (Math.random() > 0.5) { // Simulate success or failure
        alert("Transaction Successful!");
        // Reset form fields
        setBank("");
        setAccountNumber("");
        setAmount("");
      } else {
        setError("Transaction failed. Please try again.");
      }
    }, 500);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <button
        className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md p-1 mb-4"
        aria-label="Go back"
        onClick={onBack}
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Go to Dashboard</span>
      </button>

      <form
        onSubmit={handleProceed}
        className="p-6 bg-gray-50 rounded-md shadow-md space-y-6"
      >
        <h4 className="text-2xl font-bold text-center mb-6">Funds Transfer</h4>

        {error && <div className="text-red-500 text-center">{error}</div>}

        <div>
          <label htmlFor="bank" className="block text-sm font-medium mb-2">
            Select Bank
          </label>
          <select
            id="bank"
            value={bank}
            onChange={(e) => setBank(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="" disabled>
              Select a bank
            </option>
            {["Bank A", "Bank B", "Bank C", "Bank D", "Bank E"].map((bankName) => (
              <option key={bankName} value={bankName}>
                {bankName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="accountNumber" className="block text-sm font-medium mb-2">
            Account Number
          </label>
          <input
            id="accountNumber"
            type="text"
            value={accountNumber}
            onChange={(e) =>
              setAccountNumber(e.target.value.replace(/\D/g, "").slice(0, 10))
            }
            placeholder="Enter 10-digit account number"
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium mb-2">
            Amount
          </label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="border p-2 rounded w-full"
            min="0" // Ensure only positive amounts
          />
        </div>

        <button
          type="submit"
          disabled={!bank || !accountNumber || !amount || loading}
          className={clsx(
            "w-full py-3 rounded-md text-white font-bold text-lg flex justify-center items-center transition duration-500",
            bank && accountNumber && amount && !loading
              ? "bg-blue-500 hover:bg-blue-600"
              : "bg-gray-300 cursor-not-allowed"
          )}
        >
          {loading ? <span className="animate-pulse">Processing...</span> : "Proceed"}
        </button>
      </form>
    </div>
  );
};

export default TransferForm;
