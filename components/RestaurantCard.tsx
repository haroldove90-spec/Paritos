
import React from 'react';
import type { Restaurant } from '../types';
import { StarIcon } from './icons/StarIcon';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  return (
    <div className="bg-[#1e1e1e] rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-200">
      <div className="relative">
        <img className="w-full h-32 object-cover" src={restaurant.imageUrl} alt={restaurant.name} />
        {restaurant.isOpen && (
           <div className="absolute top-2 right-2 bg-[#FFDF00] text-[#181818] text-xs font-bold px-3 py-1 rounded-full">
            Abierto
          </div>
        )}
         {!restaurant.isOpen && (
           <div className="absolute top-2 right-2 bg-[#3A3D42] text-gray-300 text-xs font-bold px-3 py-1 rounded-full">
            Cerrado
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg text-white mb-1">{restaurant.name}</h3>
        <div className="flex items-center text-sm text-gray-300 mb-1">
          <StarIcon className="w-5 h-5 text-[#FFDF00] mr-1" />
          <span className="font-bold">{restaurant.rating}</span>
          <span className="text-gray-400 ml-1">({restaurant.reviews})</span>
          <span className="mx-2 text-gray-500">•</span>
          <span>{restaurant.deliveryTime}</span>
        </div>
        <p className="text-sm text-gray-400">{restaurant.cuisine} • {restaurant.price}</p>
      </div>
    </div>
  );
};

export default RestaurantCard;
