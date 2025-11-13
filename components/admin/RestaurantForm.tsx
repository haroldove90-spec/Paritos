import React, { useState } from 'react';
import type { Restaurant, MenuItem } from '../../types';
import { PlusIcon } from '../icons/PlusIcon';
import { TrashIcon } from '../icons/TrashIcon';
import MenuItemForm from './MenuItemForm';

interface RestaurantFormProps {
    restaurant: Restaurant | null;
    onSave: (restaurant: Restaurant) => void;
    onClose: () => void;
    allCategories: string[];
}

const RestaurantForm: React.FC<RestaurantFormProps> = ({ restaurant, onSave, onClose, allCategories }) => {
    const [formData, setFormData] = useState({
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
    
    const [menuItems, setMenuItems] = useState<MenuItem[]>(restaurant?.menuItems || []);
    const [isMenuItemFormOpen, setMenuItemFormOpen] = useState(false);
    const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);

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
            menuItems: menuItems,
        };
        onSave(restaurantToSave);
    }
    
    const handleAddNewItem = () => {
        setEditingMenuItem(null);
        setMenuItemFormOpen(true);
    };

    const handleEditItem = (item: MenuItem) => {
        setEditingMenuItem(item);
        setMenuItemFormOpen(true);
    };

    const handleDeleteItem = (itemId: number) => {
        setMenuItems(prev => prev.filter(item => item.id !== itemId));
    };

    const handleSaveMenuItem = (item: MenuItem) => {
        setMenuItems(prev => {
            const exists = prev.some(i => i.id === item.id);
            if (exists) {
                return prev.map(i => i.id === item.id ? item : i);
            }
            return [...prev, item];
        });
        setMenuItemFormOpen(false);
    };

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
                         <input 
                            type="text" 
                            name="category" 
                            id="category" 
                            value={formData.category} 
                            onChange={handleChange} 
                            className="w-full bg-[#2a2a2a] rounded-md border-transparent focus:ring-2 focus:ring-[#FFDF00]"
                            list="categories-list"
                        />
                        <datalist id="categories-list">
                            {allCategories.map(c => <option key={c} value={c} />)}
                        </datalist>
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

                    <div className="pt-4 border-t border-[#3A3D42]">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-bold text-lg text-white">Gestionar Menú</h3>
                            <button type="button" onClick={handleAddNewItem} className="bg-[#3A3D42] text-white font-bold py-2 px-3 rounded-lg flex items-center space-x-1 text-sm hover:bg-[#4a4d52]">
                                <PlusIcon className="w-4 h-4" />
                                <span>Añadir platillo</span>
                            </button>
                        </div>
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                            {menuItems.length > 0 ? (
                                menuItems.map(item => (
                                    <div key={item.id} className="bg-[#2a2a2a] p-2 rounded-md flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <img src={item.imageUrl} alt={item.name} className="w-10 h-10 rounded object-cover" />
                                            <div>
                                                <p className="font-semibold text-white text-sm">{item.name}</p>
                                                <p className="text-xs text-[#FFDF00]">${item.price.toFixed(2)}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button type="button" onClick={() => handleEditItem(item)} className="text-xs font-semibold text-gray-300 hover:text-[#FFDF00]">Editar</button>
                                            <button type="button" onClick={() => handleDeleteItem(item.id)} className="text-red-500 hover:text-red-400">
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-400 text-center py-4">Este restaurante aún no tiene platillos.</p>
                            )}
                        </div>
                    </div>

                    <footer className="pt-4 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="bg-[#3A3D42] text-white font-bold py-2 px-4 rounded-lg hover:bg-[#4a4d52]">Cancelar</button>
                        <button type="submit" className="bg-[#FFDF00] text-[#181818] font-bold py-2 px-4 rounded-lg hover:scale-105 transition-transform">Guardar Cambios</button>
                    </footer>
                </form>

                {isMenuItemFormOpen && (
                    <MenuItemForm 
                        item={editingMenuItem}
                        onSave={handleSaveMenuItem}
                        onClose={() => setMenuItemFormOpen(false)}
                    />
                )}
            </div>
        </div>
    );
};

export default RestaurantForm;