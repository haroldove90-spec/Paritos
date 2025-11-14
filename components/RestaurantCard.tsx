import React from 'react';
import type { Restaurant } from '../types';
import { StarIcon } from './icons/StarIcon';
import { HeartIcon } from './icons/HeartIcon';
import { ClockIcon } from './icons/ClockIcon';
import { ChatBubbleOvalLeftEllipsisIcon } from './icons/ChatBubbleOvalLeftEllipsisIcon';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onClick: () => void;
  onToggleFavorite: (e: React.MouseEvent) => void;
  isFavorite: boolean;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, onClick, onToggleFavorite, isFavorite }) => {
  return (
    <div onClick={onClick} className="bg-[#1e1e1e] rounded-xl overflow-hidden shadow-lg flex flex-col cursor-pointer transform hover:scale-[1.02] transition-transform duration-300 ease-in-out group">
      <div className="relative">
        <img className="w-full h-40 object-cover group-hover:brightness-75 transition-all duration-300" src={restaurant.imageUrl} alt={restaurant.name} />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>
        <div className={`absolute top-3 right-3 text-xs font-bold px-3 py-1 rounded-full ${restaurant.isOpen ? 'bg-[#FFDF00] text-[#181818]' : 'bg-gray-700 text-gray-300'}`}>
            {restaurant.isOpen ? 'Abierto' : 'Cerrado'}
        </div>
        <button 
            onClick={onToggleFavorite}
            className="absolute top-3 left-3 bg-black bg-opacity-40 rounded-full p-2 transition-all duration-200 hover:bg-opacity-60 hover:scale-110"
            aria-label={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
        >
            <HeartIcon className={`w-5 h-5 transition-colors ${isFavorite ? 'text-red-500 fill-current' : 'text-white'}`} />
        </button>
        <div className="absolute bottom-3 left-4 text-white">
            <h3 className="font-bold text-lg">{restaurant.name}</h3>
            <p className="text-sm text-gray-300">{restaurant.cuisine}</p>
        </div>
      </div>
      <div className="p-4 flex-grow flex flex-col space-y-2 text-sm">
        <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-300">
                <StarIcon className="w-5 h-5 text-[#FFDF00] mr-1.5" />
                <span className="font-bold text-white">{restaurant.rating}</span>
            </div>
            <div className="flex items-center text-gray-300">
                 <ClockIcon className="w-4 h-4 text-gray-400 mr-1" />
                 <span className="font-semibold text-gray-200">{restaurant.deliveryTime}</span>
            </div>
        </div>
        <div className="flex items-center text-gray-400 pt-2 border-t border-white/5">
            <ChatBubbleOvalLeftEllipsisIcon className="w-4 h-4 text-gray-400 mr-1.5" />
            <span className="font-medium text-gray-300">{restaurant.reviews} Reseñas</span>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;