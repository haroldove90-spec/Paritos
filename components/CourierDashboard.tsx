import React, { useState, useMemo } from 'react';
import type { Order, OrderStatus, Courier, CourierStatus, Session } from '../types';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { MapPinIcon } from './icons/MapPinIcon';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { TruckIcon } from './icons/TruckIcon';
import { StarIcon } from './icons/StarIcon';
import { CurrencyDollarIcon } from './icons/CurrencyDollarIcon';
import { OrdersIcon } from './icons/OrdersIcon';
import { ChartBarIcon } from './icons/ChartBarIcon';
import DeliveryChart from './courier/DeliveryChart';

interface CourierDashboardProps {
    orders: Order[];
    onUpdateStatus: (orderId: number, status: OrderStatus, courierId?: number) => void;
    couriers: Courier[];
    onUpdateCourierStatus: (courierId: number, status: CourierStatus) => void;
    session: Session;
}

const MOCK_DELIVERY_FEE = 35; // Mock earnings per delivery

type CourierTab = 'Resumen' | 'Historial' | 'Rendimiento';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-[#2a2a2a] p-4 rounded-lg flex items-center space-x-3">
        <div className="bg-[#181818] p-3 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-400">{title}</p>
            <p className="text-xl font-bold text-white">{value}</p>
        </div>
    </div>
);

