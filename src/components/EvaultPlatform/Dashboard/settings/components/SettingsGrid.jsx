import React from 'react';
import { CategoryCard } from './CategoryCard';
import { settingsCategories } from '../data/categories';

export const SettingsGrid = ({ onSettingSelect }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 p-2">
      {settingsCategories.map((category) => (
        <CategoryCard 
          key={category.id} 
          category={category} 
          onSelect={onSettingSelect}
        />
      ))}
    </div>
  );
};