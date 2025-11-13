import React from 'react';
import RestaurantCard from '../components/RestaurantCard';
import type { Restaurant } from '../types';

interface FavoritesPageProps {
    restaurants: Restaurant[];
    onSelectRestaurant: (id: number) => void;
    onToggleFavorite: (restaurantId: number) => void;
    allFavorites: number[];
}

const FavoritesPage: React.FC<FavoritesPageProps> = ({ restaurants, onSelectRestaurant, onToggleFavorite, allFavorites }) => {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6 text-white">Mis <span className="text-[#FFDF00]">Favoritos</span></h1>
      {restaurants.length === 0 ? (
        <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No tienes restaurantes favoritos.</p>
            <p className="text-sm text-gray-500 mt-2">Usa el ícono de corazón para guardar tus preferidos.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <RestaurantCard 
                key={restaurant.id} 
                restaurant={restaurant} 
                onClick={() => onSelectRestaurant(restaurant.id)}
                onToggleFavorite={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(restaurant.id)
                }}
                isFavorite={allFavorites.includes(restaurant.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
