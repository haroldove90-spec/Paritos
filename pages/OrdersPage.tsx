import React from 'react';
import type { Order } from '../types';

interface OrdersPageProps {
  orders: Order[];
}

const statusMap = {
    pending_pickup: { text: 'Preparando', color: 'text-orange-400' },
    out_for_delivery: { text: 'En camino', color: 'text-blue-400' },
    delivered: { text: 'Entregado', color: 'text-green-400' },
}

const OrdersPage: React.FC<OrdersPageProps> = ({ orders }) => {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6 text-white">Mis <span className="text-[#FFDF00]">Pedidos</span></h1>
      {orders.length === 0 ? (
         <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No has realizado ningún pedido.</p>
            <p className="text-sm text-gray-500 mt-2">Tu historial de pedidos aparecerá aquí.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-[#1e1e1e] p-4 rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <div>
                    <h2 className="font-bold text-lg">Pedido #{order.id.toString().slice(-4)}</h2>
                    <span className="text-sm text-gray-400">{new Date(order.date).toLocaleDateString()}</span>
                </div>
                <div className={`text-sm font-bold px-3 py-1 rounded-full ${statusMap[order.status].color} bg-white/10`}>
                    {statusMap[order.status].text}
                </div>
              </div>
              <ul className="mb-3 text-gray-300 space-y-1">
                {order.items.map((item) => (
                    <li key={item.id} className="flex justify-between">
                        <span>{item.quantity}x {item.name}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </li>
                ))}
              </ul>
              <div className="border-t border-[#3A3D42] pt-2 text-right">
                <p className="font-bold text-white text-lg">Total: ${order.total.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
