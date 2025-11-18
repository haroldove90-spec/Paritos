import React, { useState } from 'react';
import type { Courier, CourierApplication } from '../../types';
import { PlusIcon } from '../icons/PlusIcon';
import { TrashIcon } from '../icons/TrashIcon';
import CourierForm from './CourierForm';
import ConfirmationDialog from './ConfirmationDialog';

interface ManageCouriersProps {
    couriers: Courier[];
    onSave: (courier: Courier) => void;
    onDelete: (id: number) => void;
    applications: CourierApplication[];
    onApprove: (app: CourierApplication) => void;
    onReject: (app: CourierApplication) => void;
}

const statusMap = {
    disponible: { text: 'Disponible', color: 'bg-green-500' },
    en_entrega: { text: 'En Entrega', color: 'bg-blue-500' },
    desconectado: { text: 'Desconectado', color: 'bg-gray-500' },
}

const ManageCouriers: React.FC<ManageCouriersProps> = ({ couriers, onSave, onDelete, applications, onApprove, onReject }) => {
    const [isFormOpen, setFormOpen] = useState(false);
    const [editingCourier, setEditingCourier] = useState<Courier | null>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [courierToDelete, setCourierToDelete] = useState<Courier | null>(null);

    const pendingApplications = applications.filter(app => app.status === 'pendiente');

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
    
    const openDeleteConfirm = (courier: Courier) => {
        setCourierToDelete(courier);
        setIsConfirmOpen(true);
    };

    const handleConfirmDelete = () => {
        if (courierToDelete) {
            onDelete(courierToDelete.id);
        }
        setIsConfirmOpen(false);
        setCourierToDelete(null);
    };

    return (
        <main className="flex-grow overflow-y-auto p-6 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Mensajeros</h1>
                    <p className="text-md text-gray-400">Gestiona tu flota de repartidores y solicitudes.</p>
                </div>
                <button onClick={handleAddNew} className="bg-[#FFDF00] text-[#181818] font-bold py-2 px-4 rounded-lg flex items-center space-x-2 hover:scale-105 transition-transform">
                    <PlusIcon className="w-5 h-5" />
                    <span>Añadir Manual</span>
                </button>
            </div>

            {/* Pending Applications */}
            <div>
                <h2 className="text-xl font-semibold text-white mb-4">Solicitudes Pendientes ({pendingApplications.length})</h2>
                 <div className="bg-[#1e1e1e] rounded-lg">
                    {pendingApplications.length > 0 ? (
                         <ul className="divide-y divide-[#3A3D42]">
                            {pendingApplications.map(app => (
                                <li key={app.user_id} className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                                    <div>
                                        <p className="font-semibold text-white">{app.profiles?.full_name}</p>
                                        <p className="text-sm text-gray-400">Vehículo: {app.vehicle_type}</p>
                                    </div>
                                    <div className="flex items-center space-x-3 self-end sm:self-center">
                                        <button onClick={() => onReject(app)} className="text-sm font-semibold text-red-500 hover:underline">Rechazar</button>
                                        <button onClick={() => onApprove(app)} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg text-sm">Aprobar</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="p-6 text-center text-gray-400">
                            <p>No hay nuevas solicitudes de mensajeros.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Active Couriers */}
             <div>
                <h2 className="text-xl font-semibold text-white mb-4">Flota Activa ({couriers.length})</h2>
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
                                <button onClick={() => openDeleteConfirm(c)} className="text-red-500 hover:text-red-400">
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </li>
                    ))}
                    </ul>
                </div>
            </div>


            {isFormOpen && (
                <CourierForm 
                    courier={editingCourier} 
                    onSave={handleSave} 
                    onClose={() => setFormOpen(false)} 
                />
            )}
            
            <ConfirmationDialog
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Confirmar Eliminación"
                message={`¿Estás seguro de que quieres eliminar al mensajero "${courierToDelete?.name}"? Esta acción no se puede deshacer.`}
            />
        </main>
    );
};

export default ManageCouriers;