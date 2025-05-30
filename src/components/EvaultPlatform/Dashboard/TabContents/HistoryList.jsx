import React, { useState } from "react";
import { History, Printer, Share2, X, ArrowDown, Plus, Minus } from "lucide-react";
import clsx from "clsx";
import transferHistoryData from "./transferHistories.json"; // Adjust path as needed

const HistoryList = () => {
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [visibleHistories, setVisibleHistories] = useState(6);

  const closeDialog = () => setSelectedTransaction(null);

  const handlePrint = () => {
    window.print(); // Basic print functionality
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Transaction Details",
        text: `Transaction from ${selectedTransaction.senderName} to ${selectedTransaction.recipientName} for ${selectedTransaction.amount}. Reference: ${selectedTransaction.referenceNumber}`,
      });
    } else {
      alert("Sharing is not supported on this device.");
    }
  };

  const handleSaveToVault = () => {
    alert("This transaction has been saved to your vault!");
  };

  const loadMoreHistories = () => {
    setVisibleHistories((prev) => prev + 5);
  };

  return (
    <div className="p-6 bg-white rounded-md shadow-md space-y-4 transition duration-500">
      <h4 className="text-2xl font-bold flex items-center">
        <History className="w-6 h-6 mr-2 text-gray-600" /> Transfer History
      </h4>

      <ul className="space-y-4">
        {transferHistoryData.slice(0, visibleHistories).map((history) => {
          const isIncoming = history.type === "incoming"; // Assuming type is "incoming" or "outgoing"
          return (
            <li
              key={history.id}
              onClick={() => setSelectedTransaction(history)}
              className={clsx(
                "p-4 border rounded-md shadow-sm cursor-pointer transition-all duration-100 hover:border-4",
                isIncoming ? "border-green-500 hover:border-green-700" : "border-red-500 hover:border-red-700"
              )}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  {isIncoming ? (
                    <Plus className="w-5 h-5 text-green-500" />
                  ) : (
                    <Minus className="w-5 h-5 text-red-500" />
                  )}
                  <span className="font-medium">{history.date}</span>
                </div>
                <span className="font-semibold">${history.amount.toFixed(2)}</span>
              </div>
              <div className="text-gray-700">
                <p>
                  <strong>Sender:</strong> {history.senderName}
                </p>
                <p>
                  <strong>Reference:</strong> {history.referenceNumber}
                </p>
              </div>
            </li>
          );
        })}
      </ul>

      {visibleHistories < transferHistoryData.length && (
        <button
          onClick={loadMoreHistories}
          className="flex items-center justify-center w-full md:w-1/4 bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 transition duration-300 whitespace-nowrap"
        >
          More <ArrowDown className="w-5 h-5 ml-2" />
        </button>
      )}

      {selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 space-y-4 relative">
            <button
              onClick={closeDialog}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <h4 className="text-xl font-bold text-center text-blue-600">Transaction Summary</h4>
            <div className="space-y-2 text-gray-700">
              <p>
                <strong>Sender:</strong> {selectedTransaction.senderName}
              </p>
              <p>
                <strong>Recipient:</strong> {selectedTransaction.recipientName}
              </p>
              <p>
                <strong>Amount:</strong> ${selectedTransaction.amount.toFixed(2)}
              </p>
              <p>
                <strong>Reference Number:</strong> {selectedTransaction.referenceNumber}
              </p>
              <p>
                <strong>Date & Time:</strong> {selectedTransaction.date} at {selectedTransaction.time}
              </p>
            </div>

            <div className="flex justify-center space-x-4 pt-4">
              <button
                onClick={handlePrint}
                className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                <Printer className="w-5 h-5" />
                <span>Print</span>
              </button>
              <button
                onClick={handleShare}
                className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                <Share2 className="w-5 h-5" />
                <span>Share</span>
              </button>
              <button
                onClick={handleSaveToVault}
                className="flex items-center space-x-2 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
              >
                <span>Save to Vault</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryList;