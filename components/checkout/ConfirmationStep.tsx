import React, { useState } from 'react';
import type { CartItem, DBProfile, Location } from '../../types';
import { MapPinIcon } from '../icons/MapPinIcon';

interface ConfirmationStepProps {
    cartItems: CartItem[];
    userProfile: DBProfile;
    customerLocation: Location | null;
    onConfirm: () => void;
    onBack: () => void;
}

const ConfirmationStep: React.FC<ConfirmationStepProps> = ({ cartItems, userProfile, customerLocation, onConfirm, onBack }) => {
    const [isProcessing, setIsProcessing] = useState(false);

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingCost = 45.00;
    const total = subtotal + shippingCost;

    const handleConfirm = () => {
        setIsProcessing(true);
        // Simulate API call
        setTimeout(() => {
            onConfirm();
        }, 2000);
    };

    return (
        <div className="bg-[#1e1e1e] p-6 rounded-lg shadow-lg animate-fade-in-fast">
            <h2 className="text-xl font-bold text-white mb-4">3. Confirmar Pedido</h2>

            {/* Order Summary */}
            <div className="space-y-3 mb-6">
                <h3 className="font-semibold text-lg text-[#FFDF00]">Resumen de Artículos</h3>
                {cartItems.map(item => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                        <span className="text-gray-300">{item.quantity} x {item.name}</span>
                        <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                ))}
            </div>

            {/* Cost Breakdown */}
            <div className="border-t border-b border-[#3A3D42] py-4 my-4 space-y-2">
                <div className="flex justify-between items-center">
                    <span className="text-gray-300">Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-300">Envío:</span>
                    <span>${shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-xl font-bold mt-2">
                    <span className="text-[#FFDF00]">Total:</span>
                    <span className="text-[#FFDF00]">${total.toFixed(2)}</span>
                </div>
            </div>

            {/* Shipping Address */}
            <div className="mb-6">
                <h3 className="font-semibold text-lg text-[#FFDF00] mb-3">Dirección de Entrega</h3>
                <div className="bg-[#2a2a2a] p-4 rounded-md flex items-start space-x-3">
                    <MapPinIcon className="w-6 h-6 text-gray-400 mt-1 flex-shrink-0" />
                    <div>
                        <p className="font-semibold">{userProfile.full_name}</p>
                        <p className="text-gray-300">{userProfile.address}</p>
                        {customerLocation && (
                            <p className="text-xs text-green-400 mt-2 animate-pulse">
                                Compartiendo ubicación en tiempo real para una entrega precisa.
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-between items-center">
                <button
                    onClick={onBack}
                    disabled={isProcessing}
                    className="bg-[#3A3D42] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#4a4d52] transition-colors disabled:opacity-50"
                >
                    Atrás
                </button>
                <button
                    onClick={handleConfirm}
                    disabled={isProcessing}
                    className="bg-[#FFDF00] text-[#181818] font-bold py-3 px-6 rounded-lg transform hover:scale-[1.03] transition-transform duration-200 disabled:opacity-50 disabled:scale-100 flex items-center justify-center min-w-[200px]"
                >
                    {isProcessing ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#181818]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Procesando...
                        </>
                    ) : (
                        'Confirmar y Pagar'
                    )}
                </button>
            </div>
            <style>{`.animate-fade-in-fast { animation: fade-in-fast 0.3s ease-out forwards; } @keyframes fade-in-fast { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
        </div>
    );
};

export default ConfirmationStep;