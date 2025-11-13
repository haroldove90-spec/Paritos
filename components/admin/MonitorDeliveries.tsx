import React from 'react';
import type { Order, Courier } from '../../types';

interface MonitorDeliveriesProps {
    onBack: () => void;
    orders: Order[];
    couriers: Courier[];
}

const MonitorDeliveries: React.FC<MonitorDeliveriesProps> = ({ onBack, orders, couriers }) => {
    const activeDeliveries = orders.filter(o => o.status === 'en_camino');

    const getCourierName = (courierId: number | null) => {
        if (!courierId) return 'No asignado';
        return couriers.find(c => c.id === courierId)?.name || 'Desconocido';
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
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <p className="text-white text-lg font-bold bg-black/50 px-4 py-2 rounded-lg">Mapa de Entregas Activas</p>
                    </div>
                </div>

                {/* List Section */}
                <div className="md:w-1/3 flex flex-col">
                    <h3 className="text-lg font-semibold text-white mb-3 flex-shrink-0">
                        Entregas Activas ({activeDeliveries.length})
                    </h3>
                    <div className="flex-grow bg-[#1e1e1e] rounded-lg overflow-y-auto p-4 space-y-4">
                        {activeDeliveries.length > 0 ? (
                            activeDeliveries.map(order => (
                                <div key={order.id} className="bg-[#2a2a2a] p-3 rounded-lg animate-fade-in">
                                    <div className="flex justify-between items-center">
                                        <p className="font-bold text-white">Pedido #{order.id.toString().slice(-4)}</p>
                                        <p className="text-xs text-blue-300 font-semibold bg-blue-500/20 px-2 py-1 rounded-full">En Camino</p>
                                    </div>
                                    <p className="text-sm text-gray-300 mt-1">
                                        <span className="font-semibold">Mensajero:</span> {getCourierName(order.courierId)}
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
            `}</style>
        </main>
    );
};

export default MonitorDeliveries;
