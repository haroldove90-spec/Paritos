
import React from 'react';
import type { Restaurant } from '../types';
import RestaurantCard from './RestaurantCard';

const mockRestaurants: Restaurant[] = [
  {
    id: 1,
    name: 'The Burger Joint',
    imageUrl: 'https://picsum.photos/seed/burger/400/200',
    rating: 4.7,
    reviews: '500+',
    deliveryTime: '25-35 min',
    cuisine: 'Americana',
    price: '$$',
    isOpen: true,
  },
  {
    id: 2,
    name: 'The Taco Spot',
    imageUrl: 'https://picsum.photos/seed/taco/400/200',
    rating: 4.8,
    reviews: '1k+',
    deliveryTime: '20-30 min',
    cuisine: 'Mexicana',
    price: '$$',
    isOpen: true,
  },
  {
    id: 3,
    name: 'Gourmet Pasta',
    imageUrl: 'https://picsum.photos/seed/pasta/400/200',
    rating: 4.5,
    reviews: '200+',
    deliveryTime: '30-40 min',
    cuisine: 'Italiana',
    price: '$$$',
    isOpen: false,
  },
  {
    id: 4,
    name: 'Sushi Heaven',
    imageUrl: 'https://picsum.photos/seed/sushi/400/200',
    rating: 4.9,
    reviews: '800+',
    deliveryTime: '35-45 min',
    cuisine: 'Japonesa',
    price: '$$$',
    isOpen: true,
  },
];


const RestaurantList: React.FC = () => {
  return (
    <div className="px-4 space-y-4">
      {mockRestaurants.map((restaurant) => (
        <RestaurantCard key={restaurant.id} restaurant={restaurant} />
      ))}
       <div className="h-4"></div>
    </div>
  );
};

export default RestaurantList;
