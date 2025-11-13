import React, { useState } from 'react';
import type { Restaurant, RestaurantCategory } from '../../types';

interface RestaurantFormProps {
    restaurant: Restaurant | null;
    onSave: (restaurant: Restaurant) => void;
    onClose: () => void;
}

const categories: RestaurantCategory[] = ['Vegetariano', 'Pizza', 'Sushi', 'Mexicana', 'Postres', 'Café'];

const RestaurantForm: React.FC<RestaurantFormProps> = ({ restaurant, onSave, onClose }) => {
    const [formData, setFormData] = useState<Omit<Restaurant, 'id' | 'menuItems'>>({
        name: restaurant?.name || '',
        imageUrl: restaurant?.imageUrl || 'https://picsum.photos/seed/new/400/200',
        rating: restaurant?.rating || 0,
        reviews: restaurant?.reviews || '0',
        deliveryTime: restaurant?.deliveryTime || '20-30 min',
        cuisine: restaurant?.cuisine || '',
        price: restaurant?.price || '$$',
        isOpen: restaurant?.isOpen || true,
        category: restaurant?.category || 'Mexicana',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
             setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
        } else {
             setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) : value }));
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const restaurantToSave: Restaurant = {
            ...formData,
            id: restaurant?.id || Date.now(),
            menuItems: restaurant?.menuItems || [],
        };
        onSave(restaurantToSave);
    }
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center">
            <div className="bg-[#1e1e1e] w-full max-w-lg m-4 rounded-lg shadow-lg flex flex-col">
                <header className="flex justify-between items-center p-4 border-b border-[#3A3D42]">
                    <h2 className="font-bold text-lg text-[#FFDF00]">{restaurant ? 'Editar' : 'Añadir'} Restaurante</h2>
                    <button onClick={onClose} className="text-2xl leading-none">&times;</button>
                </header>
                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Nombre</label>
                        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="w-full bg-[#2a2a2a] rounded-md border-transparent focus:ring-2 focus:ring-[#FFDF00]" required/>
                    </div>
                     <div>
                        <label htmlFor="cuisine" className="block text-sm font-medium text-gray-300 mb-1">Cocina</label>
                        <input type="text" name="cuisine" id="cuisine" value={formData.cuisine} onChange={handleChange} className="w-full bg-[#2a2a2a] rounded-md border-transparent focus:ring-2 focus:ring-[#FFDF00]" required/>
                    </div>
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">Categoría</label>
                        <select name="category" id="category" value={formData.category} onChange={handleChange} className="w-full bg-[#2a2a2a] rounded-md border-transparent focus:ring-2 focus:ring-[#FFDF00]">
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                     <div className="flex items-center space-x-4">
                        <div className="flex-1">
                            <label htmlFor="rating" className="block text-sm font-medium text-gray-300 mb-1">Rating</label>
                            <input type="number" step="0.1" name="rating" id="rating" value={formData.rating} onChange={handleChange} className="w-full bg-[#2a2a2a] rounded-md border-transparent focus:ring-2 focus:ring-[#FFDF00]" />
                        </div>
                        <div className="flex-1">
                            <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-1">Precio</label>
                            <input type="text" name="price" id="price" value={formData.price} onChange={handleChange} className="w-full bg-[#2a2a2a] rounded-md border-transparent focus:ring-2 focus:ring-[#FFDF00]" />
                        </div>
                    </div>
                    <div className="flex items-center">
                        <input type="checkbox" name="isOpen" id="isOpen" checked={formData.isOpen} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-[#FFDF00] focus:ring-[#FFDF00]" />
                        <label htmlFor="isOpen" className="ml-2 block text-sm text-gray-200">Abierto</label>
                    </div>

                    <footer className="pt-4 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="bg-[#3A3D42] text-white font-bold py-2 px-4 rounded-lg hover:bg-[#4a4d52]">Cancelar</button>
                        <button type="submit" className="bg-[#FFDF00] text-[#181818] font-bold py-2 px-4 rounded-lg hover:scale-105 transition-transform">Guardar Cambios</button>
                    </footer>
                </form>
            </div>
        </div>
    );
};

export default RestaurantForm;
