import type { Session } from '@supabase/supabase-js';

export type UserRole = 'Cliente' | 'Administracion' | 'Mensajero';

export type RestaurantCategory = string;

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

export interface Restaurant {
  id: number;
  name: string;
  imageUrl: string;
  rating: number;
  reviews: string;
  deliveryTime: string;
  cuisine: string;
  price: string;
  isOpen: boolean;
  category: RestaurantCategory;
  menu_items: MenuItem[];
}

export interface CartItem extends MenuItem {
    quantity: number;
    restaurantId: number;
}

export type OrderStatus = 'pendiente' | 'en_preparacion' | 'listo_para_recoger' | 'en_camino' | 'entregado';

export interface Location {
    latitude: number;
    longitude: number;
}

export interface Order {
    id: number;
    date: string;
    items: CartItem[];
    total: number;
    status: OrderStatus;
    customerName: string;
    customerAddress: string | null;
    customerLocation?: Location;
    courierId: number | null;
    restaurantId: number;
    customer_id: string;
}

export interface Notification {
    id: number;
    message: string;
    read: boolean;
    date: string;
}

export type CourierStatus = 'disponible' | 'en_entrega' | 'desconectado';

export interface Courier {
  id: number;
  user_id: string; // Corresponds to auth.users.id
  name: string;
  vehicle: string; // e.g., 'Motocicleta', 'Bicicleta'
  status: CourierStatus;
  rating: number;
  imageUrl: string;
}

export interface DBProfile {
    id: string; // Corresponds to auth.users.id
    full_name: string;
    address: string | null;
    role: UserRole;
    favorite_restaurants?: number[];
}

export type PaymentMethod = 'tarjeta' | 'efectivo';

export interface MediaItem {
  id: string; // Corresponds to the file name/path in storage
  name: string;
  url: string; // Public URL from storage provider
  created_at?: string;
}

export type CourierApplicationStatus = 'pendiente' | 'aprobado' | 'rechazado';

export interface CourierApplication {
    user_id: string;
    vehicle_type: string;
    license_plate?: string;
    status: CourierApplicationStatus;
    created_at: string;
    // This is for joining with profiles table
    profiles?: { full_name: string };
}


export { Session };

export type ActiveView = 'Inicio' | 'Pedidos' | 'Favoritos' | 'Perfil' | 'Carrito' | 'Restaurante' | 'Checkout' | 'Conviertete';