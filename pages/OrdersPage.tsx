import React from 'react';
import type { Order } from '../types';

interface OrdersPageProps {
  orders: Order[];
}

const statusMap = {
    en_preparacion: { text: 'Preparando', color: 'text-orange-400', step: 1 },
    en_camino: { text: 'En camino', color: 'text-blue-400', step: 2 },
    entregado: { text: 'Entregado', color: 'text-green-400', step: 3 },
}

const StatusBar: React.FC<{status: 'en_preparacion' | 'en_camino' | 'entregado'}> = ({ status }) => {
    const currentStep = statusMap[status].step;
    const steps = ['Preparando', 'En Camino', 'Entregado'];

    return (
        <div className="flex items-center justify-between mt-4">
            {steps.map((label, index) => {
                const step = index + 1;
                const isCompleted = step <= currentStep;
                const isCurrent = step === currentStep;

                return (
                    <React.Fragment key={label}>
                        <div className="flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${isCompleted ? 'border-[#FFDF00] bg-[#FFDF00]/20' : 'border-gray-600'}`}>
                                {isCompleted && <div className={`w-4 h-4 rounded-full ${isCurrent ? 'bg-[#FFDF00] animate-pulse' : 'bg-[#FFDF00]'}`}></div>}
                            </div>
                            <span className={`text-xs mt-1 font-semibold ${isCompleted ? 'text-white' : 'text-gray-500'}`}>{label}</span>
                        </div>
                        {index < steps.length - 1 && (
                            <div className={`flex-1 h-1 mx-2 rounded ${isCompleted && step < currentStep ? 'bg-[#FFDF00]' : 'bg-gray-600'}`}></div>
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};


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
              <div className="border-t border-[#3A3D42] pt-3 mt-3">
                <p className="font-bold text-white text-lg text-right">Total: ${order.total.toFixed(2)}</p>
                <StatusBar status={order.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;