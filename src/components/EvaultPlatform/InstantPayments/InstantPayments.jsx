import React, { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import VendorList from './VendorList/VendorList.jsx';  // Fix import
import CategoryGrid from './CategoryGrid.jsx';

const InstantPayments = ({ onSelectVendor, onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [debouncedQuery] = useState(searchQuery);

  const filters = ["List", "Favorite", "Schools", "Recents"];

  return (
    <div className="mt-20 space-y-8">
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h2 className="text-2xl font-bold text-[#025798] mb-6">Instant Payment</h2>

        {/* Search Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search for Agent / Vendor"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#025798] focus:border-transparent transition-all"
          />
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2"
            onClick={() => setIsDropdownVisible(!isDropdownVisible)}
          >
            <SlidersHorizontal className="w-5 h-5 text-gray-400 hover:text-[#025798]" />
          </button>

          {/* Filters Dropdown */}
          {isDropdownVisible && (
            <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              {filters.map((filter) => (
                <button
                  key={filter}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700"
                  onClick={() => setIsDropdownVisible(false)}
                >
                  {filter}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Vendor List */}
        <VendorList
          searchQuery={debouncedQuery}
          onSelectVendor={onSelectVendor}
        />
      </div>

      {/* Categories Section */}
      <CategoryGrid onNavigate={onNavigate} />
    </div>
  );
};

export default InstantPayments;