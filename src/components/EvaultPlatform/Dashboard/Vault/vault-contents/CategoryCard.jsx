import React from 'react';

function CategoryCard({ category, onSelect }) {
  return (
    <button
      onClick={onSelect}
      className="w-full text-left bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all transform hover:-translate-y-1"
    >
      <div className="flex items-center gap-4">
        <category.icon className="text-blue-500 text-4xl" />
        <div>
          <h2 className="text-lg font-semibold">{category.name}</h2>
          <p className="text-gray-600 text-sm mt-1">{category.description}</p>
        </div>
      </div>
    </button>
  );
}

export default CategoryCard;