import React from 'react';
import { MenuIcon } from './icons/MenuIcon';
import type { Order, OrderStatus } from '../types';

interface CourierDashboardProps {
    orders: Order[];
    onUpdateStatus: (orderId: number, status: OrderStatus) => void;
}

const CourierDashboard: React.FC<CourierDashboardProps> = ({ orders, onUpdateStatus }) => {
    
  const activeOrder = orders.find(o => o.status === 'out_for_delivery');
  const pendingOrders = orders.filter(o => o.status === 'pending_pickup');

  return (
    <div className="flex flex-col h-full text-white">
       <header className="flex-shrink-0 flex justify-between items-center p-4 bg-[#181818] border-b border-[#3A3D42]/50">
        <div>
            <h1 className="font-bold text-xl text-white">Dashboard Mensajero</h1>
            <p className="text-sm text-gray-400">Mis Pedidos y Envíos</p>
        </div>
        <button><MenuIcon className="w-6 h-6 text-white" /></button>
      </header>

      <main className="flex-grow overflow-y-auto p-4 space-y-6 md:space-y-0 md:grid md:grid-cols-2 md:gap-6">
        <div>
            <h2 className="text-lg font-semibold text-[#FFDF00] mb-3">Pedido Activo</h2>
            {activeOrder ? (
                <div className="bg-[#2a2a2a] p-4 rounded-lg shadow-lg">
                    <div className="flex justify-between items-center">
                        <p className="font-bold">{activeOrder.items[0]?.name} y más</p>
                        <p className="text-sm text-gray-300">ID: #{activeOrder.id.toString().slice(-4)}</p>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">Total: ${activeOrder.total.toFixed(2)}</p>
                    <p className="text-sm text-gray-400 mt-1">Dirección: Av. Siempre Viva 123</p>
                    <div className="flex space-x-2 mt-4">
                        <button className="w-full bg-[#3A3D42] text-white font-bold py-2 rounded-lg hover:bg-[#4a4d52] transition-colors">
                            Ver en Mapa
                        </button>
                        <button 
                            onClick={() => onUpdateStatus(activeOrder.id, 'delivered')}
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
            <h2 className="text-lg font-semibold text-gray-300 mb-3">Pedidos Pendientes ({pendingOrders.length})</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {pendingOrders.length > 0 ? (
                    pendingOrders.map(order => (
                         <div key={order.id} className="bg-[#1e1e1e] p-4 rounded-lg flex justify-between items-center">
                            <div>
                                <p className="font-bold">{order.items[0]?.name} y más</p>
                                <p className="text-sm text-gray-400">${order.total.toFixed(2)} • A 1.2km</p>
                            </div>
                            <button 
                                onClick={() => onUpdateStatus(order.id, 'out_for_delivery')}
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
    </div>
  );
};

export default CourierDashboard;
