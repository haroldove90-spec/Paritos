import React from 'react';
import type { Restaurant } from '../types';
import RestaurantCard from './RestaurantCard';

interface RestaurantListProps {
    restaurants: Restaurant[];
    onSelectRestaurant: (id: number) => void;
    onToggleFavorite: (restaurantId: number) => void;
    favorites: number[];
}

const RestaurantList: React.FC<RestaurantListProps> = ({ restaurants, onSelectRestaurant, onToggleFavorite, favorites }) => {
  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {restaurants.map((restaurant) => (
        <RestaurantCard 
            key={restaurant.id} 
            restaurant={restaurant}
            onClick={() => onSelectRestaurant(restaurant.id)}
            onToggleFavorite={(e) => {
                e.stopPropagation(); // Prevent card click when favoriting
                onToggleFavorite(restaurant.id)
            }}
            isFavorite={favorites.includes(restaurant.id)}
        />
      ))}
    </div>
  );
};

export default RestaurantList;
