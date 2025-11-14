import React from 'react';
import type { Restaurant, MenuItem, CartItem } from '../types';
import { PlusIcon } from '../components/icons/PlusIcon';
import { StarIcon } from '../components/icons/StarIcon';

interface RestaurantPageProps {
  restaurant: Restaurant;
  onAddToCart: (item: MenuItem, restaurantId: number) => void;
  cartItems: CartItem[];
}

const RestaurantPage: React.FC<RestaurantPageProps> = ({ restaurant, onAddToCart, cartItems }) => {
  return (
    <div>
        <div className="relative h-80 w-full">
            <img src={restaurant.imageUrl} alt={restaurant.name} className="w-full h-full object-cover"/>
            <div className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center text-center p-4">
                <h1 className="text-5xl font-extrabold text-white tracking-tight">{restaurant.name}</h1>
                 <div className="flex items-center text-sm mt-4 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                    <StarIcon className="w-5 h-5 text-[#FFDF00] mr-1.5" />
                    <span className="font-bold text-white">{restaurant.rating}</span>
                    <span className="text-gray-300 ml-1.5">({restaurant.reviews})</span>
                    <span className="mx-3 text-gray-400 font-light">|</span>
                    <span className="text-gray-200 font-semibold">{restaurant.cuisine}</span>
                </div>
            </div>
        </div>

        <div className="p-4">
            <h2 className="text-xl font-bold text-[#FFDF00] mb-4">Menú</h2>
            <div className="space-y-4">
                {restaurant.menuItems.map(item => {
                    const itemInCart = cartItems.find(ci => ci.id === item.id);
                    return (
                        <div key={item.id} className="flex items-center bg-[#1e1e1e] p-3 rounded-lg">
                             <img src={item.imageUrl} alt={item.name} className="w-20 h-20 rounded-md object-cover mr-4" />
                             <div className="flex-grow">
                                <h3 className="font-semibold text-lg">{item.name}</h3>
                                <p className="text-sm text-gray-400">{item.description}</p>
                                <p className="font-bold text-md mt-1 text-[#FFDF00]">${item.price.toFixed(2)}</p>
                             </div>
                             <button 
                                onClick={() => onAddToCart(item, restaurant.id)}
                                className="bg-[#FFDF00] text-[#181818] rounded-full p-2 transform hover:scale-110 transition-transform duration-200 flex items-center justify-center relative"
                                aria-label={`Añadir ${item.name} al carrito`}
                             >
                                <PlusIcon className="w-5 h-5" />
                                {itemInCart && (
                                    <span className="absolute -top-1 -right-1 bg-black text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-[#FFDF00]">
                                        {itemInCart.quantity}
                                    </span>
                                )}
                             </button>
                        </div>
                    );
                })}
            </div>
        </div>
    </div>
  );
};

export default RestaurantPage;