import React, { useState } from 'react';
import type { Courier } from '../../types';

interface CourierFormProps {
    courier: Courier | null;
    onSave: (courier: Courier) => void;
    onClose: () => void;
}

const CourierForm: React.FC<CourierFormProps> = ({ courier, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        name: courier?.name || '',
        vehicle: courier?.vehicle || 'Motocicleta',
        rating: courier?.rating || 4.5,
        imageUrl: courier?.imageUrl || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) : value }));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const courierToSave: Courier = {
            ...formData,
            id: courier?.id || Date.now(),
            status: courier?.status || 'desconectado',
        };
        onSave(courierToSave);
    }
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center">
            <div className="bg-[#1e1e1e] w-full max-w-lg m-4 rounded-lg shadow-lg flex flex-col">
                <header className="flex justify-between items-center p-4 border-b border-[#3A3D42]">
                    <h2 className="font-bold text-lg text-[#FFDF00]">{courier ? 'Editar' : 'Añadir'} Mensajero</h2>
                    <button onClick={onClose} className="text-2xl leading-none">&times;</button>
                </header>
                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Nombre</label>
                        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="w-full bg-[#2a2a2a] rounded-md border-transparent focus:ring-2 focus:ring-[#FFDF00]" required/>
                    </div>
                     <div>
                        <label htmlFor="vehicle" className="block text-sm font-medium text-gray-300 mb-1">Vehículo</label>
                        <input type="text" name="vehicle" id="vehicle" value={formData.vehicle} onChange={handleChange} className="w-full bg-[#2a2a2a] rounded-md border-transparent focus:ring-2 focus:ring-[#FFDF00]" required/>
                    </div>
                    <div>
                        <label htmlFor="rating" className="block text-sm font-medium text-gray-300 mb-1">Rating</label>
                        <input type="number" step="0.1" name="rating" id="rating" value={formData.rating} onChange={handleChange} className="w-full bg-[#2a2a2a] rounded-md border-transparent focus:ring-2 focus:ring-[#FFDF00]" />
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

export default CourierForm;
