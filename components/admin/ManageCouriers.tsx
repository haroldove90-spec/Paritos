import React, { useState } from 'react';
import type { Courier } from '../../types';
import { PlusIcon } from '../icons/PlusIcon';
import { TrashIcon } from '../icons/TrashIcon';
import CourierForm from './CourierForm';

interface ManageCouriersProps {
    onBack: () => void;
    couriers: Courier[];
    onSave: (courier: Courier) => void;
    onDelete: (id: number) => void;
}

const statusMap = {
    disponible: { text: 'Disponible', color: 'bg-green-500' },
    en_entrega: { text: 'En Entrega', color: 'bg-blue-500' },
    desconectado: { text: 'Desconectado', color: 'bg-gray-500' },
}

const ManageCouriers: React.FC<ManageCouriersProps> = ({ onBack, couriers, onSave, onDelete }) => {
    const [isFormOpen, setFormOpen] = useState(false);
    const [editingCourier, setEditingCourier] = useState<Courier | null>(null);

    const handleEdit = (courier: Courier) => {
        setEditingCourier(courier);
        setFormOpen(true);
    }

    const handleAddNew = () => {
        setEditingCourier(null);
        setFormOpen(true);
    }

    const handleSave = (courier: Courier) => {
        onSave(courier);
        setFormOpen(false);
    }
    
    return (
        <main className="flex-grow overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <button onClick={onBack} className="text-sm text-[#FFDF00] hover:underline mb-1">&larr; Volver al Panel</button>
                    <h2 className="text-2xl font-bold text-white">Gestionar Mensajeros</h2>
                </div>
                <button onClick={handleAddNew} className="bg-[#FFDF00] text-[#181818] font-bold py-2 px-4 rounded-lg flex items-center space-x-2 hover:scale-105 transition-transform">
                    <PlusIcon className="w-5 h-5" />
                    <span>Añadir Nuevo</span>
                </button>
            </div>

            <div className="bg-[#1e1e1e] rounded-lg">
                <ul className="divide-y divide-[#3A3D42]">
                {couriers.map(c => (
                    <li key={c.id} className="p-4 flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <img src={c.imageUrl} alt={c.name} className="w-12 h-12 rounded-full object-cover" />
                            <div>
                                <p className="font-semibold text-white">{c.name}</p>
                                <div className="flex items-center space-x-2">
                                    <div className={`w-2 h-2 rounded-full ${statusMap[c.status].color}`}></div>
                                    <p className="text-sm text-gray-400">{statusMap[c.status].text}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button onClick={() => handleEdit(c)} className="text-sm font-semibold text-[#FFDF00] hover:underline">Editar</button>
                            <button onClick={() => onDelete(c.id)} className="text-red-500 hover:text-red-400">
                                <TrashIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </li>
                ))}
                </ul>
            </div>

            {isFormOpen && (
                <CourierForm 
                    courier={editingCourier} 
                    onSave={handleSave} 
                    onClose={() => setFormOpen(false)} 
                />
            )}
        </main>
    );
};

export default ManageCouriers;