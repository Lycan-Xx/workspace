import React, { useState } from "react";
import { History, Printer, Share2, X, ChevronDown, TrendingUp, TrendingDown, Calendar, DollarSign, FileText, Download } from "lucide-react";

// Mock data since we don't have the JSON file
const transferHistoryData = [
  {
    id: 1,
    type: "incoming",
    senderName: "John Smith",
    recipientName: "You",
    amount: 250.00,
    referenceNumber: "TXN001234567",
    date: "2024-01-15",
    time: "14:30",
    status: "completed"
  },
  {
    id: 2,
    type: "outgoing",
    senderName: "You",
    recipientName: "Alice Johnson",
    amount: 75.50,
    referenceNumber: "TXN001234568",
    date: "2024-01-14",
    time: "09:15",
    status: "completed"
  },
  {
    id: 3,
    type: "incoming",
    senderName: "Mike Wilson",
    recipientName: "You",
    amount: 1200.00,
    referenceNumber: "TXN001234569",
    date: "2024-01-13",
    time: "16:45",
    status: "completed"
  },
  {
    id: 4,
    type: "outgoing",
    senderName: "You",
    recipientName: "Sarah Davis",
    amount: 320.75,
    referenceNumber: "TXN001234570",
    date: "2024-01-12",
    time: "11:20",
    status: "completed"
  },
  {
    id: 5,
    type: "incoming",
    senderName: "Robert Brown",
    recipientName: "You",
    amount: 450.25,
    referenceNumber: "TXN001234571",
    date: "2024-01-11",
    time: "13:10",
    status: "completed"
  },
  {
    id: 6,
    type: "outgoing",
    senderName: "You",
    recipientName: "Emma Taylor",
    amount: 89.99,
    referenceNumber: "TXN001234572",
    date: "2024-01-10",
    time: "15:55",
    status: "completed"
  }
];

const HistoryList = () => {
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [visibleHistories, setVisibleHistories] = useState(4);

  const closeModal = () => setSelectedTransaction(null);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Transaction Details",
        text: `Transaction: ${selectedTransaction.amount} ${selectedTransaction.type === 'incoming' ? 'received from' : 'sent to'} ${selectedTransaction.type === 'incoming' ? selectedTransaction.senderName : selectedTransaction.recipientName}`,
      });
    } else {
      navigator.clipboard.writeText(`Transaction Details: $${selectedTransaction.amount} - Reference: ${selectedTransaction.referenceNumber}`);
      alert("Transaction details copied to clipboard!");
    }
  };

  const handleDownload = () => {
    const receipt = `
TRANSACTION RECEIPT
==================
Amount: $${selectedTransaction.amount.toFixed(2)}
From: ${selectedTransaction.senderName}
To: ${selectedTransaction.recipientName}
Reference: ${selectedTransaction.referenceNumber}
Date: ${selectedTransaction.date} ${selectedTransaction.time}
Status: ${selectedTransaction.status}
==================
    `;
    
    const blob = new Blob([receipt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${selectedTransaction.referenceNumber}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadMoreHistories = () => {
    setVisibleHistories(prev => Math.min(prev + 4, transferHistoryData.length));
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <History className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            Transfer History
          </h2>
          <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {transferHistoryData.length} transactions
          </div>
        </div>
        <p className="text-gray-600 text-sm">Track your recent transfers and payments</p>
      </div>

      {/* Transaction Cards */}
      <div className="space-y-3">
        {transferHistoryData.slice(0, visibleHistories).map((transaction) => {
          const isIncoming = transaction.type === "incoming";
          return (
            <div
              key={transaction.id}
              onClick={() => setSelectedTransaction(transaction)}
              className="bg-white rounded-xl border border-gray-200 p-4 cursor-pointer hover:shadow-md hover:border-gray-300 transition-all duration-200 active:scale-[0.99]"
            >
              <div className="flex items-center justify-between">
                {/* Left side - Icon and details */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`p-2 rounded-full ${isIncoming ? 'bg-green-100' : 'bg-red-100'}`}>
                    {isIncoming ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-800 truncate">
                        {isIncoming ? transaction.senderName : transaction.recipientName}
                      </p>
                      <span className={`text-xs px-2 py-1 rounded-full ${isIncoming ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {isIncoming ? 'Received' : 'Sent'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(transaction.date)} • {transaction.time}
                    </p>
                  </div>
                </div>

                {/* Right side - Amount */}
                <div className="text-right ml-4">
                  <p className={`font-bold text-lg ${isIncoming ? 'text-green-600' : 'text-red-600'}`}>
                    {isIncoming ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-400 font-mono">
                    {transaction.referenceNumber.slice(-6)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Load More Button */}
      {visibleHistories < transferHistoryData.length && (
        <div className="mt-6 text-center">
          <button
            onClick={loadMoreHistories}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            Load More
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Enhanced Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 p-1 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-3 rounded-full ${selectedTransaction.type === 'incoming' ? 'bg-green-500' : 'bg-red-500'}`}>
                  {selectedTransaction.type === 'incoming' ? (
                    <TrendingUp className="w-6 h-6 text-white" />
                  ) : (
                    <TrendingDown className="w-6 h-6 text-white" />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold">Transaction Details</h3>
                  <p className="text-blue-100 text-sm">
                    {selectedTransaction.type === 'incoming' ? 'Money Received' : 'Money Sent'}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              {/* Amount */}
              <div className="text-center py-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500 mb-1">Amount</p>
                <p className={`text-3xl font-bold ${selectedTransaction.type === 'incoming' ? 'text-green-600' : 'text-red-600'}`}>
                  {selectedTransaction.type === 'incoming' ? '+' : '-'}${selectedTransaction.amount.toFixed(2)}
                </p>
              </div>

              {/* Transaction Details */}
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 text-sm">From</span>
                  <span className="font-semibold text-gray-800">{selectedTransaction.senderName}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 text-sm">To</span>
                  <span className="font-semibold text-gray-800">{selectedTransaction.recipientName}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 text-sm">Reference</span>
                  <span className="font-mono text-sm text-gray-800">{selectedTransaction.referenceNumber}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 text-sm">Date & Time</span>
                  <span className="text-sm text-gray-800">
                    {formatDate(selectedTransaction.date)} • {selectedTransaction.time}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 text-sm">Status</span>
                  <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Completed
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="border-t border-gray-100 p-4">
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={handlePrint}
                  className="flex flex-col items-center gap-1 p-3 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
                >
                  <Printer className="w-5 h-5" />
                  <span className="text-xs font-medium">Print</span>
                </button>
                <button
                  onClick={handleShare}
                  className="flex flex-col items-center gap-1 p-3 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                  <span className="text-xs font-medium">Share</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="flex flex-col items-center gap-1 p-3 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg transition-colors"
                >
                  <Download className="w-5 h-5" />
                  <span className="text-xs font-medium">Download</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryList;