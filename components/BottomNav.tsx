
import React, { useMemo } from 'react';
import { HomeIcon } from './icons/HomeIcon';
import { OrdersIcon } from './icons/OrdersIcon';
import { HeartIcon } from './icons/HeartIcon';
import { UserIcon } from './icons/UserIcon';
import { CartIcon } from './icons/CartIcon';
import { MotorcycleIcon } from './icons/MotorcycleIcon';
import type { ActiveView, UserRole } from '../types';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  isActive?: boolean;
  notificationCount?: number;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, isActive, notificationCount, onClick }) => {
  const activeColor = 'text-[#FFDF00]';
  const inactiveColor = 'text-gray-400';
  const color = isActive ? activeColor : inactiveColor;

  return (
    <button onClick={onClick} className={`flex flex-col items-center justify-center space-y-1 flex-1 relative transition-colors duration-200 hover:text-white focus:outline-none ${color}`}>
      <div className="relative">
        <Icon className="w-6 h-6" />
        {isActive && <span className="absolute -top-1 -left-1 w-8 h-8 bg-[#FFDF00]/20 rounded-full animate-ping"></span>}
        {notificationCount && notificationCount > 0 && (
          <span className="absolute -top-1 -right-2 bg-[#FFDF00] text-[#181818] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-[#181818]">
            {notificationCount}
          </span>
        )}
      </div>
      <span className="text-xs font-semibold">{label}</span>
    </button>
  );
};

interface BottomNavProps {
    activeTab: ActiveView;
    onTabChange: (tab: ActiveView) => void;
    cartItemCount: number;
    userRole: UserRole;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange, cartItemCount, userRole }) => {
  
  const navItems = useMemo(() => {
    const items: { id: ActiveView; icon: React.ElementType; label: string; notificationCount?: number }[] = [
      { id: 'Inicio', icon: HomeIcon, label: 'Inicio' },
      { id: 'Pedidos', icon: OrdersIcon, label: 'Pedidos' },
      { id: 'Favoritos', icon: HeartIcon, label: 'Favoritos' },
      { id: 'Perfil', icon: UserIcon, label: 'Perfil' },
    ];
    
    if (userRole?.toLowerCase() === 'cliente') {
        items.push({ id: 'Conviertete', icon: MotorcycleIcon, label: 'Repartir' });
    }

    items.push({ id: 'Carrito', icon: CartIcon, label: 'Carrito', notificationCount: cartItemCount });
    
    return items;
  }, [userRole, cartItemCount]);


  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black via-[#181818] to-[#181818] border-t border-[#3A3D42]/50 shadow-lg backdrop-blur-sm">
       <div className="w-full max-w-6xl mx-auto flex justify-around items-center h-20">
        {navItems.map(item => (
            <NavItem 
                key={item.id}
                icon={item.icon} 
                label={item.label} 
                isActive={activeTab === item.id} 
                onClick={() => onTabChange(item.id)}
                notificationCount={item.notificationCount}
            />
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
