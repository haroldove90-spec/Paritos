import React, { useState } from 'react';
import type { Restaurant } from '../../types';
import { PlusIcon } from '../icons/PlusIcon';
import { TrashIcon } from '../icons/TrashIcon';
import RestaurantForm from './RestaurantForm';

interface ManageRestaurantsProps {
    onBack: () => void;
    restaurants: Restaurant[];
    onSave: (restaurant: Restaurant) => void;
    onDelete: (id: number) => void;
    allCategories: string[];
}

const ManageRestaurants: React.FC<ManageRestaurantsProps> = ({ onBack, restaurants, onSave, onDelete, allCategories }) => {
    const [isFormOpen, setFormOpen] = useState(false);
    const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);

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
    
    return (
        <main className="flex-grow overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <button onClick={onBack} className="text-sm text-[#FFDF00] hover:underline mb-1">&larr; Volver al Panel</button>
                    <h2 className="text-2xl font-bold text-white">Gestionar Restaurantes</h2>
                </div>
                <button onClick={handleAddNew} className="bg-[#FFDF00] text-[#181818] font-bold py-2 px-4 rounded-lg flex items-center space-x-2 hover:scale-105 transition-transform">
                    <PlusIcon className="w-5 h-5" />
                    <span>Añadir Nuevo</span>
                </button>
            </div>

            <div className="bg-[#1e1e1e] rounded-lg">
                <ul className="divide-y divide-[#3A3D42]">
                {restaurants.map(r => (
                    <li key={r.id} className="p-4 flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <img src={r.imageUrl} alt={r.name} className="w-12 h-12 rounded-md object-cover" />
                            <div>
                                <p className="font-semibold text-white">{r.name}</p>
                                <p className="text-sm text-gray-400">{r.cuisine}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button onClick={() => handleEdit(r)} className="text-sm font-semibold text-[#FFDF00] hover:underline">Editar</button>
                            <button onClick={() => onDelete(r.id)} className="text-red-500 hover:text-red-400">
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
                />
            )}
        </main>
    );
};

export default ManageRestaurants;