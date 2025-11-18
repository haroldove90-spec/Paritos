import React, { useMemo } from 'react';
import { HomeIcon } from './icons/HomeIcon';
import { BuildingStorefrontIcon } from './icons/BuildingStorefrontIcon';
import { OrdersIcon } from './icons/OrdersIcon';
import { TruckIcon } from './icons/TruckIcon';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { MapPinIcon } from './icons/MapPinIcon';
import { CurrencyDollarIcon } from './icons/CurrencyDollarIcon';
import { TagIcon } from './icons/TagIcon';
import { PhotoIcon } from './icons/PhotoIcon';

import ManageRestaurants from './admin/ManageRestaurants';
import ManageOrders from './admin/ManageOrders';
import ManageCouriers from './admin/ManageCouriers';
import ManageAnalytics from './admin/ManageAnalytics';
import MonitorDeliveries from './admin/MonitorDeliveries';
import ManageProducts from './admin/ManageProducts';
import AdminSalesChart from './admin/AdminSalesChart';
import ManageMedia from './admin/ManageMedia';
import type { Restaurant, Order, Courier, OrderStatus, MenuItem, MediaItem, CourierApplication } from '../types';

type AdminView = 'Dashboard' | 'Restaurantes' | 'Pedidos' | 'Mensajeros' | 'Analíticas' | 'Entregas' | 'Productos' | 'Media';

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
    onSaveProduct: (product: MenuItem, restaurantId: number) => void;
    onDeleteProduct: (productId: number, restaurantId: number) => void;
    notificationCount: number;
    onNotificationsClick: () => void;
    allCategories: string[];
    mediaLibrary: MediaItem[];
    onFileUpload: (file: File) => Promise<string | null>;
    onDeleteMedia: (mediaName: string) => void;
    courierApplications: CourierApplication[];
    onApproveApplication: (app: CourierApplication) => void;
    onRejectApplication: (app: CourierApplication) => void;
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-[#1e1e1e] p-4 rounded-lg shadow-md flex items-center space-x-4">
        <div className="bg-[#2a2a2a] p-3 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    </div>
);

