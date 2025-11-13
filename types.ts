export type UserRole = 'Cliente' | 'Administracion' | 'Mensajero';

export type RestaurantCategory = 'Vegetariano' | 'Pizza' | 'Sushi' | 'Mexicana' | 'Postres' | 'Café';

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
  menuItems: MenuItem[];
}

export interface CartItem extends MenuItem {
    quantity: number;
    restaurantId: number;
}

export type OrderStatus = 'en_preparacion' | 'en_camino' | 'entregado';

export interface Order {
    id: number;
    date: string;
    items: CartItem[];
    total: number;
    status: OrderStatus;
    customerName: string;
    courierId: number | null;
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
  name: string;
  vehicle: string; // e.g., 'Motocicleta', 'Bicicleta'
  status: CourierStatus;
  rating: number;
  imageUrl: string;
}