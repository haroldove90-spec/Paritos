import React from 'react';
import { MenuIcon } from './icons/MenuIcon';
import { SearchIcon } from './icons/SearchIcon';
import { BellIcon } from './icons/BellIcon';
import ManageRestaurants from './admin/ManageRestaurants';
import ManageOrders from './admin/ManageOrders';
import ManageCouriers from './admin/ManageCouriers';
import ManageAnalytics from './admin/ManageAnalytics';
import MonitorDeliveries from './admin/MonitorDeliveries';
import type { Restaurant, Order, Courier, OrderStatus } from '../types';
import { BuildingStorefrontIcon } from './icons/BuildingStorefrontIcon';
import { OrdersIcon } from './icons/OrdersIcon';
import { TruckIcon } from './icons/TruckIcon';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { MapPinIcon } from './icons/MapPinIcon';

type AdminView = 'Dashboard' | 'Restaurantes' | 'Pedidos' | 'Mensajeros' | 'Analíticas' | 'Entregas';

interface AdminDashboardProps {
    currentView: AdminView;
    setView: (view: AdminView) => void;
    restaurants: Restaurant[];
    onSaveRestaurant: (restaurant: Restaurant) => void;
    onDeleteRestaurant: (id: number) => void;
    orders: Order[];
    onUpdateOrderStatus: (orderId: number, status: OrderStatus, courierId?: number) => void;
    couriers: Courier[];
    onSaveCourier: (courier: Courier) => void;
    onDeleteCourier: (id: number) => void;
    notificationCount: number;
    onNotificationsClick: () => void;
    allCategories: string[];
}

