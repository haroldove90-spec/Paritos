import React, { useState, useEffect, useRef } from 'react';
import type { DBProfile, Location } from '../../types';
import { MapPinIcon } from '../icons/MapPinIcon';

interface AddressStepProps {
    userProfile: DBProfile;
    onNext: () => void;
    onLocationChange: (location: Location | null) => void;
}

const AddressStep: React.FC<AddressStepProps> = ({ userProfile, onNext, onLocationChange }) => {
    const [shareLocation, setShareLocation] = useState(false);
    const [locationError, setLocationError] = useState<string | null>(null);
    const watchIdRef = useRef<number | null>(null);

    useEffect(() => {
        if (shareLocation) {
            if (!navigator.geolocation) {
                setLocationError("Geolocalización no es soportada por este navegador.");
                return;
            }

            watchIdRef.current = navigator.geolocation.watchPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    onLocationChange({ latitude, longitude });
                    setLocationError(null);
                },
                (error) => {
                    console.error("Error obteniendo la ubicación:", error);
                    setLocationError(`Error: ${error.message}`);
                    onLocationChange(null);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0,
                }
            );
        } else {
            if (watchIdRef.current !== null) {
                navigator.geolocation.clearWatch(watchIdRef.current);
                watchIdRef.current = null;
            }
            onLocationChange(null);
        }

        return () => {
            if (watchIdRef.current !== null) {
                navigator.geolocation.clearWatch(watchIdRef.current);
            }
        };
    }, [shareLocation, onLocationChange]);


    return (
        <div className="bg-[#1e1e1e] p-6 rounded-lg shadow-lg animate-fade-in-fast">
            <h2 className="text-xl font-bold text-white mb-4">1. Confirmar Dirección de Envío</h2>
            
            <div className="bg-[#2a2a2a] p-4 rounded-md flex items-start space-x-3 mb-6">
                <MapPinIcon className="w-6 h-6 text-[#FFDF00] mt-1 flex-shrink-0" />
                <div>
                    <p className="font-semibold">{userProfile.full_name}</p>
                    <p className="text-gray-300">{userProfile.address || 'Sin dirección guardada.'}</p>
                </div>
            </div>

            <div className="bg-[#2a2a2a] p-4 rounded-md">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-semibold text-white">Compartir ubicación en tiempo real</h3>
                        <p className="text-xs text-gray-400">Para una entrega más precisa y rápida.</p>
                    </div>
                    <label htmlFor="location-toggle" className="relative inline-flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            id="location-toggle" 
                            className="sr-only peer" 
                            checked={shareLocation}
                            onChange={() => setShareLocation(!shareLocation)}
                        />
                        <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-2 peer-focus:ring-[#FFDF00] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FFDF00]"></div>
                    </label>
                </div>
                {locationError && <p className="text-red-500 text-xs mt-2">{locationError}</p>}
            </div>

            <button
                onClick={onNext}
                className="mt-6 w-full bg-[#FFDF00] text-[#181818] font-bold py-3 rounded-lg transform hover:scale-[1.03] transition-transform duration-200"
            >
                Continuar al Pago
            </button>
            <style>{`.animate-fade-in-fast { animation: fade-in-fast 0.3s ease-out forwards; } @keyframes fade-in-fast { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
        </div>
    );
};

export default AddressStep;