const CourierDashboard: React.FC<CourierDashboardProps> = ({ orders, onUpdateStatus, couriers, onUpdateCourierStatus, session }) => {
  const [isStatusMenuOpen, setStatusMenuOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState<number | null>(null);
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<CourierTab>('Resumen');
    
  const currentCourier = useMemo(() => {
    return couriers.find(c => c.user_id === session.user.id)
  }, [couriers, session.user.id]);
  
  // Memoized data calculations
  const { activeOrders, readyForPickupOrders, completedOrders } = useMemo(() => {
      if (!currentCourier) return { activeOrders: [], readyForPickupOrders: [], completedOrders: [] };
      const active = orders.filter(o => o.courierId === currentCourier.id && o.status === 'en_camino');
      const ready = orders.filter(o => o.status === 'listo_para_recoger' && !o.courierId);
      const completed = orders.filter(o => o.courierId === currentCourier.id && o.status === 'entregado').sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      return { activeOrders: active, readyForPickupOrders: ready, completedOrders: completed };
  }, [orders, currentCourier]);

  const { deliveriesToday, earningsToday } = useMemo(() => {
    const today = new Date().toDateString();
    const todayOrders = completedOrders.filter(o => new Date(o.date).toDateString() === today);
    return {
        deliveriesToday: todayOrders.length,
        earningsToday: todayOrders.length * MOCK_DELIVERY_FEE,
    };
  }, [completedOrders]);

  const chartData = useMemo(() => {
    const last7Days = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d;
    }).reverse();

    return last7Days.map(date => {
        const dayStr = date.toDateString();
        const dayShort = date.toLocaleDateString('es-ES', { weekday: 'short' }).replace('.', '');
        const count = completedOrders.filter(o => new Date(o.date).toDateString() === dayStr).length;
        return { label: dayShort.charAt(0).toUpperCase() + dayShort.slice(1), value: count };
    });
  }, [completedOrders]);

  const statusMap: { [key in CourierStatus]: { text: string; color: string; dot: string } } = {
      disponible: { text: 'Disponible', color: 'text-green-400', dot: 'bg-green-400' },
      en_entrega: { text: 'En Entrega', color: 'text-blue-400', dot: 'bg-blue-400' },
      desconectado: { text: 'Desconectado', color: 'text-gray-500', dot: 'bg-gray-500' },
  };
  const statuses: CourierStatus[] = ['disponible', 'en_entrega', 'desconectado'];

  const handleSelectOrder = (orderId: number) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) ? prev.filter(id => id !== orderId) : [...prev, orderId]
    );
  };

  const handleAcceptSelectedOrders = () => {
    if (!currentCourier) return;
    selectedOrders.forEach(id => {
        onUpdateStatus(id, 'en_camino', currentCourier.id);
    });
    setSelectedOrders([]);
  };

  const handleCopyAddress = (address: string, orderId: number) => {
      navigator.clipboard.writeText(address).then(() => {
          setCopyStatus(orderId);
          setTimeout(() => setCopyStatus(null), 2000);
      });
  }

  const handleOpenInMaps = (location: {latitude: number, longitude: number}) => {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}`;
      window.open(url, '_blank');
  }

  const renderContent = () => {
    switch (activeTab) {
        case 'Historial':
            return (
                <div className="space-y-4 animate-fade-in">
                    <h2 className="text-xl font-semibold text-white">Historial de Entregas ({completedOrders.length})</h2>
                    {completedOrders.length > 0 ? (
                        completedOrders.map(order => (
                             <div key={order.id} className="bg-[#1e1e1e] p-3 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="font-bold text-white">Pedido #{order.id.toString().slice(-4)}</p>
                                        <p className="text-xs text-gray-400">{new Date(order.date).toLocaleString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-green-400">+${MOCK_DELIVERY_FEE.toFixed(2)}</p>
                                        <p className="text-xs text-gray-500">Completado</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-[#1e1e1e] p-6 rounded-lg text-center text-gray-400">
                           <p>No has completado ninguna entrega.</p>
                        </div>
                    )}
                </div>
            );
        case 'Rendimiento':
            return (
                <div className="space-y-4 animate-fade-in">
                     <h2 className="text-xl font-semibold text-white">Rendimiento Semanal</h2>
                     <DeliveryChart data={chartData} title="Entregas en los últimos 7 días" />
                </div>
            );
        case 'Resumen':
        default:
            return (
                <div className="space-y-6 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <StatCard title="Ganancias de Hoy" value={`$${earningsToday.toFixed(2)}`} icon={<CurrencyDollarIcon className="w-6 h-6 text-[#FFDF00]" />} />
                        <StatCard title="Entregas de Hoy" value={deliveriesToday} icon={<TruckIcon className="w-6 h-6 text-blue-400" />} />
                        <StatCard title="Calificación" value={currentCourier?.rating || 'N/A'} icon={<StarIcon className="w-6 h-6 text-yellow-400" />} />
                    </div>

                    {/* Active Orders */}
                    <div>
                        <h2 className="text-lg font-semibold text-[#FFDF00] mb-3">Pedidos Activos ({activeOrders.length})</h2>
                        {activeOrders.length > 0 ? (
                            <div className="space-y-3">
                            {activeOrders.map(order => (
                                <div key={order.id} className="bg-[#2a2a2a] p-4 rounded-lg shadow-lg">
                                    <div className="flex justify-between items-center">
                                        <p className="font-bold">{order.items[0]?.name} y más</p>
                                        <p className="text-sm text-gray-300">ID: #{order.id.toString().slice(-4)}</p>
                                    </div>
                                    <p className="text-sm text-gray-400 mt-1">Total: ${order.total.toFixed(2)}</p>
                                    <p className="text-sm text-gray-400 mt-1">Cliente: {order.customerName}</p>
                                    
                                    <div className="mt-2 p-3 bg-[#1e1e1e] rounded-md">
                                        <p className="text-sm font-semibold text-gray-300">Dirección de entrega:</p>
                                        <p className="text-md text-white">{order.customerAddress}</p>
                                    </div>

                                    <div className="flex space-x-2 mt-4">
                                        {order.customerLocation ? (
                                            <button onClick={() => handleOpenInMaps(order.customerLocation!)} className="w-full bg-blue-500 text-white font-bold py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2">
                                                <MapPinIcon className="w-5 h-5"/>
                                                <span>Abrir en Maps</span>
                                            </button>
                                        ) : (
                                            <button onClick={() => handleCopyAddress(order.customerAddress, order.id)} className="w-full bg-[#3A3D42] text-white font-bold py-2 rounded-lg hover:bg-[#4a4d52] transition-colors flex items-center justify-center space-x-2">
                                                <ClipboardIcon className="w-5 h-5"/>
                                                <span>{copyStatus === order.id ? '¡Copiado!' : 'Copiar'}</span>
                                            </button>
                                        )}
                                    
                                        <button 
                                            onClick={() => onUpdateStatus(order.id, 'entregado')}
                                            className="w-full bg-[#FFDF00] text-[#181818] font-bold py-2 rounded-lg transform hover:scale-105 transition-transform duration-200"
                                        >
                                            Marcar Entregado
                                        </button>
                                    </div>
                                </div>
                            ))}
                            </div>
                        ) : (
                            <div className="bg-[#2a2a2a] p-4 rounded-lg text-center text-gray-400">
                                No tienes ningún pedido activo.
                            </div>
                        )}
                    </div>
                    {/* Ready for Pickup */}
                    <div>
                        <div className="flex justify-between items-center mb-3">
                             <h2 className="text-lg font-semibold text-gray-300">Listo para Recoger ({readyForPickupOrders.length})</h2>
                             {readyForPickupOrders.length > 0 && selectedOrders.length > 0 && (
                                 <button
                                    onClick={handleAcceptSelectedOrders}
                                    disabled={selectedOrders.length === 0 || currentCourier?.status === 'desconectado'}
                                    className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
                                >
                                    Aceptar ({selectedOrders.length})
                                </button>
                             )}
                        </div>
                        <div className="space-y-3">
                            {readyForPickupOrders.length > 0 ? (
                                readyForPickupOrders.map(order => (
                                    <label key={order.id} htmlFor={`order-${order.id}`} className={`bg-[#1e1e1e] p-4 rounded-lg flex items-center cursor-pointer transition-all duration-200 ${selectedOrders.includes(order.id) ? 'ring-2 ring-[#FFDF00]' : 'ring-2 ring-transparent'}`}>
                                        <input
                                            id={`order-${order.id}`}
                                            type="checkbox"
                                            checked={selectedOrders.includes(order.id)}
                                            onChange={() => handleSelectOrder(order.id)}
                                            disabled={currentCourier?.status === 'desconectado'}
                                            className="h-5 w-5 rounded border-gray-500 bg-[#3A3D42] text-[#FFDF00] focus:ring-[#FFDF00] focus:ring-offset-0 mr-4"
                                        />
                                        <div className="flex-grow">
                                            <p className="font-bold">{order.items[0]?.name} y más</p>
                                            <p className="text-sm text-gray-400">${order.total.toFixed(2)}</p>
                                        </div>
                                    </label>
                                ))
                            ) : (
                                <div className="bg-[#1e1e1e] p-4 rounded-lg text-center text-gray-400">
                                    No hay pedidos listos para recoger.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )
    }
  };
  
  if (!currentCourier) {
      return (
          <div className="flex flex-col h-full text-white items-center justify-center p-4 text-center">
              <h1 className="text-2xl font-bold text-[#FFDF00]">Perfil de Mensajero no encontrado</h1>
              <p className="text-gray-400 mt-2">No pudimos encontrar un perfil de mensajero asociado a tu cuenta.</p>
              <p className="text-sm text-gray-500 mt-1">Contacta a soporte si crees que esto es un error.</p>
          </div>
      );
  }

  return (
    <div className="flex flex-col h-full text-white">
       <header className="flex-shrink-0 flex justify-between items-center p-4 bg-[#181818] border-b border-[#3A3D42]/50">
        <div className="flex items-center space-x-3">
            <img src={currentCourier.imageUrl} alt={currentCourier.name} className="w-10 h-10 rounded-full object-cover" />
            <div>
                <h1 className="font-bold text-lg text-white leading-tight">{currentCourier.name}</h1>
                <div className="relative inline-block">
                    <button
                        onClick={() => setStatusMenuOpen(!isStatusMenuOpen)}
                        className="flex items-center space-x-1.5"
                        aria-haspopup="true"
                        aria-expanded={isStatusMenuOpen}
                    >
                        <div className={`w-2 h-2 rounded-full ${statusMap[currentCourier.status].dot}`}></div>
                        <span className={`text-xs font-semibold ${statusMap[currentCourier.status].color}`}>
                            {statusMap[currentCourier.status].text}
                        </span>
                        <ChevronDownIcon className={`w-3 h-3 text-gray-400 transition-transform ${isStatusMenuOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isStatusMenuOpen && (
                        <div className="absolute top-full left-0 mt-2 w-40 bg-[#1e1e1e] border border-[#3A3D42] rounded-lg shadow-lg z-10 animate-fade-in-fast">
                            {statuses.map(status => (
                                <button
                                    key={status}
                                    onClick={() => {
                                        onUpdateCourierStatus(currentCourier.id, status);
                                        setStatusMenuOpen(false);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-[#3a3a3a] flex items-center space-x-2 first:rounded-t-lg last:rounded-b-lg"
                                >
                                    <div className={`w-2 h-2 rounded-full ${statusMap[status].dot}`}></div>
                                    <span>{statusMap[status].text}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
        <div className="bg-[#2a2a2a] p-1 rounded-full text-white text-xs font-bold flex items-center justify-center animate-pulse">
            <span className="bg-red-500 w-2 h-2 rounded-full mr-2"></span>
            EN VIVO
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="flex-shrink-0 bg-[#181818] border-b border-[#3A3D42]/50">
        <div className="grid grid-cols-3">
            {(['Resumen', 'Historial', 'Rendimiento'] as CourierTab[]).map(tab => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-3 text-sm font-bold border-b-2 transition-colors duration-200 ${activeTab === tab ? 'text-[#FFDF00] border-[#FFDF00]' : 'text-gray-400 border-transparent hover:text-white'}`}
                >
                    {tab}
                </button>
            ))}
        </div>
      </nav>

      <main className="flex-grow overflow-y-auto p-4">
        {renderContent()}
      </main>

       <style>{`
        @keyframes fade-in-fast {
            from { opacity: 0; transform: translateY(-5px) scale(0.98); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in-fast { animation: fade-in-fast 0.2s ease-out forwards; }
        @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.4s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default CourierDashboard;