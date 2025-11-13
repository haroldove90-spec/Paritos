import React, { useState, useMemo } from 'react';
import SearchAndFilters from '../components/SearchAndFilters';
import RestaurantList from '../components/RestaurantList';
import type { Restaurant, RestaurantCategory } from '../types';

interface HomePageProps {
    restaurants: Restaurant[];
    onSelectRestaurant: (id: number) => void;
    onToggleFavorite: (restaurantId: number) => void;
    favorites: number[];
}

const HomePage: React.FC<HomePageProps> = ({ restaurants, onSelectRestaurant, onToggleFavorite, favorites }) => {
    const [activeCategory, setActiveCategory] = useState<RestaurantCategory | 'All'>('All');

    const filteredRestaurants = useMemo(() => {
        if (activeCategory === 'All') return restaurants;
        return restaurants.filter(r => r.category === activeCategory);
    }, [activeCategory, restaurants]);

    return (
        <>
            <SearchAndFilters activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
            <RestaurantList 
                restaurants={filteredRestaurants} 
                onSelectRestaurant={onSelectRestaurant}
                onToggleFavorite={onToggleFavorite}
                favorites={favorites}
            />
        </>
    );
};

export default HomePage;
