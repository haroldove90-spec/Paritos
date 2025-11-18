import React from 'react';
import { CartIcon } from './icons/CartIcon';

interface FloatingCartButtonProps {
    itemCount: number;
    totalPrice: number;
    onClick: () => void;
}

const FloatingCartButton: React.FC<FloatingCartButtonProps> = ({ itemCount, totalPrice, onClick }) => {
    return (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-11/12 max-w-md z-20 px-4 animate-slide-up-float">
            <style>{`
                @keyframes slide-up-float {
                    from { transform: translate(-50%, 80px); opacity: 0; }
                    to { transform: translate(-50%, 0); opacity: 1; }
                }
                .animate-slide-up-float { animation: slide-up-float 0.4s ease-out forwards; }
            `}</style>
            <button 
                onClick={onClick}
                className="w-full bg-[#FFDF00] text-[#181818] rounded-lg shadow-2xl p-4 flex items-center justify-between transform hover:scale-[1.03] transition-transform duration-200"
            >
                <div className="flex items-center space-x-3">
                    <div className="relative">
                        <CartIcon className="w-6 h-6" />
                        <span className="absolute -top-2 -right-2 bg-black text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-[#FFDF00]">
                            {itemCount}
                        </span>
                    </div>
                    <span className="font-bold text-lg">Ver Carrito</span>
                </div>
                <span className="font-bold text-lg">${totalPrice.toFixed(2)}</span>
            </button>
        </div>
    );
};

export default FloatingCartButton;
