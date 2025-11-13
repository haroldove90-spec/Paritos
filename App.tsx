import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import RoleSwitcher from './components/RoleSwitcher';
import AdminDashboard from './components/AdminDashboard';
import CourierDashboard from './components/CourierDashboard';
import HomePage from './pages/HomePage';
import OrdersPage from './pages/OrdersPage';
import FavoritesPage from './pages/FavoritesPage';
import ProfilePage from './pages/ProfilePage';
import CartPage from './pages/CartPage';
import RestaurantPage from './pages/RestaurantPage';
import NotificationsPage from './pages/NotificationsPage';
import InstallPWA from './components/InstallPWA';
import type { UserRole, Restaurant, Order, Notification, CartItem, MenuItem, OrderStatus, Courier } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { mockRestaurants as initialRestaurants, mockCouriers as initialCouriers } from './data/mockData';

type ActiveView = 'Inicio' | 'Pedidos' | 'Favoritos' | 'Perfil' | 'Carrito' | 'Restaurante';
type AdminView = 'Dashboard' | 'Restaurantes' | 'Pedidos' | 'Mensajeros' | 'Analíticas' | 'Entregas';

const App: React.FC = () => {
  const [role, setRole] = useLocalStorage<UserRole>('userRole', 'Cliente');
  const [activeView, setActiveView] = useState<ActiveView>('Inicio');
  const [adminView, setAdminView] = useState<AdminView>('Dashboard');
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<number | null>(null);

  const [restaurants, setRestaurants] = useLocalStorage<Restaurant[]>('restaurants', initialRestaurants);
  const [couriers, setCouriers] = useLocalStorage<Courier[]>('couriers', initialCouriers);
  const [cart, setCart] = useLocalStorage<CartItem[]>('cart', []);
  const [favorites, setFavorites] = useLocalStorage<number[]>('favorites', []);
  const [orders, setOrders] = useLocalStorage<Order[]>('orders', []);
  const [notifications, setNotifications] = useLocalStorage<Notification[]>('notifications', [
      { id: Date.now(), message: '¡Bienvenido a Paritos! Tu app de comida favorita.', read: false, date: new Date().toISOString() },
  ]);
  
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallDismissed, setIsInstallDismissed] = useLocalStorage('installDismissed', false);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleToggleFavorite = (restaurantId: number) => {
    setFavorites(prev => 
      prev.includes(restaurantId) 
        ? prev.filter(id => id !== restaurantId)
        : [...prev, restaurantId]
    );
  };

  const handleAddToCart = (item: MenuItem, restaurantId: number) => {
    setCart(prev => {
        const existingItem = prev.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
            return prev.map(cartItem => cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem);
        }
        return [...prev, { ...item, quantity: 1, restaurantId }];
    });
  };

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;
    const newOrder: Order = {
      id: Date.now(),
      date: new Date().toISOString(),
      items: [...cart],
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      status: 'en_preparacion',
      customerName: 'Cliente Anónimo',
      courierId: null,
    };
    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
    setNotifications(prev => [{
        id: Date.now(),
        message: `Tu pedido #${newOrder.id.toString().slice(-4)} ha sido realizado.`,
        read: false,
        date: new Date().toISOString()
    }, ...prev]);
    setActiveView('Pedidos');
  };

  const updateOrderStatus = (orderId: number, status: OrderStatus, courierId?: number) => {
    setOrders(prevOrders => {
        const orderToUpdate = prevOrders.find(o => o.id === orderId);
        if (!orderToUpdate) return prevOrders;

        // If a courier takes the order
        if (status === 'en_camino' && courierId) {
            setCouriers(prevCouriers => prevCouriers.map(c => c.id === courierId ? {...c, status: 'en_entrega'} : c));
            return prevOrders.map(o => o.id === orderId ? {...o, status, courierId} : o);
        }
        
        // If an order is delivered
        if (status === 'entregado' && orderToUpdate.courierId) {
             setCouriers(prevCouriers => prevCouriers.map(c => c.id === orderToUpdate.courierId ? {...c, status: 'disponible'} : c));
        }

        return prevOrders.map(o => o.id === orderId ? {...o, status} : o);
    });
  }

  const handleSelectRestaurant = (id: number) => {
    setSelectedRestaurantId(id);
    setActiveView('Restaurante');
  };

  const saveRestaurant = (restaurant: Restaurant) => {
    setRestaurants(prev => {
        const exists = prev.some(r => r.id === restaurant.id);
        if (exists) {
            return prev.map(r => r.id === restaurant.id ? restaurant : r);
        }
        return [...prev, restaurant];
    });
    setAdminView('Dashboard');
  };

  const deleteRestaurant = (id: number) => {
    setRestaurants(prev => prev.filter(r => r.id !== id));
  }

  const saveCourier = (courier: Courier) => {
     setCouriers(prev => {
        const exists = prev.some(c => c.id === courier.id);
        if (exists) {
            return prev.map(c => c.id === courier.id ? courier : c);
        }
        return [...prev, courier];
    });
  }

  const deleteCourier = (id: number) => {
    setCouriers(prev => prev.filter(c => c.id !== id));
  }

  const renderClientContent = () => {
    const selectedRestaurant = restaurants.find(r => r.id === selectedRestaurantId);
    switch (activeView) {
      case 'Restaurante':
        return selectedRestaurant ? <RestaurantPage restaurant={selectedRestaurant} onAddToCart={handleAddToCart} cartItems={cart} /> : <p>Restaurante no encontrado</p>;
      case 'Pedidos':
        return <OrdersPage orders={orders} />;
      case 'Favoritos':
        const favoriteRestaurants = restaurants.filter(r => favorites.includes(r.id));
        return <FavoritesPage 
                    restaurants={favoriteRestaurants} 
                    onSelectRestaurant={handleSelectRestaurant}
                    onToggleFavorite={handleToggleFavorite}
                    allFavorites={favorites}
                />;
      case 'Perfil':
        return <ProfilePage />;
      case 'Carrito':
        return <CartPage cartItems={cart} onPlaceOrder={handlePlaceOrder} onClearCart={() => setCart([])} setCart={setCart} />;
      case 'Inicio':
      default:
        return <HomePage 
                    restaurants={restaurants}
                    onSelectRestaurant={handleSelectRestaurant}
                    onToggleFavorite={handleToggleFavorite}
                    favorites={favorites}
                />;
    }
  };

  const renderContent = () => {
    switch (role) {
      case 'Administracion':
        return <AdminDashboard 
                    currentView={adminView} 
                    setView={setAdminView} 
                    restaurants={restaurants} 
                    onSaveRestaurant={saveRestaurant} 
                    onDeleteRestaurant={deleteRestaurant} 
                    orders={orders}
                    couriers={couriers}
                    onSaveCourier={saveCourier}
                    onDeleteCourier={deleteCourier}
                />;
      case 'Mensajero':
        return <CourierDashboard orders={orders} onUpdateStatus={updateOrderStatus} />;
      case 'Cliente':
      default:
        return (
          <>
            <Header 
                onNotificationsClick={() => setNotificationsOpen(true)} 
                notificationCount={notifications.filter(n => !n.read).length} 
                showBackButton={activeView === 'Restaurante'}
                onBackClick={() => setActiveView('Inicio')}
            />
            <main className="flex-grow overflow-y-auto pb-24">
              {renderClientContent()}
            </main>
            <BottomNav 
                activeTab={activeView} 
                onTabChange={(view) => {
                    setActiveView(view);
                    setSelectedRestaurantId(null);
                }} 
                cartItemCount={cart.reduce((total, item) => total + item.quantity, 0)}
            />
          </>
        );
    }
  };

  return (
    <div className="bg-[#181818] text-white font-sans antialiased">
      <div className="w-full max-w-6xl mx-auto bg-[#181818] relative flex flex-col min-h-screen">
        <RoleSwitcher currentRole={role} onRoleChange={(newRole) => {
            setRole(newRole);
            setActiveView('Inicio');
            setAdminView('Dashboard');
        }} />
        {renderContent()}
        {isNotificationsOpen && (
            <NotificationsPage 
                notifications={notifications} 
                onClose={() => setNotificationsOpen(false)}
                onClear={() => setNotifications([])}
            />
        )}
        {!isInstallDismissed && deferredPrompt && role === 'Cliente' && (
            <InstallPWA
                onInstall={() => {
                    deferredPrompt.prompt();
                    deferredPrompt.userChoice.then(() => {
                        setDeferredPrompt(null);
                        setIsInstallDismissed(true);
                    });
                }}
                onDismiss={() => {
                    setIsInstallDismissed(true);
                }}
            />
        )}
      </div>
    </div>
  );
};

export default App;