const AdminCard: React.FC<{
    onClick: () => void;
    icon: React.ReactNode;
    title: string;
    description: string;
    notification?: number;
    badge?: string;
}> = ({ onClick, icon, title, description, notification, badge }) => (
    <button 
        onClick={onClick} 
        className="relative bg-[#2a2a2a] p-4 rounded-xl flex flex-col items-center justify-center aspect-square text-center
                   transform hover:-translate-y-1.5 transition-all duration-300 ease-in-out shadow-lg
                   hover:shadow-2xl hover:shadow-[#FFDF00]/20 hover:ring-2 hover:ring-[#FFDF00]/80 group"
    >
        {notification !== undefined && notification > 0 && (
            <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-[#2a2a2a] animate-pulse">
                {notification}
            </span>
        )}
        <div className="text-white mb-3 transition-transform duration-300 group-hover:scale-110">
            {icon}
        </div>
        <span className="font-bold text-lg text-white">{title}</span>
        <p className="text-xs text-gray-400 mt-1 px-2">{description}</p>
        {badge && (
             <span className="mt-2 text-xs text-green-400 font-bold">{badge}</span>
        )}
    </button>
);


const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
    currentView, setView, 
    restaurants, onSaveRestaurant, onDeleteRestaurant, 
    orders, onUpdateOrderStatus,
    couriers, onSaveCourier, onDeleteCourier,
    notificationCount, onNotificationsClick,
    allCategories
}) => {

  const DashboardHome: React.FC = () => {
    const activeOrders = orders.filter(o => o.status === 'en_preparacion' || o.status === 'en_camino').length;
    const availableCouriers = couriers.filter(c => c.status === 'disponible').length;
    const activeDeliveries = orders.filter(o => o.status === 'en_camino');

    const getCourier = (courierId: number | null) => {
        if (!courierId) return null;
        return couriers.find(c => c.id === courierId) || null;
    };

    const markerPositions = [
        { top: '30%', left: '40%' },
        { top: '55%', left: '60%' },
        { top: '45%', left: '25%' },
        { top: '65%', left: '35%' },
        { top: '25%', left: '70%' },
    ];
    
    return (
     <main className="flex-grow overflow-y-auto p-6 space-y-6 animate-fade-in">
        <div className="text-left mb-4">
            <h2 className="text-3xl font-bold text-white">Hola, Administrador</h2>
            <p className="text-md text-gray-400">Una vista rápida de las operaciones de Paritos.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <AdminCard 
                onClick={() => setView('Restaurantes')}
                icon={<BuildingStorefrontIcon className="w-12 h-12" />}
                title="Restaurantes"
                description="Añade o edita los locales afiliados"
            />
            <AdminCard 
                onClick={() => setView('Pedidos')}
                icon={<OrdersIcon className="w-12 h-12" />}
                title="Pedidos"
                description="Monitorea las órdenes activas y pasadas"
                notification={activeOrders}
            />
            <AdminCard 
                onClick={() => setView('Mensajeros')}
                icon={<TruckIcon className="w-12 h-12" />}
                title="Mensajeros"
                description="Gestiona tu flota de repartidores"
                badge={`${availableCouriers} disponibles`}
            />
            <AdminCard 
                onClick={() => setView('Analíticas')}
                icon={<ChartBarIcon className="w-12 h-12" />}
                title="Analíticas"
                description="Visualiza datos de ventas y rendimiento"
            />
            <AdminCard 
                onClick={() => setView('Entregas')}
                icon={<MapPinIcon className="w-12 h-12" />}
                title="Entregas"
                description="Sigue a los mensajeros en tiempo real"
            />
        </div>
        
        <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
                 <h3 className="text-2xl font-bold text-white">Entregas Activas</h3>
                 <button onClick={() => setView('Entregas')} className="text-sm font-semibold text-[#FFDF00] hover:underline">
                    Ver mapa completo &rarr;
                </button>
            </div>
            <div className="bg-[#1e1e1e] rounded-lg h-72 relative shadow-lg overflow-hidden group">
                <img 
                    src="https://www.mapquestapi.com/staticmap/v5/map?key=K1jmykG2aAXp15fA0deAblj2oA2U5g07&center=34.0522,-118.2437&zoom=12&size=800,400@2x&type=dark" 
                    alt="Mapa de entregas" 
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent"></div>
                
                {activeDeliveries.length > 0 ? (
                    activeDeliveries.map((order, index) => {
                        const courier = getCourier(order.courierId);
                        if (!courier) return null;
                        const position = markerPositions[index % markerPositions.length];
                        return (
                            <div 
                                key={order.id}
                                className="absolute transform -translate-x-1/2 -translate-y-full flex flex-col items-center cursor-pointer group"
                                style={{ top: position.top, left: position.left }}
                                title={`${courier.name} - Pedido #${order.id.toString().slice(-4)}`}
                            >
                                <div className="px-2 py-1 bg-[#181818] border-2 border-blue-400 rounded-lg text-white text-xs font-bold shadow-lg transition-transform duration-200 group-hover:scale-110 group-hover:border-[#FFDF00] group-hover:z-10">
                                    {courier.name.split(' ')[0]}
                                </div>
                                <MapPinIcon className="w-8 h-8 text-blue-400 drop-shadow-lg group-hover:text-[#FFDF00] transition-colors duration-200" />
                                <div className="w-3 h-3 bg-blue-400 rounded-full -mt-2 opacity-50 shadow-md animate-pulse group-hover:bg-[#FFDF00]"></div>
                            </div>
                        );
                    })
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-gray-400 bg-black/50 px-4 py-2 rounded-lg">No hay entregas en curso.</p>
                    </div>
                )}
                 <div 
                    onClick={() => setView('Entregas')}
                    className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer"
                >
                    <span className="text-white font-bold text-lg bg-[#FFDF00] text-[#181818] px-6 py-3 rounded-lg shadow-2xl">
                        Abrir Monitor de Entregas
                    </span>
                 </div>
            </div>
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
        <div className="flex items-center space-x-2">
            <button className="p-2 rounded-full hover:bg-[#2a2a2a] transition-colors transition-transform duration-200 hover:scale-110" aria-label="Buscar">
                <SearchIcon className="w-6 h-6 text-gray-300" />
            </button>
            <button onClick={onNotificationsClick} className="relative p-2 rounded-full hover:bg-[#2a2a2a] transition-colors transition-transform duration-200 hover:scale-110" aria-label="Ver notificaciones">
                <BellIcon className="w-6 h-6 text-gray-300" />
                {notificationCount > 0 && (
                    <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center border-2 border-[#181818]">
                        {notificationCount}
                    </span>
                )}
            </button>
            <button className="p-2 rounded-full hover:bg-[#2a2a2a] transition-colors transition-transform duration-200 hover:scale-110" aria-label="Abrir menú">
                <MenuIcon className="w-6 h-6 text-gray-300" />
            </button>
        </div>
      </header>

      {currentView === 'Dashboard' && <DashboardHome />}
      {currentView === 'Restaurantes' && <ManageRestaurants onBack={() => setView('Dashboard')} restaurants={restaurants} onSave={onSaveRestaurant} onDelete={onDeleteRestaurant} allCategories={allCategories}/>}
      {currentView === 'Pedidos' && <ManageOrders onBack={() => setView('Dashboard')} orders={orders} onUpdateOrderStatus={onUpdateOrderStatus} />}
      {currentView === 'Mensajeros' && <ManageCouriers onBack={() => setView('Dashboard')} couriers={couriers} onSave={onSaveCourier} onDelete={onDeleteCourier} />}
      {currentView === 'Analíticas' && <ManageAnalytics onBack={() => setView('Dashboard')} orders={orders} restaurants={restaurants} couriers={couriers} />}
      {currentView === 'Entregas' && <MonitorDeliveries onBack={() => setView('Dashboard')} orders={orders} couriers={couriers} />}
      <style>{`
        @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default AdminDashboard;