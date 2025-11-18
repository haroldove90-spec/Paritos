import React, { useState } from 'react';
import type { PaymentMethod } from '../../types';
import { CreditCardIcon } from '../icons/CreditCardIcon';

interface PaymentStepProps {
    onNext: () => void;
    onBack: () => void;
}

const PaymentStep: React.FC<PaymentStepProps> = ({ onNext, onBack }) => {
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('tarjeta');
    const [cardInfo, setCardInfo] = useState({ number: '', name: '', expiry: '', cvv: '' });
    const [errors, setErrors] = useState({ number: '', expiry: '', cvv: '' });

    const validate = () => {
        if (paymentMethod === 'efectivo') return true;
        
        let isValid = true;
        const newErrors = { number: '', expiry: '', cvv: '' };

        if (!/^\d{16}$/.test(cardInfo.number.replace(/\s/g, ''))) {
            newErrors.number = 'Número de tarjeta inválido.';
            isValid = false;
        }
        if (!/^\d{2}\/\d{2}$/.test(cardInfo.expiry)) {
            newErrors.expiry = 'Formato MM/AA inválido.';
            isValid = false;
        }
        if (!/^\d{3,4}$/.test(cardInfo.cvv)) {
            newErrors.cvv = 'CVV inválido.';
            isValid = false;
        }
        setErrors(newErrors);
        return isValid;
    };

    const handleNext = () => {
        if (validate()) {
            onNext();
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCardInfo(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="bg-[#1e1e1e] p-6 rounded-lg shadow-lg animate-fade-in-fast">
            <h2 className="text-xl font-bold text-white mb-4">2. Método de Pago</h2>
            <div className="flex space-x-4 mb-6">
                <button 
                    onClick={() => setPaymentMethod('tarjeta')}
                    className={`flex-1 p-4 rounded-lg border-2 transition-colors ${paymentMethod === 'tarjeta' ? 'border-[#FFDF00] bg-[#FFDF00]/10' : 'border-[#3A3D42] bg-[#2a2a2a]'}`}
                >
                    <CreditCardIcon className="w-6 h-6 mx-auto mb-2"/>
                    Tarjeta
                </button>
                <button 
                    onClick={() => setPaymentMethod('efectivo')}
                    className={`flex-1 p-4 rounded-lg border-2 transition-colors ${paymentMethod === 'efectivo' ? 'border-[#FFDF00] bg-[#FFDF00]/10' : 'border-[#3A3D42] bg-[#2a2a2a]'}`}
                >
                    <span className="text-2xl">💵</span>
                    <p className="mt-1">Efectivo</p>
                </button>
            </div>

            {paymentMethod === 'tarjeta' && (
                <div className="space-y-4 animate-fade-in-fast">
                    {/* Card form inputs */}
                    <div>
                        <input name="number" placeholder="Número de Tarjeta" value={cardInfo.number} onChange={handleInputChange} className="w-full bg-[#2a2a2a] p-3 rounded-md" />
                        {errors.number && <p className="text-red-500 text-xs mt-1">{errors.number}</p>}
                    </div>
                     <div>
                        <input name="name" placeholder="Nombre en la Tarjeta" value={cardInfo.name} onChange={handleInputChange} className="w-full bg-[#2a2a2a] p-3 rounded-md" />
                    </div>
                    <div className="flex space-x-4">
                        <div className="w-1/2">
                            <input name="expiry" placeholder="MM/AA" value={cardInfo.expiry} onChange={handleInputChange} className="w-full bg-[#2a2a2a] p-3 rounded-md" />
                            {errors.expiry && <p className="text-red-500 text-xs mt-1">{errors.expiry}</p>}
                        </div>
                        <div className="w-1/2">
                            <input name="cvv" placeholder="CVV" value={cardInfo.cvv} onChange={handleInputChange} className="w-full bg-[#2a2a2a] p-3 rounded-md" />
                            {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
                        </div>
                    </div>
                </div>
            )}

            {paymentMethod === 'efectivo' && (
                 <div className="bg-[#2a2a2a] p-4 rounded-md text-center animate-fade-in-fast">
                    <p className="text-gray-300">Pagarás en efectivo al momento de la entrega.</p>
                </div>
            )}

            <div className="mt-8 flex justify-between items-center">
                <button
                    onClick={onBack}
                    className="bg-[#3A3D42] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#4a4d52] transition-colors"
                >
                    Atrás
                </button>
                <button
                    onClick={handleNext}
                    className="bg-[#FFDF00] text-[#181818] font-bold py-3 px-6 rounded-lg transform hover:scale-[1.03] transition-transform duration-200"
                >
                    Revisar Pedido
                </button>
            </div>
            <style>{`.animate-fade-in-fast { animation: fade-in-fast 0.3s ease-out forwards; } @keyframes fade-in-fast { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
        </div>
    );
};

export default PaymentStep;
