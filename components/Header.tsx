
import React from 'react';
import { MenuIcon } from './icons/MenuIcon';
import { SearchIcon } from './icons/SearchIcon';

const Header: React.FC = () => {
  return (
    <header className="flex-shrink-0 flex justify-between items-center p-4 bg-[#181818]">
      <button aria-label="Open menu">
        <MenuIcon className="w-6 h-6 text-white" />
      </button>
      <div className="flex flex-col items-center">
        <img src="https://appdesignmex.com/parito.png" alt="Paritos Logo" className="w-10 h-10 mb-1" />
        <h1 className="font-bold text-2xl text-[#FFDF00]">Paritos</h1>
      </div>
      <button aria-label="Search">
        <SearchIcon className="w-6 h-6 text-white" />
      </button>
    </header>
  );
};

export default Header;
