import React from 'react';
import type { Order } from '../../types';
import { BellIcon } from '../icons/BellIcon';

interface NewOrderPopupProps {
    order: Order;
    onClose: () => void;
    onView: () => void;
}

const NewOrderPopup: React.FC<NewOrderPopupProps> = ({ order, onClose, onView }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-end sm:items-center p-4 animate-fade-in-fast">
            <div className="bg-[#1e1e1e] w-full max-w-sm rounded-lg shadow-2xl p-6 text-center border-2 border-[#FFDF00] animate-slide-up">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-[#FFDF00]/20 mb-4">
                    <BellIcon className="h-8 w-8 text-[#FFDF00] animate-ping-slow" />
                </div>
                <h2 className="font-bold text-2xl text-[#FFDF00]">¡Nuevo Pedido!</h2>
                <p className="text-gray-300 mt-2">
                    Has recibido un nuevo pedido (#{order.id.toString().slice(-4)}) por un total de <span className="font-bold text-white">${order.total.toFixed(2)}</span>.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                    <button
                        onClick={onView}
                        className="bg-[#FFDF00] text-[#181818] font-bold py-3 px-6 rounded-lg hover:scale-105 transition-transform"
                    >
                        Ver Pedido
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-[#3A3D42] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#4a4d52] transition-colors"
                    >
                        Descartar
                    </button>
                </div>
            </div>
            <style>{`
                @keyframes fade-in-fast { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in-fast { animation: fade-in-fast 0.2s ease-out forwards; }
                
                @keyframes slide-up { 
                    from { transform: translateY(50px); opacity: 0; } 
                    to { transform: translateY(0); opacity: 1; }
                }
                .animate-slide-up { animation: slide-up 0.4s ease-out forwards; }

                @keyframes ping-slow {
                    75%, 100% {
                        transform: scale(1.3);
                        opacity: 0;
                    }
                }
                .animate-ping-slow { animation: ping-slow 1.5s cubic-bezier(0, 0, 0.2, 1) infinite; }
            `}</style>
        </div>
    );
};

export default NewOrderPopup;