
import React, { useState } from 'react';
import { HomeIcon } from './icons/HomeIcon';
import { OrdersIcon } from './icons/OrdersIcon';
import { RunningIcon } from './icons/RunningIcon';
import { FavoritesIcon } from './icons/FavoritesIcon';
import { CartIcon } from './icons/CartIcon';

const NavItem: React.FC<{
  icon: React.ElementType;
  label: string;
  isActive?: boolean;
  notificationCount?: number;
  onClick: () => void;
}> = ({ icon: Icon, label, isActive, notificationCount, onClick }) => {
  const activeColor = 'text-[#FFDF00]';
  const inactiveColor = 'text-gray-400';
  const color = isActive ? activeColor : inactiveColor;

  return (
    <button onClick={onClick} className={`flex flex-col items-center justify-center space-y-1 w-1/5 relative transition-colors duration-200 ${color}`}>
      <div className="relative">
        <Icon className="w-6 h-6" />
        {notificationCount && notificationCount > 0 && (
          <span className="absolute -top-1 -right-2 bg-[#FFDF00] text-[#181818] text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
            {notificationCount}
          </span>
        )}
      </div>
      <span className="text-xs font-semibold">{label}</span>
    </button>
  );
};


const BottomNav: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Inicio');

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#181818] border-t border-[#3A3D42] shadow-lg">
       <div className="w-full max-w-6xl mx-auto flex justify-around items-center h-16">
        <NavItem icon={HomeIcon} label="Inicio" isActive={activeTab === 'Inicio'} onClick={() => setActiveTab('Inicio')} />
        <NavItem icon={OrdersIcon} label="Pedidos" isActive={activeTab === 'Pedidos1'} onClick={() => setActiveTab('Pedidos1')} />
        <NavItem icon={RunningIcon} label="Pedidos" isActive={activeTab === 'Pedidos2'} onClick={() => setActiveTab('Pedidos2')} />
        <NavItem icon={FavoritesIcon} label="Favoritos" isActive={activeTab === 'Favoritos'} notificationCount={1} onClick={() => setActiveTab('Favoritos')} />
        <NavItem icon={CartIcon} label="Carrito" isActive={activeTab === 'Carrito'} notificationCount={3} onClick={() => setActiveTab('Carrito')} />
      </div>
    </nav>
  );
};

export default BottomNav;
