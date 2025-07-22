import React from 'react';
import { User, Settings } from 'lucide-react';

export const TabNavigation = ({ currentView, setCurrentView }) => {
  const tabs = [
    { id: 'info', label: 'Personal Info', icon: <User size={20} /> },
    { id: 'admin', label: 'Admin Settings', icon: <Settings size={20} /> }
  ];

  return (
    <div className="w-full bg-white shadow-sm rounded-lg mb-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurrentView(tab.id)}
              className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors
                ${currentView === tab.id
                  ? 'text-blue-600 border-blue-600 bg-blue-50'
                  : 'text-gray-500 border-transparent hover:text-blue-600 hover:border-blue-300'
                }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Add custom scrollbar styling
const style = document.createElement('style');
style.textContent = `
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;
document.head.appendChild(style);