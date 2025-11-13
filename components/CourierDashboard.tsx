
import React from 'react';
import { MenuIcon } from './icons/MenuIcon';

const CourierDashboard: React.FC = () => {
  return (
    <div className="flex flex-col h-full text-white">
       <header className="flex-shrink-0 flex justify-between items-center p-4 bg-[#181818] border-b border-[#3A3D42]">
        <div>
            <h1 className="font-bold text-xl text-white">Dashboard Mensajero</h1>
            <p className="text-sm text-gray-400">Mis Pedidos y Envíos</p>
        </div>
        <button><MenuIcon className="w-6 h-6 text-white" /></button>
      </header>

      <main className="flex-grow overflow-y-auto p-4 space-y-6">
        <div>
            <h2 className="text-lg font-semibold text-[#FFDF00] mb-2">Pedido Activo</h2>
            <div className="bg-[#3A3D42] p-4 rounded-lg">
                <div className="flex justify-between items-center">
                    <p className="font-bold">The Burger Joint</p>
                    <p className="text-sm text-gray-300">ID: #8B3E1</p>
                </div>
                <p className="text-sm text-gray-400 mt-1">Dirección: Av. Siempre Viva 123</p>
                <button className="mt-4 w-full bg-[#FFDF00] text-[#181818] font-bold py-2 rounded-lg transform hover:scale-105 transition-transform duration-200">
                    Ver en Mapa
                </button>
            </div>
        </div>

        <div>
            <h2 className="text-lg font-semibold text-gray-300 mb-2">Pedidos Pendientes</h2>
            <div className="space-y-3">
                 <div className="bg-[#1e1e1e] p-4 rounded-lg">
                    <p className="font-bold">The Taco Spot</p>
                    <p className="text-sm text-gray-400">A 1.2km de distancia</p>
                </div>
                 <div className="bg-[#1e1e1e] p-4 rounded-lg">
                    <p className="font-bold">Sushi Heaven</p>
                    <p className="text-sm text-gray-400">A 3.5km de distancia</p>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
};

export default CourierDashboard;
