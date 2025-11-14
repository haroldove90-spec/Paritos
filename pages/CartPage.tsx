import React, { useState } from 'react';
import type { CartItem } from '../types';
import { TrashIcon } from '../components/icons/TrashIcon';

interface CartPageProps {
  cartItems: CartItem[];
  onPlaceOrder: () => void;
  onClearCart: () => void;
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

const CartPage: React.FC<CartPageProps> = ({ cartItems, onPlaceOrder, onClearCart, setCart }) => {
  const [isConfirmingClear, setIsConfirmingClear] = useState(false);

  const totalPrice = cartItems.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  const handleRemoveItem = (itemId: number) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  }

  const handleQuantityChange = (itemId: number, delta: number) => {
    setCart(prev => prev.map(item => {
        if (item.id === itemId) {
            const newQuantity = item.quantity + delta;
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
        }
        return item;
    }).filter((item): item is CartItem => item !== null));
  }
  
  const handleConfirmClear = () => {
    onClearCart();
    setIsConfirmingClear(false);
  }

  return (
    <div className="p-4 text-white">
      <h1 className="text-3xl font-bold mb-6 text-white">Mi <span className="text-[#FFDF00]">Carrito</span></h1>
      {cartItems.length === 0 ? (
        <div className="text-center py-20">
            <p className="text-gray-400 text-lg">Tu carrito está vacío.</p>
            <p className="text-sm text-gray-500 mt-2">Añade platillos para empezar a ordenar.</p>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center bg-[#1e1e1e] p-3 rounded-lg">
                <img src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded-md object-cover mr-4" />
                <div className="flex-grow">
                  <h2 className="font-semibold">{item.name}</h2>
                  <p className="font-bold text-[#FFDF00] text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <div className="flex items-center space-x-3">
                    <button onClick={() => handleQuantityChange(item.id, -1)} className="bg-[#3A3D42] w-7 h-7 rounded-full font-bold">-</button>
                    <span className="font-bold w-4 text-center">{item.quantity}</span>
                    <button onClick={() => handleQuantityChange(item.id, 1)} className="bg-[#3A3D42] w-7 h-7 rounded-full font-bold">+</button>
                </div>
                 <button onClick={() => handleRemoveItem(item.id)} className="ml-4 text-gray-500 hover:text-red-500">
                    <TrashIcon className="w-5 h-5"/>
                </button>
              </div>
            ))}
          </div>
          <div className="border-t border-[#3A3D42] my-4 pt-4 space-y-2">
            <div className="flex justify-between items-center text-lg">
                <span className="text-gray-300">Subtotal:</span>
                <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-lg">
                <span className="text-gray-300">Envío:</span>
                <span>$45.00</span>
            </div>
            <div className="flex justify-between items-center text-xl font-bold mt-2">
                <span className="text-[#FFDF00]">Total:</span>
                <span className="text-[#FFDF00]">${(totalPrice + 45).toFixed(2)}</span>
            </div>
          </div>
          <div className="mt-8 flex flex-col space-y-3">
            <button
              onClick={onPlaceOrder}
              className="w-full bg-[#FFDF00] text-[#181818] font-bold py-3 rounded-lg transform hover:scale-[1.03] transition-transform duration-200"
            >
              Realizar Pedido
            </button>
            <button
              onClick={() => setIsConfirmingClear(true)}
              className="w-full bg-[#3A3D42] text-white font-bold py-2 rounded-lg hover:bg-[#4a4d52] transition-colors"
            >
              Vaciar Carrito
            </button>
          </div>
        </>
      )}

      {isConfirmingClear && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4 animate-fade-in-fast">
            <div className="bg-[#1e1e1e] w-full max-w-sm rounded-lg shadow-2xl p-6 text-center border border-[#3A3D42]">
                <h2 className="font-bold text-xl text-[#FFDF00]">¿Vaciar Carrito?</h2>
                <p className="text-gray-300 mt-2 mb-6">
                    ¿Estás seguro de que quieres eliminar todos los artículos de tu carrito?
                </p>
                <div className="flex justify-center space-x-4">
                    <button
                        onClick={() => setIsConfirmingClear(false)}
                        className="bg-[#3A3D42] text-white font-bold py-2 px-6 rounded-lg hover:bg-[#4a4d52] transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleConfirmClear}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                    >
                        Vaciar
                    </button>
                </div>
            </div>
            <style>{`
                @keyframes fade-in-fast {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in-fast { animation: fade-in-fast 0.2s ease-out forwards; }
            `}</style>
        </div>
      )}
    </div>
  );
};

export default CartPage;