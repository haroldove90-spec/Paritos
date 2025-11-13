import React, { useState } from 'react';
import type { MenuItem } from '../../types';

interface MenuItemFormProps {
    item: MenuItem | null;
    onSave: (item: MenuItem) => void;
    onClose: () => void;
}

const MenuItemForm: React.FC<MenuItemFormProps> = ({ item, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        name: item?.name || '',
        description: item?.description || '',
        price: item?.price || 0,
        imageUrl: item?.imageUrl || `https://picsum.photos/seed/${Math.random()}/200/200`,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) : value }));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const itemToSave: MenuItem = {
            ...formData,
            id: item?.id || Date.now(),
        };
        onSave(itemToSave);
    }
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-[60] flex justify-center items-center">
            <div className="bg-[#1e1e1e] w-full max-w-md m-4 rounded-lg shadow-lg flex flex-col">
                <header className="flex justify-between items-center p-4 border-b border-[#3A3D42]">
                    <h2 className="font-bold text-lg text-[#FFDF00]">{item ? 'Editar' : 'Añadir'} Platillo</h2>
                    <button onClick={onClose} className="text-2xl leading-none">&times;</button>
                </header>
                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Nombre</label>
                        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="w-full bg-[#2a2a2a] rounded-md border-transparent focus:ring-2 focus:ring-[#FFDF00]" required/>
                    </div>
                     <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">Descripción</label>
                        <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={3} className="w-full bg-[#2a2a2a] rounded-md border-transparent focus:ring-2 focus:ring-[#FFDF00]" required></textarea>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="flex-1">
                            <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-1">Precio</label>
                            <input type="number" step="0.01" name="price" id="price" value={formData.price} onChange={handleChange} className="w-full bg-[#2a2a2a] rounded-md border-transparent focus:ring-2 focus:ring-[#FFDF00]" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-300 mb-1">URL de Imagen</label>
                        <input type="text" name="imageUrl" id="imageUrl" value={formData.imageUrl} onChange={handleChange} className="w-full bg-[#2a2a2a] rounded-md border-transparent focus:ring-2 focus:ring-[#FFDF00]" required/>
                    </div>
                    <footer className="pt-4 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="bg-[#3A3D42] text-white font-bold py-2 px-4 rounded-lg hover:bg-[#4a4d52]">Cancelar</button>
                        <button type="submit" className="bg-[#FFDF00] text-[#181818] font-bold py-2 px-4 rounded-lg hover:scale-105 transition-transform">Guardar Platillo</button>
                    </footer>
                </form>
            </div>
        </div>
    );
};

export default MenuItemForm;