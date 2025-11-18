import React, { useState } from 'react';
import type { Order, OrderStatus } from '../../types';
import { ChevronDownIcon } from '../icons/ChevronDownIcon';

interface ManageOrdersProps {
    orders: Order[];
    onUpdateOrderStatus: (orderId: number, status: OrderStatus, courierId?: number) => void;
}

const statusMap = {
    pendiente: { text: 'Pendiente', color: 'text-gray-400', bg: 'bg-gray-400/10', border: 'border-gray-600' },
    en_preparacion: { text: 'Preparando', color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-700' },
    listo_para_recoger: { text: 'Listo', color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-700' },
    en_camino: { text: 'En Camino', color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-700' },
    entregado: { text: 'Entregado', color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-700' },
}

const statusOptions: { value: OrderStatus, label: string }[] = [
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'en_preparacion', label: 'En Preparación' },
    { value: 'listo_para_recoger', label: 'Listo para Recoger' },
    { value: 'en_camino', label: 'En Camino' },
    { value: 'entregado', label: 'Entregado' },
];

const ManageOrders: React.FC<ManageOrdersProps> = ({ orders, onUpdateOrderStatus }) => {
    const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

    const toggleOrderDetails = (orderId: number) => {
        setExpandedOrderId(prevId => (prevId === orderId ? null : orderId));
    };

    return (
        <main className="flex-grow overflow-y-auto p-6">
            <div className="mb-6">
                 <h1 className="text-3xl font-bold text-white">Pedidos</h1>
                 <p className="text-md text-gray-400">Monitorea y gestiona todos los pedidos.</p>
            </div>

            {orders.length === 0 ? (
                <div className="bg-[#1e1e1e] rounded-lg p-8 text-center text-gray-400">
                    <p className="text-lg">No hay pedidos para mostrar.</p>
                    <p className="text-sm">Cuando los clientes realicen pedidos, aparecerán aquí.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => {
                        const isExpanded = expandedOrderId === order.id;
                        return (
                            <div key={order.id} className="bg-[#1e1e1e] p-4 rounded-lg shadow-md transition-all duration-300">
                                <div className="flex justify-between items-start cursor-pointer" onClick={() => toggleOrderDetails(order.id)}>
                                    <div>
                                        <h3 className="font-bold text-lg text-white">
                                            Pedido #{order.id.toString().slice(-4)}
                                        </h3>
                                        <p className="text-sm text-gray-400">
                                            {order.customerName} &bull; {new Date(order.date).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className={`text-sm font-bold px-3 py-1 rounded-full ${statusMap[order.status].color} ${statusMap[order.status].bg}`}>
                                            {statusMap[order.status].text}
                                        </div>
                                        <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                                    </div>
                                </div>
                                
                                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[1000px] mt-3 pt-3 border-t border-[#3A3D42]' : 'max-h-0'}`}>
                                    <h4 className="font-semibold text-gray-300 mb-2 text-sm">Artículos:</h4>
                                    <ul className="text-gray-300 space-y-2 text-sm">
                                        {order.items.map((item) => (
                                            <li key={item.id} className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <img src={item.imageUrl} alt={item.name} className="w-10 h-10 rounded-md object-cover"/>
                                                    <span>{item.quantity}x {item.name}</span>
                                                </div>
                                                <span>${(item.price * item.quantity).toFixed(2)}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="text-right mt-4">
                                        <p className="font-bold text-white text-lg">
                                            Total: ${order.total.toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="border-t border-[#3A3D42] mt-3 pt-3 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                                        <p className="text-sm font-semibold text-gray-300">Cambiar estado:</p>
                                        <div>
                                            <select
                                                value={order.status}
                                                onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                                                className={`bg-[#2a2a2a] border ${statusMap[order.status].border} text-sm rounded-lg focus:ring-[#FFDF00] focus:border-[#FFDF00] block w-full sm:w-auto p-2 font-semibold transition-colors duration-200 ${statusMap[order.status].color}`}
                                            >
                                                {statusOptions.map(option => (
                                                    <option key={option.value} value={option.value} className="font-sans">
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </main>
    );
};

export default ManageOrders;