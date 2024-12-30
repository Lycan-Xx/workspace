import React from 'react';

const ContentColumn = ({ children }) => {
  return (
    <div className="flex-1 min-h-screen bg-gray-50 overflow-hidden">
      <div className="max-w-4xl mx-auto p-4 lg:p-8">
        {children}
      </div>
    </div>
  );
};

export default ContentColumn;