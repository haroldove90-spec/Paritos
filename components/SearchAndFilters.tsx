import React from 'react';
import { SearchIcon } from './icons/SearchIcon';
import { FilterIcon } from './icons/FilterIcon';
import type { RestaurantCategory } from '../types';

interface SearchAndFiltersProps {
    activeCategory: RestaurantCategory | 'All';
    onCategoryChange: (category: RestaurantCategory | 'All') => void;
    searchTerm: string;
    onSearchChange: (term: string) => void;
    allCategories: RestaurantCategory[];
}

const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({ activeCategory, onCategoryChange, searchTerm, onSearchChange, allCategories }) => {

  return (
    <div className="px-4 pb-2 flex-shrink-0 sticky top-[44px] bg-[#181818] z-10">
      <div className="relative mb-3">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <SearchIcon className="w-5 h-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Busca restaurantes o platos..."
          className="w-full bg-[#2a2a2a] text-white placeholder-gray-400 rounded-full py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-[#FFDF00] border border-transparent focus:border-[#FFDF00]"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex items-center space-x-2">
        <div className="flex-grow overflow-x-auto whitespace-nowrap scrollbar-hide" style={{ scrollbarWidth: 'none', '-ms-overflow-style': 'none' }}>
            <button
                onClick={() => onCategoryChange('All')}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 mr-2
                ${
                    activeCategory === 'All'
                    ? 'bg-[#FFDF00] text-[#181818]'
                    : 'bg-[#2a2a2a] text-white hover:bg-[#3a3a3a]'
                }`}
            >
                Todo
            </button>
            {allCategories.map((category) => (
            <button
                key={category}
                onClick={() => onCategoryChange(category)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 mr-2
                ${
                    activeCategory === category
                    ? 'bg-[#FFDF00] text-[#181818]'
                    : 'bg-[#2a2a2a] text-white hover:bg-[#3a3a3a]'
                }`}
            >
                {category}
            </button>
            ))}
        </div>
        <button className="bg-[#2a2a2a] p-3 rounded-full flex-shrink-0 hover:bg-[#3a3a3a]">
            <FilterIcon className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
};

export default SearchAndFilters;