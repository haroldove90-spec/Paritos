import React from 'react';
import { MenuIcon } from './icons/MenuIcon';
import { SearchIcon } from './icons/SearchIcon';
import ManageRestaurants from './admin/ManageRestaurants';
import ManageOrders from './admin/ManageOrders';
import ManageCouriers from './admin/ManageCouriers';
import ManageAnalytics from './admin/ManageAnalytics';
import MonitorDeliveries from './admin/MonitorDeliveries';
import type { Restaurant, Order, Courier } from '../types';

type AdminView = 'Dashboard' | 'Restaurantes' | 'Pedidos' | 'Mensajeros' | 'Analíticas' | 'Entregas';

interface AdminDashboardProps {
    currentView: AdminView;
    setView: (view: AdminView) => void;
    restaurants: Restaurant[];
    onSaveRestaurant: (restaurant: Restaurant) => void;
    onDeleteRestaurant: (id: number) => void;
    orders: Order[];
    couriers: Courier[];
    onSaveCourier: (courier: Courier) => void;
    onDeleteCourier: (id: number) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
    currentView, setView, 
    restaurants, onSaveRestaurant, onDeleteRestaurant, 
    orders, 
    couriers, onSaveCourier, onDeleteCourier
}) => {

  const DashboardHome: React.FC = () => {
    const activeOrders = orders.filter(o => o.status === 'en_preparacion' || o.status === 'en_camino').length;
    
    return (
     <main className="flex-grow overflow-y-auto p-6 space-y-6">
        <h2 className="text-xl font-semibold text-gray-300">Gestión General</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <button onClick={() => setView('Restaurantes')} className="bg-[#2a2a2a] hover:bg-[#3a3a3a] p-4 rounded-xl flex flex-col items-center justify-center aspect-square transform hover:-translate-y-1 transition-all duration-200 ease-in-out shadow-lg">
                <span className="text-5xl">🍔</span>
                <span className="mt-2 font-bold text-center text-white">Gestionar Restaurantes</span>
            </button>
            <button onClick={() => setView('Pedidos')} className="relative bg-[#2a2a2a] hover:bg-[#3a3a3a] p-4 rounded-xl flex flex-col items-center justify-center aspect-square transform hover:-translate-y-1 transition-all duration-200 ease-in-out shadow-lg">
                {activeOrders > 0 && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-[#2a2a2a]">
                        {activeOrders}
                    </span>
                )}
                <span className="text-5xl">📝</span>
                <span className="mt-2 font-bold text-center text-white">Monitorear Pedidos</span>
            </button>
            <button onClick={() => setView('Mensajeros')} className="relative bg-[#2a2a2a] hover:bg-[#3a3a3a] p-4 rounded-xl flex flex-col items-center justify-center aspect-square transform hover:-translate-y-1 transition-all duration-200 ease-in-out shadow-lg">
                 <span className="text-5xl">🛵</span>
                <span className="mt-2 font-bold text-center text-white">Gestionar Mensajeros</span>
                <span className="mt-1 text-xs text-green-400 font-bold">{couriers.filter(c => c.status === 'disponible').length} disponibles</span>
            </button>
            <button onClick={() => setView('Analíticas')} className="bg-[#2a2a2a] hover:bg-[#3a3a3a] p-4 rounded-xl flex flex-col items-center justify-center aspect-square transform hover:-translate-y-1 transition-all duration-200 ease-in-out shadow-lg">
                <span className="text-5xl">📊</span>
                <span className="mt-2 font-bold text-center text-white">Ver Analíticas</span>
            </button>
            <button onClick={() => setView('Entregas')} className="bg-[#2a2a2a] hover:bg-[#3a3a3a] p-4 rounded-xl flex flex-col items-center justify-center aspect-square transform hover:-translate-y-1 transition-all duration-200 ease-in-out shadow-lg">
                <span className="text-5xl">🗺️</span>
                <span className="mt-2 font-bold text-center text-white">Monitorear Entregas</span>
            </button>
        </div>
      </main>
    );
  };

  return (
    <div className="flex flex-col h-full text-white">
      <header className="flex-shrink-0 flex justify-between items-center p-4 bg-[#181818] border-b border-[#3A3D42]/50">
        <div>
          <h1 className="font-bold text-2xl text-white">Panel de Administrador</h1>
          <p className="text-sm text-gray-400">Paritos</p>
        </div>
        <div className="flex items-center space-x-4">
            <button><SearchIcon className="w-6 h-6 text-white" /></button>
            <button><MenuIcon className="w-6 h-6 text-white" /></button>
        </div>
      </header>

      {currentView === 'Dashboard' && <DashboardHome />}
      {currentView === 'Restaurantes' && <ManageRestaurants onBack={() => setView('Dashboard')} restaurants={restaurants} onSave={onSaveRestaurant} onDelete={onDeleteRestaurant}/>}
      {currentView === 'Pedidos' && <ManageOrders onBack={() => setView('Dashboard')} orders={orders} />}
      {currentView === 'Mensajeros' && <ManageCouriers onBack={() => setView('Dashboard')} couriers={couriers} onSave={onSaveCourier} onDelete={onDeleteCourier} />}
      {currentView === 'Analíticas' && <ManageAnalytics onBack={() => setView('Dashboard')} orders={orders} restaurants={restaurants} couriers={couriers} />}
      {currentView === 'Entregas' && <MonitorDeliveries onBack={() => setView('Dashboard')} orders={orders} couriers={couriers} />}
    </div>
  );
};

export default AdminDashboard;