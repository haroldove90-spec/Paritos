import React, { useState } from 'react';
import type { Order, Courier } from '../../types';
import { MapPinIcon } from '../icons/MapPinIcon';
import { XIcon } from '../icons/XIcon';

interface MonitorDeliveriesProps {
    onBack: () => void;
    orders: Order[];
    couriers: Courier[];
}

// Mock positions for markers on the map
const markerPositions = [
    { top: '30%', left: '40%' },
    { top: '55%', left: '60%' },
    { top: '45%', left: '25%' },
    { top: '65%', left: '35%' },
    { top: '25%', left: '70%' },
];

const MonitorDeliveries: React.FC<MonitorDeliveriesProps> = ({ onBack, orders, couriers }) => {
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const activeDeliveries = orders.filter(o => o.status === 'en_camino');

    const getCourier = (courierId: number | null) => {
        if (!courierId) return null;
        return couriers.find(c => c.id === courierId) || null;
    };

    return (
        <main className="flex-grow overflow-hidden p-6 flex flex-col">
            <div className="flex-shrink-0 mb-6">
                <button onClick={onBack} className="text-sm text-[#FFDF00] hover:underline mb-1">&larr; Volver al Panel</button>
                <h2 className="text-2xl font-bold text-white">Monitoreo de Entregas en Tiempo Real</h2>
            </div>

            <div className="flex-grow flex flex-col md:flex-row gap-6 overflow-hidden">
                {/* Map Section */}
                <div className="md:w-2/3 h-64 md:h-full bg-[#1e1e1e] rounded-lg overflow-hidden relative shadow-lg">
                    <img 
                        src="https://www.mapquestapi.com/staticmap/v5/map?key=K1jmykG2aAXp15fA0deAblj2oA2U5g07&center=34.0522,-118.2437&zoom=12&size=1200,800@2x&type=dark" 
                        alt="Mapa de la ciudad" 
                        className="w-full h-full object-cover"
                    />
                    
                    {/* Markers */}
                    {activeDeliveries.map((order, index) => {
                        const courier = getCourier(order.courierId);
                        if (!courier) return null;

                        const position = markerPositions[index % markerPositions.length];
                        const isSelected = selectedOrder?.id === order.id;

                        return (
                            <button 
                                key={order.id}
                                onClick={() => setSelectedOrder(order)}
                                className="absolute transform -translate-x-1/2 -translate-y-full flex flex-col items-center group cursor-pointer"
                                style={{ top: position.top, left: position.left }}
                                aria-label={`Ver detalles de entrega de ${courier.name}`}
                            >
                                <div className={`relative px-3 py-1 bg-[#181818] border-2 ${isSelected ? 'border-[#FFDF00]' : 'border-gray-500'} rounded-lg text-white text-xs font-bold shadow-lg transition-all duration-200 group-hover:scale-110 group-hover:border-[#FFDF00]`}>
                                    {courier.name}
                                    <div className="absolute left-1/2 -bottom-2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-current transform -translate-x-1/2"></div>
                                </div>
                                <MapPinIcon className={`w-8 h-8 mt-1 transition-colors duration-200 ${isSelected ? 'text-[#FFDF00]' : 'text-blue-400'} group-hover:text-[#FFDF00]`} />
                                <div className="w-3 h-3 bg-current rounded-full -mt-2 opacity-50"></div>
                            </button>
                        );
                    })}

                    {/* Popup/Modal for selected order */}
                    {selectedOrder && (
                        <div className="absolute top-4 left-4 bg-[#1e1e1e]/90 backdrop-blur-sm rounded-lg p-4 w-72 shadow-2xl border border-gray-700 animate-fade-in-fast">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-lg text-[#FFDF00]">Pedido #{selectedOrder.id.toString().slice(-4)}</h3>
                                    <p className="text-sm text-gray-300">Mensajero: {getCourier(selectedOrder.courierId)?.name}</p>
                                </div>
                                <button onClick={() => setSelectedOrder(null)} className="p-1 rounded-full hover:bg-gray-700">
                                    <XIcon className="w-5 h-5 text-gray-400"/>
                                </button>
                            </div>
                            <div className="mt-3 border-t border-gray-700 pt-3 text-sm space-y-1">
                                <p className="text-gray-400">Cliente: <span className="font-semibold text-white">{selectedOrder.customerName}</span></p>
                                <p className="text-gray-400">Total: <span className="font-semibold text-white">${selectedOrder.total.toFixed(2)}</span></p>
                                <p className="text-gray-400">Destino: <span className="font-semibold text-white">Av. Siempre Viva 123</span></p>
                            </div>
                        </div>
                    )}
                </div>

                {/* List Section */}
                <div className="md:w-1/3 flex flex-col">
                    <h3 className="text-lg font-semibold text-white mb-3 flex-shrink-0">
                        Entregas Activas ({activeDeliveries.length})
                    </h3>
                    <div className="flex-grow bg-[#1e1e1e] rounded-lg overflow-y-auto p-4 space-y-4">
                        {activeDeliveries.length > 0 ? (
                            activeDeliveries.map(order => (
                                <div 
                                    key={order.id} 
                                    onClick={() => setSelectedOrder(order)}
                                    className={`bg-[#2a2a2a] p-3 rounded-lg animate-fade-in cursor-pointer transition-all duration-200 hover:bg-[#3a3a3a] ${selectedOrder?.id === order.id ? 'ring-2 ring-[#FFDF00]' : ''}`}
                                >
                                    <div className="flex justify-between items-center">
                                        <p className="font-bold text-white">Pedido #{order.id.toString().slice(-4)}</p>
                                        <p className="text-xs text-blue-300 font-semibold bg-blue-500/20 px-2 py-1 rounded-full">En Camino</p>
                                    </div>
                                    <p className="text-sm text-gray-300 mt-1">
                                        <span className="font-semibold">Mensajero:</span> {getCourier(order.courierId)?.name || 'Desconocido'}
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        <span className="font-semibold">Cliente:</span> {order.customerName}
                                    </p>
                                     <div className="w-full bg-gray-600 rounded-full h-1.5 mt-3">
                                        <div className="bg-blue-400 h-1.5 rounded-full" style={{ width: '60%' }}></div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-gray-400 py-10">
                                <p>No hay entregas activas en este momento.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
             <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }

                @keyframes fade-in-fast {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fade-in-fast { animation: fade-in-fast 0.2s ease-out forwards; }
            `}</style>
        </main>
    );
};

export default MonitorDeliveries;