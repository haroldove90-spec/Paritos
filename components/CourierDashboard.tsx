import React, { useState } from 'react';
import { MenuIcon } from './icons/MenuIcon';
import type { Order, OrderStatus, Courier, CourierStatus } from '../types';
import MapView from './courier/MapView';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

interface CourierDashboardProps {
    orders: Order[];
    onUpdateStatus: (orderId: number, status: OrderStatus, courierId?: number) => void;
    couriers: Courier[];
    onUpdateCourierStatus: (courierId: number, status: CourierStatus) => void;
}

const MOCK_COURIER_ID = 1; // Simulate being logged in as courier with ID 1

const CourierDashboard: React.FC<CourierDashboardProps> = ({ orders, onUpdateStatus, couriers, onUpdateCourierStatus }) => {
  const [isMapVisible, setMapVisible] = useState(false);
  const [isStatusMenuOpen, setStatusMenuOpen] = useState(false);
    
  const currentCourier = couriers.find(c => c.id === MOCK_COURIER_ID);
  const activeOrder = orders.find(o => o.courierId === MOCK_COURIER_ID && o.status === 'en_camino');
  const readyForPickupOrders = orders.filter(o => o.status === 'en_preparacion' && !o.courierId);
  const pendingOrders = orders.filter(o => o.status === 'pendiente');
  
  const statusMap: { [key in CourierStatus]: { text: string; color: string; dot: string } } = {
      disponible: { text: 'Disponible', color: 'text-green-400', dot: 'bg-green-400' },
      en_entrega: { text: 'En Entrega', color: 'text-blue-400', dot: 'bg-blue-400' },
      desconectado: { text: 'Desconectado', color: 'text-gray-500', dot: 'bg-gray-500' },
  };
  const statuses: CourierStatus[] = ['disponible', 'en_entrega', 'desconectado'];


  return (
    <div className="flex flex-col h-full text-white">
       <header className="flex-shrink-0 flex justify-between items-center p-4 bg-[#181818] border-b border-[#3A3D42]/50">
        <div>
            <h1 className="font-bold text-xl text-white">Dashboard Mensajero</h1>
             {currentCourier && (
                <div className="relative inline-block mt-1">
                    <button
                        onClick={() => setStatusMenuOpen(!isStatusMenuOpen)}
                        className="flex items-center space-x-2 px-3 py-1 bg-[#2a2a2a] rounded-full hover:bg-[#3a3a3a] transition-colors"
                        aria-haspopup="true"
                        aria-expanded={isStatusMenuOpen}
                    >
                        <div className={`w-2.5 h-2.5 rounded-full ${statusMap[currentCourier.status].dot}`}></div>
                        <span className={`text-sm font-semibold ${statusMap[currentCourier.status].color}`}>
                            {statusMap[currentCourier.status].text}
                        </span>
                        <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform ${isStatusMenuOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isStatusMenuOpen && (
                        <div className="absolute top-full left-0 mt-2 w-40 bg-[#1e1e1e] border border-[#3A3D42] rounded-lg shadow-lg z-10 animate-fade-in-fast">
                            {statuses.map(status => (
                                <button
                                    key={status}
                                    onClick={() => {
                                        onUpdateCourierStatus(MOCK_COURIER_ID, status);
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
            )}
        </div>
        <button className="transition-transform duration-200 hover:scale-110"><MenuIcon className="w-6 h-6 text-white" /></button>
      </header>

      <main className="flex-grow overflow-y-auto p-4 space-y-6">
        <div>
            <h2 className="text-lg font-semibold text-[#FFDF00] mb-3">Pedido Activo</h2>
            {activeOrder ? (
                <div className="bg-[#2a2a2a] p-4 rounded-lg shadow-lg">
                    <div className="flex justify-between items-center">
                        <p className="font-bold">{activeOrder.items[0]?.name} y más</p>
                        <p className="text-sm text-gray-300">ID: #{activeOrder.id.toString().slice(-4)}</p>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">Total: ${activeOrder.total.toFixed(2)}</p>
                    <p className="text-sm text-gray-400 mt-1">Cliente: {activeOrder.customerName}</p>
                    <p className="text-sm text-gray-400 mt-1">Dirección: Av. Siempre Viva 123</p>
                    <div className="flex space-x-2 mt-4">
                        <button onClick={() => setMapVisible(true)} className="w-full bg-[#3A3D42] text-white font-bold py-2 rounded-lg hover:bg-[#4a4d52] transition-colors">
                            Ver en Mapa
                        </button>
                        <button 
                            onClick={() => onUpdateStatus(activeOrder.id, 'entregado')}
                            className="w-full bg-[#FFDF00] text-[#181818] font-bold py-2 rounded-lg transform hover:scale-105 transition-transform duration-200"
                        >
                            Marcar Entregado
                        </button>
                    </div>
                </div>
            ) : (
                <div className="bg-[#2a2a2a] p-4 rounded-lg text-center text-gray-400">
                    No tienes ningún pedido activo.
                </div>
            )}
        </div>

        <div>
            <h2 className="text-lg font-semibold text-gray-300 mb-3">Listo para Recoger ({readyForPickupOrders.length})</h2>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {readyForPickupOrders.length > 0 ? (
                    readyForPickupOrders.map(order => (
                         <div key={order.id} className="bg-[#1e1e1e] p-4 rounded-lg flex justify-between items-center">
                            <div>
                                <p className="font-bold">{order.items[0]?.name} y más</p>
                                <p className="text-sm text-gray-400">${order.total.toFixed(2)}</p>
                            </div>
                            <button 
                                onClick={() => onUpdateStatus(order.id, 'en_camino', MOCK_COURIER_ID)}
                                disabled={!!activeOrder || currentCourier?.status !== 'disponible'}
                                className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
                            >
                                Iniciar Entrega
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="bg-[#1e1e1e] p-4 rounded-lg text-center text-gray-400">
                        No hay pedidos listos para recoger.
                    </div>
                )}
            </div>
        </div>

        <div>
            <h2 className="text-lg font-semibold text-gray-300 mb-3">Pedidos Pendientes ({pendingOrders.length})</h2>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {pendingOrders.length > 0 ? (
                    pendingOrders.map(order => (
                         <div key={order.id} className="bg-[#1e1e1e] p-4 rounded-lg flex justify-between items-center">
                            <div>
                                <p className="font-bold">{order.items[0]?.name} y más</p>
                                <p className="text-sm text-gray-400">${order.total.toFixed(2)} • A 1.2km</p>
                            </div>
                            <button 
                                onClick={() => onUpdateStatus(order.id, 'en_preparacion')}
                                disabled={!!activeOrder || currentCourier?.status !== 'disponible'}
                                className="bg-[#FFDF00] text-[#181818] font-bold py-2 px-4 rounded-lg hover:scale-105 transition-transform duration-200 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:scale-100"
                            >
                                Aceptar
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="bg-[#1e1e1e] p-4 rounded-lg text-center text-gray-400">
                        No hay pedidos pendientes.
                    </div>
                )}
            </div>
        </div>
      </main>
      {isMapVisible && activeOrder && <MapView order={activeOrder} onClose={() => setMapVisible(false)} />}
       <style>{`
        @keyframes fade-in-fast {
            from { opacity: 0; transform: translateY(-5px) scale(0.98); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in-fast { animation: fade-in-fast 0.2s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default CourierDashboard;