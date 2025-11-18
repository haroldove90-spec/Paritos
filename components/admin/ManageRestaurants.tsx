import React, { useState, useMemo } from 'react';
import type { Restaurant, MediaItem } from '../../types';
import { PlusIcon } from '../icons/PlusIcon';
import { TrashIcon } from '../icons/TrashIcon';
import RestaurantForm from './RestaurantForm';
import ConfirmationDialog from './ConfirmationDialog';

interface ManageRestaurantsProps {
    restaurants: Restaurant[];
    onSave: (restaurant: Restaurant) => void;
    onDelete: (id: number) => void;
    allCategories: string[];
    mediaLibrary: MediaItem[];
    onFileUpload: (file: File) => Promise<string | null>;
}

const ManageRestaurants: React.FC<ManageRestaurantsProps> = ({ restaurants, onSave, onDelete, allCategories, mediaLibrary, onFileUpload }) => {
    const [isFormOpen, setFormOpen] = useState(false);
    const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [restaurantToDelete, setRestaurantToDelete] = useState<Restaurant | null>(null);
    const [activeCategory, setActiveCategory] = useState('All');

    const filteredRestaurants = useMemo(() => {
        if (activeCategory === 'All') {
            return restaurants;
        }
        return restaurants.filter(r => r.category === activeCategory);
    }, [restaurants, activeCategory]);

    const handleEdit = (restaurant: Restaurant) => {
        setEditingRestaurant(restaurant);
        setFormOpen(true);
    }

    const handleAddNew = () => {
        setEditingRestaurant(null);
        setFormOpen(true);
    }

    const handleSave = (restaurant: Restaurant) => {
        onSave(restaurant);
        setFormOpen(false);
    }
    
    const openDeleteConfirm = (restaurant: Restaurant) => {
        setRestaurantToDelete(restaurant);
        setIsConfirmOpen(true);
    };

    const handleConfirmDelete = () => {
        if (restaurantToDelete) {
            onDelete(restaurantToDelete.id);
        }
        setIsConfirmOpen(false);
        setRestaurantToDelete(null);
    };

    return (
        <main className="flex-grow overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                     <h1 className="text-3xl font-bold text-white">Restaurantes</h1>
                     <p className="text-md text-gray-400">Añade o edita los locales afiliados.</p>
                </div>
                <button onClick={handleAddNew} className="bg-[#FFDF00] text-[#181818] font-bold py-2 px-4 rounded-lg flex items-center space-x-2 hover:scale-105 transition-transform">
                    <PlusIcon className="w-5 h-5" />
                    <span>Añadir Nuevo</span>
                </button>
            </div>

            <div className="mb-4 flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-hide">
                <button
                    onClick={() => setActiveCategory('All')}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 whitespace-nowrap ${activeCategory === 'All' ? 'bg-[#FFDF00] text-[#181818]' : 'bg-[#2a2a2a] text-white hover:bg-[#3a3a3a]'}`}
                >
                    Todo
                </button>
                {allCategories.map(category => (
                    <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 whitespace-nowrap ${activeCategory === category ? 'bg-[#FFDF00] text-[#181818]' : 'bg-[#2a2a2a] text-white hover:bg-[#3a3a3a]'}`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            <div className="bg-[#1e1e1e] rounded-lg">
                <ul className="divide-y divide-[#3A3D42]">
                {filteredRestaurants.map(r => (
                    <li key={r.id} className="p-4 flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <img src={r.imageUrl} alt={r.name} className="w-12 h-12 rounded-md object-cover" />
                            <div>
                                <p className="font-semibold text-white">{r.name}</p>
                                <p className="text-sm text-gray-400">
                                    {r.cuisine} &bull; <span className="font-medium text-gray-300">{r.menu_items.length} platillos</span>
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button onClick={() => handleEdit(r)} className="text-sm font-semibold text-[#FFDF00] hover:underline">Editar</button>
                            <button onClick={() => openDeleteConfirm(r)} className="text-red-500 hover:text-red-400">
                                <TrashIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </li>
                ))}
                </ul>
            </div>

            {isFormOpen && (
                <RestaurantForm 
                    restaurant={editingRestaurant} 
                    onSave={handleSave} 
                    onClose={() => setFormOpen(false)} 
                    allCategories={allCategories}
                    mediaLibrary={mediaLibrary}
                    onFileUpload={onFileUpload}
                />
            )}

            <ConfirmationDialog
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Confirmar Eliminación"
                message={`¿Estás seguro de que quieres eliminar el restaurante "${restaurantToDelete?.name}"? Esta acción no se puede deshacer.`}
            />
        </main>
    );
};

export default ManageRestaurants;