
import React from 'react';
import { MenuIcon } from './icons/MenuIcon';
import { SearchIcon } from './icons/SearchIcon';

const AdminDashboard: React.FC = () => {
  return (
    <div className="flex flex-col h-full text-white">
      <header className="flex-shrink-0 flex justify-between items-center p-4 bg-[#181818] border-b border-[#3A3D42]">
        <div>
          <h1 className="font-bold text-xl text-white">Dashboard Admin</h1>
          <p className="text-sm text-gray-400">Paritos</p>
        </div>
        <div className="flex items-center space-x-4">
            <button><SearchIcon className="w-6 h-6 text-white" /></button>
            <button><MenuIcon className="w-6 h-6 text-white" /></button>
        </div>
      </header>

      <main className="flex-grow overflow-y-auto p-4 space-y-4">
        <h2 className="text-lg font-semibold text-gray-300">Gestión General</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#3A3D42] p-4 rounded-lg flex flex-col items-center justify-center aspect-square transform hover:scale-105 transition-transform duration-200">
                <span className="text-4xl">🍔</span>
                <span className="mt-2 font-bold text-center">Gestionar Restaurantes</span>
            </div>
            <div className="bg-[#3A3D42] p-4 rounded-lg flex flex-col items-center justify-center aspect-square transform hover:scale-105 transition-transform duration-200">
                <span className="text-4xl">👤</span>
                <span className="mt-2 font-bold text-center">Gestionar Usuarios</span>
            </div>
            <div className="bg-[#3A3D42] p-4 rounded-lg flex flex-col items-center justify-center aspect-square transform hover:scale-105 transition-transform duration-200">
                 <span className="text-4xl">🛵</span>
                <span className="mt-2 font-bold text-center">Gestionar Mensajeros</span>
            </div>
            <div className="bg-[#3A3D42] p-4 rounded-lg flex flex-col items-center justify-center aspect-square transform hover:scale-105 transition-transform duration-200">
                <span className="text-4xl">📊</span>
                <span className="mt-2 font-bold text-center">Ver Analíticas</span>
            </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
