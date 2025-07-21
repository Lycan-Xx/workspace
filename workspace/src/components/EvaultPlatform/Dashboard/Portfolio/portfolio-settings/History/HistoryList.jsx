import React from 'react';
import { History } from 'lucide-react';
import { useHistoryList } from './hooks/useHistoryList';
import { TransactionItem } from './components/TransactionItem';
import { TransactionModal } from './components/TransactionModal';

const HistoryList = () => {
  const {
    visibleHistories,
    selectedTransaction,
    handlePrint,
    handleShare,
    handleSaveToVault,
    loadMoreHistories,
    setSelectedTransaction,
    histories
  } = useHistoryList();

  return (
    <div className="p-6 bg-white rounded-md shadow-md space-y-4 transition duration-500">
      <h4 className="text-2xl font-bold flex items-center">
        <History className="w-6 h-6 mr-2 text-gray-600" /> Transfer History
      </h4>

      <ul className="space-y-4">
        {histories.slice(0, visibleHistories).map((history) => (
          <TransactionItem
            key={history.id}
            transaction={history}
            onClick={() => setSelectedTransaction(history)}
          />
        ))}
      </ul>

      {visibleHistories < histories.length && (
        <button
          onClick={loadMoreHistories}
          className="flex items-center justify-center w-full md:w-1/4 bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 transition duration-300"
        >
          Load More
        </button>
      )}

      <TransactionModal
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
        onPrint={handlePrint}
        onShare={handleShare}
        onSave={handleSaveToVault}
      />
    </div>
  );
};

export default HistoryList;