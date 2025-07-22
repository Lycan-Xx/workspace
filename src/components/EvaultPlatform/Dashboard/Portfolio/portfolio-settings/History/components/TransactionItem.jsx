import React from 'react';
import { Plus, Minus } from 'lucide-react';
import clsx from 'clsx';

export const TransactionItem = ({ transaction, onClick }) => {
  const isIncoming = transaction.type === "incoming";

  return (
    <li
      onClick={onClick}
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
          <span className="font-medium">{transaction.date}</span>
        </div>
        <span className="font-semibold">${transaction.amount.toFixed(2)}</span>
      </div>
      <div className="text-gray-700">
        <p>
          <strong>Sender:</strong> {transaction.senderName}
        </p>
        <p>
          <strong>Reference:</strong> {transaction.referenceNumber}
        </p>
      </div>
    </li>
  );
};