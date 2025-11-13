import React from 'react';
import type { Order } from '../../types';

interface ManageOrdersProps {
    onBack: () => void;
    orders: Order[];
}

const statusMap = {
    en_preparacion: { text: 'Preparando', color: 'text-orange-400', bg: 'bg-orange-400/10' },
    en_camino: { text: 'En Camino', color: 'text-blue-400', bg: 'bg-blue-400/10' },
    entregado: { text: 'Entregado', color: 'text-green-400', bg: 'bg-green-400/10' },
}

const ManageOrders: React.FC<ManageOrdersProps> = ({ onBack, orders }) => {
    return (
        <main className="flex-grow overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <button onClick={onBack} className="text-sm text-[#FFDF00] hover:underline mb-1">&larr; Volver al Panel</button>
                    <h2 className="text-2xl font-bold text-white">Monitoreo de Pedidos</h2>
                </div>
            </div>

            {orders.length === 0 ? (
                <div className="bg-[#1e1e1e] rounded-lg p-8 text-center text-gray-400">
                    <p className="text-lg">No hay pedidos para mostrar.</p>
                    <p className="text-sm">Cuando los clientes realicen pedidos, aparecerán aquí.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-[#1e1e1e] p-4 rounded-lg shadow-md">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="font-bold text-lg text-white">
                                        Pedido #{order.id.toString().slice(-4)}
                                    </h3>
                                    <p className="text-sm text-gray-400">
                                        {order.customerName} &bull; {new Date(order.date).toLocaleString()}
                                    </p>
                                </div>
                                <div className={`text-sm font-bold px-3 py-1 rounded-full ${statusMap[order.status].color} ${statusMap[order.status].bg}`}>
                                    {statusMap[order.status].text}
                                </div>
                            </div>
                            {order.status === 'en_camino' && (
                                <p className="text-xs font-semibold text-blue-300 bg-blue-500/20 rounded px-2 py-1 inline-block mb-3">
                                    🛵 Pedido aceptado por un mensajero.
                                </p>
                            )}
                            <div className="border-t border-b border-[#3A3D42] py-2 my-2">
                                <h4 className="font-semibold text-gray-300 mb-1 text-sm">Artículos:</h4>
                                <ul className="text-gray-300 space-y-1 text-sm">
                                    {order.items.map((item) => (
                                        <li key={item.id} className="flex justify-between">
                                            <span>{item.quantity}x {item.name}</span>
                                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-white text-lg">
                                    Total: ${order.total.toFixed(2)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
};

export default ManageOrders;
