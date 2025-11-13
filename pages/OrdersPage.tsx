import React from 'react';
import type { Order, OrderStatus, Restaurant, CartItem } from '../types';

interface OrdersPageProps {
  orders: Order[];
  restaurants: Restaurant[];
  onReorder: (items: CartItem[]) => void;
}

const statusMap = {
    pendiente: { text: 'Pendiente', color: 'text-gray-400', step: 1 },
    en_preparacion: { text: 'Preparando', color: 'text-orange-400', step: 2 },
    en_camino: { text: 'En camino', color: 'text-blue-400', step: 3 },
    entregado: { text: 'Entregado', color: 'text-green-400', step: 4 },
}

const StatusBar: React.FC<{status: OrderStatus}> = ({ status }) => {
    const currentStep = statusMap[status].step;
    const steps = ['Pendiente', 'Preparando', 'En Camino', 'Entregado'];

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

const OrderCard: React.FC<{
    order: Order;
    restaurant: Restaurant | undefined;
    onReorder: (items: CartItem[]) => void;
}> = ({ order, restaurant, onReorder }) => {
    const isPastOrder = order.status === 'entregado';
    const itemSummary = order.items.length > 1 
        ? `${order.items[0].name} y ${order.items.length - 1} más`
        : order.items[0]?.name || 'Pedido';

    return (
        <div className="bg-[#1e1e1e] p-4 rounded-lg shadow-md mb-4 transition-all duration-300 hover:shadow-lg hover:shadow-[#FFDF00]/10 hover:border-[#FFDF00]/20 border border-transparent">
            <div className="flex items-center mb-3">
                {restaurant && (
                    <img src={restaurant.imageUrl} alt={restaurant.name} className="w-12 h-12 rounded-md object-cover mr-4" />
                )}
                <div className="flex-grow">
                    <h3 className="font-bold text-lg text-white">{restaurant?.name || 'Restaurante'}</h3>
                    <p className="text-sm text-gray-400">{itemSummary}</p>
                </div>
                <div className="text-right">
                    <p className="font-bold text-white text-lg">${order.total.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">#{order.id.toString().slice(-4)}</p>
                </div>
            </div>

            {isPastOrder ? (
                <div className="flex justify-between items-center border-t border-[#3A3D42] pt-3 mt-3">
                    <p className="text-sm text-gray-400">
                        Entregado el {new Date(order.date).toLocaleDateString()}
                    </p>
                    <button 
                        onClick={() => onReorder(order.items)}
                        className="bg-[#FFDF00] text-[#181818] font-bold py-2 px-4 rounded-lg text-sm transform hover:scale-105 transition-transform duration-200"
                    >
                        Volver a pedir
                    </button>
                </div>
            ) : (
                <div className="border-t border-[#3A3D42] pt-3 mt-3">
                     <div className={`text-sm font-bold text-right mb-3 ${statusMap[order.status].color}`}>
                        {statusMap[order.status].text}
                    </div>
                    <StatusBar status={order.status} />
                </div>
            )}
        </div>
    );
}

const OrdersPage: React.FC<OrdersPageProps> = ({ orders, restaurants, onReorder }) => {
    const activeOrders = orders.filter(o => o.status !== 'entregado').sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const pastOrders = orders.filter(o => o.status === 'entregado').sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const getRestaurantForOrder = (order: Order) => {
        return restaurants.find(r => r.id === order.restaurantId);
    };

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-6 text-white">Mis <span className="text-[#FFDF00]">Pedidos</span></h1>
            
            {orders.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-gray-400 text-lg">No has realizado ningún pedido.</p>
                    <p className="text-sm text-gray-500 mt-2">Tu historial de pedidos aparecerá aquí.</p>
                </div>
            ) : (
                <>
                    <div>
                        <h2 className="text-xl font-bold text-white mb-4">Pedidos en Curso</h2>
                        {activeOrders.length > 0 ? (
                            activeOrders.map(order => (
                                <OrderCard 
                                    key={order.id} 
                                    order={order} 
                                    restaurant={getRestaurantForOrder(order)} 
                                    onReorder={onReorder}
                                />
                            ))
                        ) : (
                            <div className="bg-[#1e1e1e] p-6 rounded-lg text-center text-gray-400">
                                <p>No tienes pedidos en curso.</p>
                                <p className="text-sm text-gray-500 mt-1">¡Haz un pedido para verlo aquí!</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-8">
                        <h2 className="text-xl font-bold text-white mb-4">Historial de Pedidos</h2>
                        {pastOrders.length > 0 ? (
                            pastOrders.map(order => (
                                <OrderCard 
                                    key={order.id} 
                                    order={order} 
                                    restaurant={getRestaurantForOrder(order)} 
                                    onReorder={onReorder}
                                />
                            ))
                        ) : (
                            <div className="bg-[#1e1e1e] p-6 rounded-lg text-center text-gray-400">
                                <p>Aún no tienes un historial de pedidos.</p>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default OrdersPage;