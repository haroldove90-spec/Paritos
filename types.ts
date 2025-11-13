
export type UserRole = 'Cliente' | 'Administracion' | 'Mensajero';

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
}
