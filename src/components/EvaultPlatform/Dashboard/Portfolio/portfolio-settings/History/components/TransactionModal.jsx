import React from 'react';
import { X, Printer, Share2 } from 'lucide-react';

export const TransactionModal = ({ 
  transaction, 
  onClose, 
  onPrint, 
  onShare, 
  onSave 
}) => {
  if (!transaction) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 space-y-4 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <h4 className="text-xl font-bold text-center text-blue-600">Transaction Summary</h4>
        <div className="space-y-2 text-gray-700">
          <p>
            <strong>Sender:</strong> {transaction.senderName}
          </p>
          <p>
            <strong>Recipient:</strong> {transaction.recipientName}
          </p>
          <p>
            <strong>Amount:</strong> ${transaction.amount.toFixed(2)}
          </p>
          <p>
            <strong>Reference Number:</strong> {transaction.referenceNumber}
          </p>
          <p>
            <strong>Date & Time:</strong> {transaction.date} at {transaction.time}
          </p>
        </div>

        <div className="flex justify-center space-x-4 pt-4">
          <button
            onClick={onPrint}
            className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            <Printer className="w-5 h-5" />
            <span>Print</span>
          </button>
          <button
            onClick={onShare}
            className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            <Share2 className="w-5 h-5" />
            <span>Share</span>
          </button>
          <button
            onClick={onSave}
            className="flex items-center space-x-2 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
          >
            <span>Save to Vault</span>
          </button>
        </div>
      </div>
    </div>
  );
};