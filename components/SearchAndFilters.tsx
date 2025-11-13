
import React, { useState } from 'react';
import { SearchIcon } from './icons/SearchIcon';
import { FilterIcon } from './icons/FilterIcon';

const categories = ['Vegetariano', 'Pizza', 'Sushi', 'Mexicana', 'Postres', 'Café'];

const SearchAndFilters: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('Vegetariano');

  return (
    <div className="px-4 pb-2 flex-shrink-0">
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon className="w-5 h-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Busca restaurantes o platos..."
          className="w-full bg-[#3A3D42] text-white placeholder-gray-400 rounded-full py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[#FFDF00]"
        />
      </div>
      <div className="flex items-center space-x-2">
        <div className="flex-grow overflow-x-auto whitespace-nowrap scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {categories.map((category) => (
            <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 mr-2
                ${
                    activeCategory === category
                    ? 'bg-[#FFDF00] text-[#181818]'
                    : 'bg-[#3A3D42] text-white'
                }`}
            >
                {category}
            </button>
            ))}
        </div>
        <button className="bg-[#3A3D42] p-2 rounded-full">
            <FilterIcon className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
};

export default SearchAndFilters;
