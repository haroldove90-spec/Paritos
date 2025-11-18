
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import type { Session } from '@supabase/supabase-js';
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
import type { UserRole, Restaurant, Order, Notification, CartItem, MenuItem, OrderStatus, Courier, CourierStatus, DBProfile, MediaItem, CourierApplication, ActiveView, Location } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import CheckoutPage from './pages/CheckoutPage';
import NewOrderPopup from './components/admin/NewOrderPopup';
import ReadyOrdersPopup from './components/courier/ReadyOrdersPopup';
import AuthPage from './pages/AuthPage';
import { playNotificationSound } from './utils/notificationSound';
import { supabase } from './supabaseClient';
import BecomeCourierPage from './pages/BecomeCourierPage';

type AdminView = 'Dashboard' | 'Restaurantes' | 'Pedidos' | 'Mensajeros' | 'Analíticas' | 'Entregas' | 'Productos' | 'Media';

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [dbProfile, setDbProfile] = useState<DBProfile | null>(null);
  const [viewRole, setViewRole] = useState<UserRole>('Cliente');
  
  const [activeView, setActiveView] = useState<ActiveView>('Inicio');
  const [adminView, setAdminView] = useState<AdminView>('Dashboard');
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<number | null>(null);

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [couriers, setCouriers] = useState<Courier[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [mediaLibrary, setMediaLibrary] = useState<MediaItem[]>([]);
  const [courierApplications, setCourierApplications] = useState<CourierApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(true);

  const [cart, setCart] = useLocalStorage<CartItem[]>('cart', []);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [notifications, setNotifications] = useLocalStorage<Notification[]>('notifications', [
      { id: Date.now(), message: '¡Bienvenido a Paritos! Tu app de comida favorita.', read: false, date: new Date().toISOString() },
  ]);
  
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallDismissed, setIsInstallDismissed] = useLocalStorage('installDismissed', false);
  
  const [newAdminOrderPopup, setNewAdminOrderPopup] = useState<Order | null>(null);
  const [newCourierOrdersPopup, setNewCourierOrdersPopup] = useState<Order[]>([]);

  const prevOrdersRef = useRef<Order[]>(orders);

  const allCategories = useMemo(() => {
    const categoriesSet = new Set(restaurants.map(r => r.category));
    return Array.from(categoriesSet).sort();
  }, [restaurants]);

  const fetchProfile = useCallback(async (session: Session | null) => {
    if (!session) {
      setDbProfile(null);
      setIsLoading(false);
      return;
    }
    const userId = session.user.id;

    // 1. Try to fetch the user's profile
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();

    // 2. Profile exists: process and set it
    if (data && !error) {
        const dbRole = (data as any).user_role;
        const roleStr = (dbRole ? String(dbRole).trim() : 'Cliente').normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        
        let finalRole: UserRole = 'Cliente';
        if (roleStr === 'administracion' || roleStr === 'administrador') {
            finalRole = 'Administracion';
        } else if (roleStr === 'mensajero') {
            finalRole = 'Mensajero';
        }

        const adminEmails = ['haroldo90@hotmail.com'];
        if (session.user.email && adminEmails.includes(session.user.email)) {
            finalRole = 'Administracion';
        }

        const profileData = { ...data, role: finalRole };
        delete (profileData as any).user_role;

        setDbProfile(profileData as DBProfile);
        setViewRole(finalRole);
        setFavorites((data as any).favorite_restaurants || []);
        setIsLoading(false);
        return;
    }

    // 3. Profile doesn't exist (new user): create it
    if (error && error.code === 'PGRST116') {
        console.log('No profile found for new user, creating one...');
        const newProfileData = {
            id: userId,
            full_name: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || 'Nuevo Usuario',
            user_role: 'Cliente',
            address: null,
            favorite_restaurants: [],
        };

        const { data: createdProfile, error: insertError } = await supabase
            .from('profiles')
            .insert(newProfileData)
            .select()
            .single();
        
        if (insertError) {
            console.error("Critical error: Failed to create profile for new user.", insertError);
            await supabase.auth.signOut();
            return;
        }

        if (createdProfile) {
            console.log("Profile created successfully.");
            const profileData = { ...createdProfile, role: 'Cliente' as UserRole };
            delete (profileData as any).user_role;
            setDbProfile(profileData as DBProfile);
            setViewRole('Cliente');
            setFavorites([]);
        }
    } else if (error) {
      // 4. Any other error
      console.error("Error fetching profile, logging out.", error);
      await supabase.auth.signOut();
    }
    setIsLoading(false);
  }, []);


  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      fetchProfile(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      fetchProfile(session);
      if (!session) {
        // Clear state on logout
        setDbProfile(null);
        setViewRole('Cliente');
        setActiveView('Inicio');
      }
    });
    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const fetchRestaurants = useCallback(async () => {
    const { data, error } = await supabase.from('restaurants').select('*, menu_items(*)');
    if (error) console.error('Error fetching restaurants:', error.message);
    else setRestaurants((data as any) || []);
  }, []);

  const fetchCouriers = useCallback(async () => {
    const { data, error } = await supabase.from('couriers').select('*');
    if (error) console.error('Error fetching couriers:', error.message);
    else setCouriers(data || []);
  }, []);

  const fetchOrders = useCallback(async () => {
    const { data, error } = await supabase.from('orders').select('*').order('id', { ascending: false });
    if (error) console.error('Error fetching orders:', error.message);
    else setOrders(data || []);
  }, []);
  
  const fetchMediaLibrary = useCallback(async () => {
    const { data, error } = await supabase.storage.from('media').list('', { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });
    if (error) {
        console.error('Error fetching media library', error);
    } else {
        const items = data.map(file => {
            const publicUrl = supabase.storage.from('media').getPublicUrl(file.name).data.publicUrl;
            return { id: file.name, name: file.name, url: publicUrl, created_at: file.created_at };
        });
        setMediaLibrary(items);
    }
  }, []);

  const fetchCourierApplications = useCallback(async () => {
      const { data: applications, error: applicationsError } = await supabase
          .from('courier_applications')
          .select('*');

      if (applicationsError) {
          console.error('Error fetching courier applications', applicationsError);
          setCourierApplications([]);
          return;
      }

      if (!applications || applications.length === 0) {
          setCourierApplications([]);
          return;
      }

      const userIds = applications.map(app => app.user_id);
      const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', userIds);

      if (profilesError) {
          console.error('Error fetching profiles for applications:', profilesError);
          const appsWithFallbackProfile = applications.map(app => ({
              ...app,
              profiles: { full_name: 'Usuario Desconocido' }
          }));
          setCourierApplications(appsWithFallbackProfile as any);
          return;
      }

      const profilesMap = new Map(profiles.map(p => [p.id, p.full_name]));
      
      const applicationsWithProfiles = applications.map(app => ({
          ...app,
          profiles: {
              full_name: profilesMap.get(app.user_id) || 'Nombre no encontrado'
          }
      }));

      setCourierApplications(applicationsWithProfiles as any);
  }, []);

  useEffect(() => {
    if (!session) return; // Don't fetch data if not logged in
    const fetchData = async () => {
      setIsDataLoading(true);
      await Promise.all([
        fetchRestaurants(),
        fetchCouriers(),
        fetchOrders(),
        fetchMediaLibrary(),
        fetchCourierApplications(),
      ]);
      setIsDataLoading(false);
    };
    fetchData();
  }, [session, fetchRestaurants, fetchCouriers, fetchOrders, fetchMediaLibrary, fetchCourierApplications]);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  useEffect(() => {
    if (isDataLoading) return;

      const previousOrders = prevOrdersRef.current;
      if (orders.length > previousOrders.length) {
          const newOrder = orders[0];
          if (newOrder.status === 'pendiente' && viewRole === 'Administracion') {
              playNotificationSound();
              setNewAdminOrderPopup(newOrder);
          }
      }

      const newlyReadyOrders = orders.filter(order => {
          const prevOrder = previousOrders.find(p => p.id === order.id);
          return order.status === 'listo_para_recoger' && (!prevOrder || prevOrder.status !== 'listo_para_recoger');
      });

      if (newlyReadyOrders.length > 0 && viewRole === 'Mensajero') {
          playNotificationSound();
          setNewCourierOrdersPopup(prev => [...prev, ...newlyReadyOrders]);
      }

      prevOrdersRef.current = orders;
  }, [orders, viewRole, isDataLoading]);

  const handleToggleFavorite = async (restaurantId: number) => {
    if (!dbProfile) return;

    const newFavorites = favorites.includes(restaurantId)
        ? favorites.filter(id => id !== restaurantId)
        : [...favorites, restaurantId];
    
    setFavorites(newFavorites);

    const { error } = await supabase
        .from('profiles')
        .update({ favorite_restaurants: newFavorites })
        .eq('id', dbProfile.id);

    if (error) {
        console.error("Error updating favorites:", error);
        // Revert state on error to keep UI consistent with DB
        setFavorites(favorites); 
    }
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

  const handleConfirmOrder = async (customerLocation: Location | null) => {
    if (cart.length === 0 || !dbProfile) return;
    const newOrderData = {
      date: new Date().toISOString(),
      items: [...cart] as any,
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0) + 45,
      status: 'pendiente' as OrderStatus,
      customerName: dbProfile.full_name,
      customerAddress: dbProfile.address,
      customerLocation: customerLocation,
      courierId: null,
      restaurantId: cart[0].restaurantId,
      customer_id: dbProfile.id,
    };
    const { data: newOrder, error } = await supabase.from('orders').insert(newOrderData).select().single();
    
    if (error || !newOrder) {
      console.error("Error creating order", error);
      return;
    }
    
    await fetchOrders();
    setCart([]);
    
    const orderIdShort = newOrder.id.toString().slice(-4);
    const timestamp = new Date().toISOString();
    const notificationsToAdd: Notification[] = [
      { id: Date.now(), message: `Tu pedido #${orderIdShort} ha sido realizado.`, read: false, date: timestamp },
      { id: Date.now() + 1, message: `Admin: Nuevo pedido #${orderIdShort} recibido por $${newOrder.total.toFixed(2)}.`, read: false, date: timestamp }
    ];

    setNotifications(prev => [...notificationsToAdd, ...prev]);
    setActiveView('Pedidos');
  };

  const handleProceedToCheckout = () => {
    if (cart.length > 0) {
        setActiveView('Checkout');
    }
  };


  const updateOrderStatus = async (orderId: number, status: OrderStatus, courierId?: number) => {
      const orderToUpdate = orders.find(o => o.id === orderId);
      if (!orderToUpdate) return;
      
      const { error } = await supabase.from('orders').update({ status, courierId: courierId !== undefined ? courierId : orderToUpdate.courierId }).eq('id', orderId);
      if (error) {
        console.error("Error updating order status", error);
        return;
      }
      
      if (status === 'en_camino' && courierId) {
          await supabase.from('couriers').update({ status: 'en_entrega' }).eq('id', courierId);
      } else if (status === 'entregado' && orderToUpdate.courierId) {
          const { data: otherOrders } = await supabase.from('orders').select('id').eq('courierId', orderToUpdate.courierId).eq('status', 'en_camino').neq('id', orderId);
          if (otherOrders && otherOrders.length === 0) {
              await supabase.from('couriers').update({ status: 'disponible' }).eq('id', orderToUpdate.courierId);
          }
      }
      
      await Promise.all([fetchOrders(), fetchCouriers()]);

      const orderIdShort = orderId.toString().slice(-4);
      const timestamp = new Date().toISOString();
      const messages: Partial<Record<OrderStatus, { client: string; admin: string }>> = {
          'en_preparacion': { client: `El pedido #${orderIdShort} ha sido aceptado y se está preparando.`, admin: `Admin: Pedido #${orderIdShort} movido a preparación.` },
          'listo_para_recoger': { client: `¡Tu pedido #${orderIdShort} está listo! Esperando a un mensajero.`, admin: `Admin: Pedido #${orderIdShort} listo para recoger.` },
          'en_camino': { client: `¡Tu pedido #${orderIdShort} ya está en camino!`, admin: `Admin: Pedido #${orderIdShort} está en camino.` },
          'entregado': { client: `El pedido #${orderIdShort} ha sido entregado. ¡Buen provecho!`, admin: `Admin: Pedido #${orderIdShort} completado.` }
      };
      if (messages[status]) {
          setNotifications(prev => [
              { id: Date.now(), message: messages[status]!.client, read: false, date: timestamp },
              { id: Date.now() + 1, message: messages[status]!.admin, read: false, date: timestamp },
              ...prev
          ]);
      }
  }

  const handleSelectRestaurant = (id: number) => {
    setSelectedRestaurantId(id);
    setActiveView('Restaurante');
  };

  const saveRestaurant = async (restaurant: Restaurant) => {
    const { id, menu_items, ...restaurantData } = restaurant;
    const { error } = await supabase.from('restaurants').upsert({ id: id > 1000000 ? undefined : id, ...restaurantData });
    if (error) console.error("Error saving restaurant", error);
    else await fetchRestaurants();
  };

  const deleteRestaurant = async (id: number) => {
    const { error } = await supabase.from('restaurants').delete().eq('id', id);
    if (error) console.error("Error deleting restaurant", error);
    else await fetchRestaurants();
  }

  const saveCourier = async (courier: Courier) => {
     const { id, ...courierData } = courier;
     const { error } = await supabase.from('couriers').upsert({ id: id > 1000000 ? undefined : id, ...courierData });
     if (error) console.error("Error saving courier", error);
     else await fetchCouriers();
  }

  const deleteCourier = async (id: number) => {
    const { error } = await supabase.from('couriers').delete().eq('id', id);
    if (error) console.error("Error deleting courier", error);
    else await fetchCouriers();
  }

  const saveProduct = async (product: MenuItem, restaurantId: number) => {
    const { id, ...productData } = product;
    const { error } = await supabase.from('menu_items').upsert({ id: id > 1000000 ? undefined : id, ...productData, restaurant_id: restaurantId });
    if (error) console.error("Error saving product", error);
    else await fetchRestaurants();
  };

  const deleteProduct = async (productId: number, restaurantId: number) => {
    const { error } = await supabase.from('menu_items').delete().eq('id', productId);
    if (error) console.error("Error deleting product", error);
    else await fetchRestaurants();
  };
  
  const updateCourierStatus = async (courierId: number, status: CourierStatus) => {
      const { error } = await supabase.from('couriers').update({ status }).eq('id', courierId);
      if (error) console.error("Error updating courier status", error);
      else await fetchCouriers();
  }

  const handleFileUpload = async (file: File): Promise<string | null> => {
      const fileName = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
      const { error } = await supabase.storage.from('media').upload(fileName, file);
      if (error) {
          console.error('Error uploading file:', error);
          return null;
      }
      await fetchMediaLibrary();
      const { data } = supabase.storage.from('media').getPublicUrl(fileName);
      return data.publicUrl;
  };

  const handleDeleteMedia = async (mediaName: string) => {
      const { error } = await supabase.storage.from('media').remove([mediaName]);
      if (error) console.error('Error deleting file:', error);
      await fetchMediaLibrary();
  };
  
  const handleProfileUpdate = async (updatedProfile: Partial<DBProfile>) => {
    if (!dbProfile) return;
    const { error } = await supabase.from('profiles').update(updatedProfile).eq('id', dbProfile.id);
    if (error) console.error('Error updating profile:', error.message);
    else {
        setDbProfile(prev => prev ? { ...prev, ...updatedProfile } : null);
    }
  }
  
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error('Error al cerrar sesión:', error);
    }
  };

  const handleApproveApplication = async (app: CourierApplication) => {
      // 1. Update user's role to 'Mensajero'
      const { error: profileError } = await supabase.from('profiles').update({ user_role: 'Mensajero' }).eq('id', app.user_id);
      if (profileError) { console.error("Error updating profile role:", profileError); return; }

      // 2. Create a new entry in the 'couriers' table
      const newCourierData = {
          user_id: app.user_id,
          name: app.profiles?.full_name || 'Nuevo Mensajero',
          vehicle: app.vehicle_type,
          status: 'desconectado' as CourierStatus,
          rating: 5.0,
          imageUrl: `https://i.pravatar.cc/150?u=${app.user_id}`
      };
      const { error: courierError } = await supabase.from('couriers').insert(newCourierData);
      if (courierError) { console.error("Error creating courier:", courierError); return; }

      // 3. Update the application status to 'aprobado'
      const { error: appError } = await supabase.from('courier_applications').update({ status: 'aprobado' }).eq('user_id', app.user_id);
      if (appError) { console.error("Error updating application status:", appError); return; }
      
      // Refresh all data
      await Promise.all([fetchCouriers(), fetchCourierApplications(), fetchProfile(session)]);
  };

  const handleRejectApplication = async (app: CourierApplication) => {
      const { error } = await supabase.from('courier_applications').update({ status: 'rechazado' }).eq('user_id', app.user_id);
      if (error) console.error("Error rejecting application:", error);
      else await fetchCourierApplications();
  };

  const renderClientContent = () => {
    const selectedRestaurant = restaurants.find(r => r.id === selectedRestaurantId);
    switch (activeView) {
      case 'Restaurante':
        return selectedRestaurant ? <RestaurantPage 
            restaurant={selectedRestaurant} 
            onAddToCart={handleAddToCart} 
            cartItems={cart}
            onNavigateToCart={() => setActiveView('Carrito')}
        /> : <p>Restaurante no encontrado</p>;
      case 'Pedidos':
        return <OrdersPage 
                    orders={orders} 
                    restaurants={restaurants} 
                    onReorder={(items) => {
                        setCart(items);
                        setActiveView('Carrito');
                    }}
                />;
      case 'Favoritos':
        const favoriteRestaurants = restaurants.filter(r => favorites.includes(r.id));
        return <FavoritesPage 
                    restaurants={favoriteRestaurants} 
                    onSelectRestaurant={handleSelectRestaurant}
                    onToggleFavorite={handleToggleFavorite}
                    allFavorites={favorites}
                />;
      case 'Perfil':
        return <ProfilePage 
                    session={session!} 
                    profile={dbProfile!} 
                    onProfileChange={handleProfileUpdate} 
                    onLogout={handleLogout}
                />;
      case 'Conviertete':
        return <BecomeCourierPage 
                  session={session!}
                  onApplicationSubmit={fetchCourierApplications}
                />;
      case 'Checkout':
        return <CheckoutPage 
                    userProfile={dbProfile!} 
                    cartItems={cart} 
                    onConfirmOrder={handleConfirmOrder} 
               />;
      case 'Carrito':
        return <CartPage cartItems={cart} onProceedToCheckout={handleProceedToCheckout} onClearCart={() => setCart([])} setCart={setCart} />;
      case 'Inicio':
      default:
        return <HomePage 
                    restaurants={restaurants}
                    onSelectRestaurant={handleSelectRestaurant}
                    onToggleFavorite={handleToggleFavorite}
                    favorites={favorites}
                    allCategories={allCategories}
                />;
    }
  };

  const renderContent = () => {
    const unreadNotifications = notifications.filter(n => !n.read).length;

    if (isDataLoading && dbProfile) { // Show loading only after profile is loaded and data is fetching
      return (
        <div className="flex-grow flex items-center justify-center">
          <p className="text-xl text-gray-400">Cargando Paritos...</p>
        </div>
      );
    }

    switch (viewRole) {
      case 'Administracion':
        return <AdminDashboard 
                    currentView={adminView} 
                    setView={setAdminView} 
                    restaurants={restaurants} 
                    onSaveRestaurant={saveRestaurant} 
                    onDeleteRestaurant={deleteRestaurant} 
                    orders={orders}
                    onUpdateOrderStatus={updateOrderStatus}
                    couriers={couriers}
                    onSaveCourier={saveCourier}
                    onDeleteCourier={deleteCourier}
                    onSaveProduct={saveProduct}
                    onDeleteProduct={deleteProduct}
                    notificationCount={unreadNotifications}
                    onNotificationsClick={() => setNotificationsOpen(true)}
                    allCategories={allCategories}
                    mediaLibrary={mediaLibrary}
                    onFileUpload={handleFileUpload}
                    onDeleteMedia={handleDeleteMedia}
                    courierApplications={courierApplications}
                    onApproveApplication={handleApproveApplication}
                    onRejectApplication={handleRejectApplication}
                />;
      case 'Mensajero':
        return <CourierDashboard 
                    orders={orders} 
                    onUpdateStatus={updateOrderStatus}
                    couriers={couriers}
                    onUpdateCourierStatus={updateCourierStatus} 
                    session={session!}
                />;
      case 'Cliente':
      default:
        return (
          <>
            <Header 
                onNotificationsClick={() => setNotificationsOpen(true)} 
                notificationCount={unreadNotifications} 
                showBackButton={activeView === 'Restaurante' || activeView === 'Checkout' || activeView === 'Conviertete'}
                onBackClick={() => {
                    if (activeView === 'Checkout') {
                        setActiveView('Carrito');
                    } else {
                        setActiveView('Inicio');
                    }
                }}
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
                userRole={viewRole}
            />
          </>
        );
    }
  };

  if (isLoading) {
      return null; // Render nothing, splash screen is visible from index.html
  }

  if (!session || !dbProfile) {
      return <AuthPage />;
  }

  return (
    <div className="bg-[#181818] text-white font-sans antialiased">
      <div className="w-full max-w-6xl mx-auto bg-[#181818] relative flex flex-col min-h-screen">
        <RoleSwitcher 
            userRole={dbProfile.role}
            currentViewRole={viewRole} 
            onRoleChange={(newRole) => {
                setViewRole(newRole);
                setActiveView('Inicio');
                setAdminView('Dashboard');
            }} 
        />
        {renderContent()}

        {newAdminOrderPopup && viewRole === 'Administracion' && (
            <NewOrderPopup 
                order={newAdminOrderPopup}
                onClose={() => setNewAdminOrderPopup(null)}
                onView={() => {
                    setAdminView('Pedidos');
                    setNewAdminOrderPopup(null);
                }}
            />
        )}
        {newCourierOrdersPopup.length > 0 && viewRole === 'Mensajero' && (
             <ReadyOrdersPopup 
                orders={newCourierOrdersPopup}
                onClose={() => setNewCourierOrdersPopup([])}
            />
        )}

        {isNotificationsOpen && (
            <NotificationsPage 
                notifications={notifications} 
                onClose={() => setNotificationsOpen(false)}
                onClear={() => setNotifications([])}
            />
        )}
        {!isInstallDismissed && deferredPrompt && viewRole === 'Cliente' && (
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
