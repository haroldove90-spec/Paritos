import React from 'react';
import type { Order } from '../../types';
import { TruckIcon } from '../icons/TruckIcon';

interface ReadyOrdersPopupProps {
    orders: Order[];
    onClose: () => void;
}

const ReadyOrdersPopup: React.FC<ReadyOrdersPopupProps> = ({ orders, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-end sm:items-center p-4 animate-fade-in-fast">
            <div className="bg-[#1e1e1e] w-full max-w-sm rounded-lg shadow-2xl p-6 text-center border-2 border-blue-500 animate-slide-up">
                 <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-500/20 mb-4">
                    <TruckIcon className="h-8 w-8 text-blue-400" />
                </div>
                <h2 className="font-bold text-2xl text-blue-400">¡Pedidos Listos!</h2>
                <p className="text-gray-300 mt-2">
                    {orders.length > 1 
                        ? `${orders.length} nuevos pedidos están listos`
                        : `Un nuevo pedido está listo`
                    }
                     {' '}para ser recogido.
                </p>
                 <p className="text-sm text-gray-400 mt-1">Revisa tu dashboard para aceptarlos.</p>
                <div className="mt-6">
                    <button
                        onClick={onClose}
                        className="w-full bg-blue-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        OK
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
            `}</style>
        </div>
    );
};

export default ReadyOrdersPopup;
