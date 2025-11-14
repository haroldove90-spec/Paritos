import React, { useState } from 'react';
import { MenuIcon } from './icons/MenuIcon';
import type { Order, OrderStatus } from '../types';
import MapView from './courier/MapView';

interface CourierDashboardProps {
    orders: Order[];
    onUpdateStatus: (orderId: number, status: OrderStatus, courierId?: number) => void;
}

const MOCK_COURIER_ID = 1; // Simulate being logged in as courier with ID 1

const CourierDashboard: React.FC<CourierDashboardProps> = ({ orders, onUpdateStatus }) => {
  const [isMapVisible, setMapVisible] = useState(false);
    
  const activeOrder = orders.find(o => o.courierId === MOCK_COURIER_ID && o.status === 'en_camino');
  const readyForPickupOrders = orders.filter(o => o.status === 'en_preparacion');
  const pendingOrders = orders.filter(o => o.status === 'pendiente');


  return (
    <div className="flex flex-col h-full text-white">
       <header className="flex-shrink-0 flex justify-between items-center p-4 bg-[#181818] border-b border-[#3A3D42]/50">
        <div>
            <h1 className="font-bold text-xl text-white">Dashboard Mensajero</h1>
            <p className="text-sm text-gray-400">Mis Pedidos y Envíos</p>
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
                                disabled={!!activeOrder}
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
                                disabled={!!activeOrder}
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
    </div>
  );
};

export default CourierDashboard;