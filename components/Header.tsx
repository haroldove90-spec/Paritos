import React from 'react';
import { MenuIcon } from './icons/MenuIcon';
import { BellIcon } from './icons/BellIcon';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';

interface HeaderProps {
    onNotificationsClick: () => void;
    notificationCount: number;
    showBackButton?: boolean;
    onBackClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNotificationsClick, notificationCount, showBackButton, onBackClick }) => {
  return (
    <header className="flex-shrink-0 flex items-center py-1 px-4 bg-[#181818] sticky top-0 z-10">
      <div className="w-10">
        {showBackButton ? (
             <button onClick={onBackClick} aria-label="Go back" className="p-2 -ml-2">
                <ChevronLeftIcon className="w-6 h-6 text-white" />
            </button>
        ) : (
            <button aria-label="Open menu" className="p-2 -ml-2">
                <MenuIcon className="w-6 h-6 text-white" />
            </button>
        )}
      </div>
      <div className="flex-1 flex justify-center">
        <div className="flex items-center space-x-2">
            <img src="https://appdesignmex.com/parito.png" alt="Paritos Logo" className="w-9 h-9" />
            <h1 className="font-bold text-xl text-[#FFDF00]">Paritos</h1>
        </div>
      </div>
      <div className="w-10 flex justify-end">
        <button onClick={onNotificationsClick} aria-label="View notifications" className="relative p-2 -mr-2">
            <BellIcon className="w-6 h-6 text-white" />
            {notificationCount > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center border-2 border-[#181818]">
                    {notificationCount}
                </span>
            )}
        </button>
      </div>
    </header>
  );
};

export default Header;