import React from 'react';
import { MenuIcon } from './icons/MenuIcon';
import { SearchIcon } from './icons/SearchIcon';
import ManageRestaurants from './admin/ManageRestaurants';
import type { Restaurant } from '../types';

type AdminView = 'Dashboard' | 'Restaurants';

interface AdminDashboardProps {
    currentView: AdminView;
    setView: (view: AdminView) => void;
    restaurants: Restaurant[];
    onSaveRestaurant: (restaurant: Restaurant) => void;
    onDeleteRestaurant: (id: number) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ currentView, setView, restaurants, onSaveRestaurant, onDeleteRestaurant }) => {

  const DashboardHome: React.FC = () => (
     <main className="flex-grow overflow-y-auto p-6 space-y-6">
        <h2 className="text-xl font-semibold text-gray-300">Gestión General</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <button onClick={() => setView('Restaurants')} className="bg-[#2a2a2a] hover:bg-[#3a3a3a] p-4 rounded-xl flex flex-col items-center justify-center aspect-square transform hover:-translate-y-1 transition-all duration-200 ease-in-out shadow-lg">
                <span className="text-5xl">🍔</span>
                <span className="mt-2 font-bold text-center text-white">Gestionar Restaurantes</span>
            </button>
            <div className="bg-[#2a2a2a] p-4 rounded-xl flex flex-col items-center justify-center aspect-square shadow-lg opacity-50">
                <span className="text-5xl">👤</span>
                <span className="mt-2 font-bold text-center text-gray-400">Gestionar Usuarios</span>
            </div>
            <div className="bg-[#2a2a2a] p-4 rounded-xl flex flex-col items-center justify-center aspect-square shadow-lg opacity-50">
                 <span className="text-5xl">🛵</span>
                <span className="mt-2 font-bold text-center text-gray-400">Gestionar Mensajeros</span>
            </div>
            <div className="bg-[#2a2a2a] p-4 rounded-xl flex flex-col items-center justify-center aspect-square shadow-lg opacity-50">
                <span className="text-5xl">📊</span>
                <span className="mt-2 font-bold text-center text-gray-400">Ver Analíticas</span>
            </div>
        </div>
      </main>
  );

  return (
    <div className="flex flex-col h-full text-white">
      <header className="flex-shrink-0 flex justify-between items-center p-4 bg-[#181818] border-b border-[#3A3D42]/50">
        <div>
          <h1 className="font-bold text-2xl text-white">Dashboard Admin</h1>
          <p className="text-sm text-gray-400">Paritos</p>
        </div>
        <div className="flex items-center space-x-4">
            <button><SearchIcon className="w-6 h-6 text-white" /></button>
            <button><MenuIcon className="w-6 h-6 text-white" /></button>
        </div>
      </header>

      {currentView === 'Dashboard' && <DashboardHome />}
      {currentView === 'Restaurants' && <ManageRestaurants onBack={() => setView('Dashboard')} restaurants={restaurants} onSave={onSaveRestaurant} onDelete={onDeleteRestaurant}/>}
    </div>
  );
};

export default AdminDashboard;
