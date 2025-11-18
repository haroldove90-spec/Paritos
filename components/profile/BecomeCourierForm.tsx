import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import { MotorcycleIcon } from '../icons/MotorcycleIcon';

interface BecomeCourierFormProps {
    userId: string;
    onApplicationSubmit: () => void;
}

const BecomeCourierForm: React.FC<BecomeCourierFormProps> = ({ userId, onApplicationSubmit }) => {
    const [vehicleType, setVehicleType] = useState('Motocicleta');
    const [licensePlate, setLicensePlate] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const { error: insertError } = await supabase.from('courier_applications').insert({
            user_id: userId,
            vehicle_type: vehicleType,
            license_plate: licensePlate,
            status: 'pendiente',
        });

        if (insertError) {
            setError(insertError.message);
            console.error(insertError);
        } else {
            onApplicationSubmit();
        }
        setIsLoading(false);
    };

    return (
        <div className="bg-[#1e1e1e] p-6 rounded-lg shadow-lg border border-dashed border-[#FFDF00]/50">
            <div className="text-center mb-4">
                 <MotorcycleIcon className="w-10 h-10 mx-auto text-[#FFDF00]" />
                 <h3 className="font-bold text-xl text-white mt-2">¡Conviértete en Mensajero!</h3>
                 <p className="text-sm text-gray-400">Genera ingresos en tu tiempo libre entregando pedidos.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="vehicle_type" className="block text-sm font-medium text-gray-300 mb-1">Tipo de Vehículo</label>
                    <select
                        id="vehicle_type"
                        value={vehicleType}
                        onChange={(e) => setVehicleType(e.target.value)}
                        className="w-full bg-[#2a2a2a] rounded-md border-transparent focus:ring-2 focus:ring-[#FFDF00]"
                        required
                    >
                        <option>Motocicleta</option>
                        <option>Bicicleta</option>
                        <option>Automóvil</option>
                    </select>
                </div>
                <div>
                     <label htmlFor="license_plate" className="block text-sm font-medium text-gray-300 mb-1">
                        Placa <span className="text-gray-500">(Opcional)</span>
                    </label>
                    <input 
                        type="text" 
                        id="license_plate" 
                        value={licensePlate}
                        onChange={(e) => setLicensePlate(e.target.value)}
                        placeholder="ABC-123"
                        className="w-full bg-[#2a2a2a] text-white placeholder-gray-500 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#FFDF00] border border-transparent"
                    />
                </div>

                {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#FFDF00] text-[#181818] font-bold py-3 rounded-lg transform hover:scale-[1.03] transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Enviando...' : 'Enviar Solicitud'}
                </button>
            </form>
        </div>
    );
};

export default BecomeCourierForm;