import React, { useMemo } from 'react';
import type { Order, Restaurant, Courier } from '../../types';

interface ManageAnalyticsProps {
    onBack: () => void;
    orders: Order[];
    restaurants: Restaurant[];
    couriers: Courier[];
}

const StatCard: React.FC<{title: string, value: string | number, icon: string}> = ({ title, value, icon }) => (
    <div className="bg-[#2a2a2a] p-5 rounded-xl flex items-center space-x-4">
        <div className="text-4xl">{icon}</div>
        <div>
            <p className="text-gray-400 text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    </div>
);

const ManageAnalytics: React.FC<ManageAnalyticsProps> = ({ onBack, orders, restaurants, couriers }) => {

    const totalRevenue = useMemo(() => {
        return orders.reduce((sum, order) => sum + order.total, 0).toFixed(2);
    }, [orders]);

    const ordersByRestaurant = useMemo(() => {
        const counts: {[key: string]: {name: string, count: number}} = {};
        restaurants.forEach(r => {
            counts[r.id] = { name: r.name, count: 0 };
        });
        orders.forEach(order => {
            order.items.forEach(item => {
                if (counts[item.restaurantId]) {
                    counts[item.restaurantId].count += 1; // count each item as an order for simplicity
                }
            });
        });
        return Object.values(counts).sort((a, b) => b.count - a.count);
    }, [orders, restaurants]);

    const maxOrders = Math.max(...ordersByRestaurant.map(r => r.count), 0);

    return (
        <main className="flex-grow overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <button onClick={onBack} className="text-sm text-[#FFDF00] hover:underline mb-1">&larr; Volver al Panel</button>
                    <h2 className="text-2xl font-bold text-white">Analíticas</h2>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Ingresos Totales" value={`$${totalRevenue}`} icon="💰" />
                <StatCard title="Pedidos Totales" value={orders.length} icon="📝" />
                <StatCard title="Restaurantes Activos" value={restaurants.length} icon="🍔" />
                <StatCard title="Mensajeros" value={couriers.length} icon="🛵" />
            </div>

            <div className="bg-[#1e1e1e] p-6 rounded-lg">
                <h3 className="font-bold text-lg text-white mb-4">Restaurantes más Populares</h3>
                <div className="space-y-4">
                    {ordersByRestaurant.slice(0, 5).map(r => (
                        <div key={r.name} className="flex items-center">
                            <p className="w-1/3 text-gray-300 truncate">{r.name}</p>
                            <div className="w-2/3 bg-[#2a2a2a] rounded-full h-6">
                                <div 
                                    className="bg-[#FFDF00] h-6 rounded-full flex items-center justify-end px-2"
                                    style={{ width: maxOrders > 0 ? `${(r.count / maxOrders) * 100}%` : '0%'}}
                                >
                                    <span className="font-bold text-sm text-[#181818]">{r.count}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
};

export default ManageAnalytics;