const AdminNav: React.FC<{ currentView: AdminView, setView: (view: AdminView) => void }> = ({ currentView, setView }) => {
    const navItems = [
        { id: 'Dashboard', label: 'Dashboard', icon: HomeIcon },
        { id: 'Pedidos', label: 'Pedidos', icon: OrdersIcon },
        { id: 'Restaurantes', label: 'Restaurantes', icon: BuildingStorefrontIcon },
        { id: 'Productos', label: 'Productos', icon: TagIcon },
        { id: 'Mensajeros', label: 'Mensajeros', icon: TruckIcon },
        { id: 'Analíticas', label: 'Analíticas', icon: ChartBarIcon },
        { id: 'Media', label: 'Media', icon: PhotoIcon },
    ];

    return (
        <nav className="flex-shrink-0 bg-[#1e1e1e] border-t border-[#3A3D42]/50">
            <div className="w-full max-w-6xl mx-auto flex justify-around items-center h-20">
                {navItems.map(item => {
                    const isActive = currentView === item.id;
                    const Icon = item.icon;
                    return (
                        <button 
                            key={item.id}
                            onClick={() => setView(item.id as AdminView)}
                            className={`flex flex-col items-center justify-center space-y-1 flex-1 relative transition-colors duration-200 hover:text-white focus:outline-none ${isActive ? 'text-[#FFDF00]' : 'text-gray-400'}`}
                        >
                            <Icon className="w-6 h-6" />
                            <span className="text-xs font-semibold">{item.label}</span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};

const DashboardContent: React.FC<{
    orders: Order[];
    restaurants: Restaurant[];
    setView: (view: AdminView) => void;
}> = ({ orders, restaurants, setView }) => {
    const { 
        todaySales, 
        todayOrdersCount, 
        avgTicket,
        salesChartData,
        recentOrders
    } = useMemo(() => {
        const today = new Date().toDateString();
        
        const todaysOrders = orders.filter(o => new Date(o.date).toDateString() === today);
        const todaySales = todaysOrders.reduce((sum, order) => sum + order.total, 0);
        const todayOrdersCount = todaysOrders.length;
        const avgTicket = todayOrdersCount > 0 ? todaySales / todayOrdersCount : 0;

        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d;
        }).reverse();

        const salesChartData = last7Days.map(date => {
            const dayStr = date.toDateString();
            const dayShort = date.toLocaleDateString('es-ES', { weekday: 'short' }).replace('.', '');
            const total = orders
                .filter(o => new Date(o.date).toDateString() === dayStr)
                .reduce((sum, o) => sum + o.total, 0);
            return { label: dayShort.charAt(0).toUpperCase() + dayShort.slice(1), value: total };
        });

        const recentOrders = [...orders].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

        return { todaySales, todayOrdersCount, avgTicket, salesChartData, recentOrders };
    }, [orders]);

    return (
        <main className="flex-grow overflow-y-auto p-4 md:p-6 space-y-6">
            <div className="text-left">
                <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                <p className="text-md text-gray-400">Resumen de la operación de hoy.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard title="Ventas de Hoy" value={`$${todaySales.toFixed(2)}`} icon={<CurrencyDollarIcon className="w-6 h-6 text-green-400"/>} />
                <StatCard title="Pedidos de Hoy" value={todayOrdersCount} icon={<OrdersIcon className="w-6 h-6 text-blue-400"/>} />
                <StatCard title="Ticket Promedio" value={`$${avgTicket.toFixed(2)}`} icon={<ChartBarIcon className="w-6 h-6 text-yellow-400"/>} />
            </div>

            <AdminSalesChart data={salesChartData} title="Ventas de la Semana" />

            <div className="bg-[#1e1e1e] p-4 sm:p-6 rounded-lg shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-white">Pedidos Recientes</h3>
                    <button onClick={() => setView('Pedidos')} className="text-sm font-semibold text-[#FFDF00] hover:underline">
                        Ver todos &rarr;
                    </button>
                </div>
                <div className="space-y-3">
                    {recentOrders.length > 0 ? recentOrders.map(order => (
                         <div key={order.id} className="flex justify-between items-center bg-[#2a2a2a] p-3 rounded-md">
                            <div>
                                <p className="font-semibold text-white">Pedido #{order.id.toString().slice(-4)}</p>
                                <p className="text-xs text-gray-400">{order.customerName}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-white">${order.total.toFixed(2)}</p>
                                <p className="text-xs text-gray-400">{order.status}</p>
                            </div>
                        </div>
                    )) : (
                        <p className="text-center text-gray-400 py-4">No hay pedidos recientes.</p>
                    )}
                </div>
            </div>
             <div className="text-center mt-4">
                 <button onClick={() => setView('Analíticas')} className="bg-[#2a2a2a] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#3a3a3a] transition-colors">
                    Ver Analíticas Detalladas
                </button>
            </div>
        </main>
    );
};

const AdminDashboard: React.FC<AdminDashboardProps> = (props) => {
  const { currentView, setView } = props;

  const renderContent = () => {
    switch (currentView) {
        case 'Restaurantes':
            return <ManageRestaurants 
                        restaurants={props.restaurants} 
                        onSave={props.onSaveRestaurant} 
                        onDelete={props.onDeleteRestaurant} 
                        allCategories={props.allCategories}
                        mediaLibrary={props.mediaLibrary}
                        onFileUpload={props.onFileUpload}
                    />;
        case 'Pedidos':
            return <ManageOrders orders={props.orders} onUpdateOrderStatus={props.onUpdateOrderStatus} />;
        case 'Mensajeros':
            return <ManageCouriers 
                        couriers={props.couriers} 
                        onSave={props.onSaveCourier} 
                        onDelete={props.onDeleteCourier}
                        applications={props.courierApplications}
                        onApprove={props.onApproveApplication}
                        onReject={props.onRejectApplication}
                    />;
        case 'Analíticas':
            return <ManageAnalytics orders={props.orders} restaurants={props.restaurants} couriers={props.couriers} />;
        case 'Productos':
            return <ManageProducts 
                        restaurants={props.restaurants} 
                        onSaveProduct={props.onSaveProduct} 
                        onDeleteProduct={props.onDeleteProduct}
                        mediaLibrary={props.mediaLibrary}
                        onFileUpload={props.onFileUpload}
                    />;
        case 'Entregas':
            return <MonitorDeliveries orders={props.orders} couriers={props.couriers} />;
        case 'Media':
            return <ManageMedia 
                        mediaLibrary={props.mediaLibrary}
                        onUpload={props.onFileUpload}
                        onDelete={props.onDeleteMedia}
                    />;
        case 'Dashboard':
        default:
            return <DashboardContent orders={props.orders} restaurants={props.restaurants} setView={setView} />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#181818] text-white">
      <div className="flex-grow overflow-y-auto pb-20">
          {renderContent()}
      </div>
      <div className="fixed bottom-0 left-0 right-0 z-20">
         <AdminNav currentView={currentView} setView={setView} />
      </div>
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