import React, { useState, useMemo } from 'react';
import SearchAndFilters from '../components/SearchAndFilters';
import RestaurantList from '../components/RestaurantList';
import type { Restaurant, RestaurantCategory } from '../types';

interface HomePageProps {
    restaurants: Restaurant[];
    onSelectRestaurant: (id: number) => void;
    onToggleFavorite: (restaurantId: number) => void;
    favorites: number[];
    allCategories: RestaurantCategory[];
}

const HomePage: React.FC<HomePageProps> = ({ restaurants, onSelectRestaurant, onToggleFavorite, favorites, allCategories }) => {
    const [activeCategory, setActiveCategory] = useState<RestaurantCategory | 'All'>('All');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredRestaurants = useMemo(() => {
        let result = restaurants;

        if (activeCategory !== 'All') {
            result = result.filter(r => r.category === activeCategory);
        }

        if (searchTerm) {
            result = result.filter(r => 
                r.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return result;
    }, [activeCategory, restaurants, searchTerm]);

    return (
        <>
            <SearchAndFilters 
                activeCategory={activeCategory} 
                onCategoryChange={setActiveCategory}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                allCategories={allCategories}
            />
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