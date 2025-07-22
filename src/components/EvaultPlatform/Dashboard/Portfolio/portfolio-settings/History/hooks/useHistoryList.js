import { useState } from 'react';
import transferHistoryData from '../data/transferHistories.json';

export const useHistoryList = () => {
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [visibleHistories, setVisibleHistories] = useState(6);
  const [histories] = useState(transferHistoryData);

  const handlePrint = () => {
    window.print();
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

  return {
    visibleHistories,
    selectedTransaction,
    handlePrint,
    handleShare,
    handleSaveToVault,
    loadMoreHistories,
    setSelectedTransaction,
    histories
  };
};