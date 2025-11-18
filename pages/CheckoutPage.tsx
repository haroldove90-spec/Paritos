import React, { useState } from 'react';
import type { DBProfile, CartItem, Location } from '../types';
import StepIndicator from '../components/checkout/StepIndicator';
import AddressStep from '../components/checkout/AddressStep';
import PaymentStep from '../components/checkout/PaymentStep';
import ConfirmationStep from '../components/checkout/ConfirmationStep';

type CheckoutStep = 'address' | 'payment' | 'confirmation';

interface CheckoutPageProps {
    userProfile: DBProfile;
    cartItems: CartItem[];
    onConfirmOrder: (location: Location | null) => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ userProfile, cartItems, onConfirmOrder }) => {
    const [step, setStep] = useState<CheckoutStep>('address');
    const [customerLocation, setCustomerLocation] = useState<Location | null>(null);

    const renderStep = () => {
        switch (step) {
            case 'address':
                return <AddressStep 
                            userProfile={userProfile} 
                            onNext={() => setStep('payment')} 
                            onLocationChange={setCustomerLocation}
                        />;
            case 'payment':
                return <PaymentStep onNext={() => setStep('confirmation')} onBack={() => setStep('address')} />;
            case 'confirmation':
                return <ConfirmationStep 
                            cartItems={cartItems} 
                            userProfile={userProfile}
                            customerLocation={customerLocation}
                            onConfirm={() => onConfirmOrder(customerLocation)} 
                            onBack={() => setStep('payment')} 
                        />;
            default:
                return null;
        }
    };

    return (
        <div className="p-4 text-white">
            <h1 className="text-3xl font-bold mb-4 text-center">Checkout</h1>
            <StepIndicator currentStep={step} />
            <div className="mt-8">
                {renderStep()}
            </div>
        </div>
    );
};

export default CheckoutPage;