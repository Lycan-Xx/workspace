import React, { useState } from "react";
import schools from "./list.json";

const SchoolSearch = ({ onSelectSchool }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSchools = schools.filter((school) =>
    school.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center">
        Welcome to the School Fees Payment Portal
      </h1>

      <div className="text-center space-y-4 sm:space-y-6">
        <h3 className="text-lg sm:text-xl font-bold px-4">
          Please search for the school you want to make payments to
        </h3>
        
        <div className="relative w-full max-w-xl mx-auto">
          <input
            type="text"
            placeholder="Search schools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
          />
          <svg
            className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="bg-white shadow-md rounded-lg w-full max-w-xl mx-auto mt-4 max-h-[60vh] overflow-y-auto">
          {filteredSchools.length > 0 ? (
            filteredSchools.map((school) => (
              <div
                key={school.name}
                onClick={() => onSelectSchool(school)}
                className="cursor-pointer flex items-center p-4 sm:p-5 border-b hover:bg-gray-50 active:bg-gray-100 transition duration-150 ease-in-out"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0">
                  <img
                    src={school.logo}
                    alt={school.name}
                    className="w-full h-full rounded-lg object-cover"
                  />
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="font-semibold text-base sm:text-lg text-gray-800">
                    {school.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 line-clamp-2">
                    {school.description}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-gray-500">
              <p className="text-base">No schools found</p>
              <p className="text-sm mt-2">Try a different search term</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SchoolSearch;