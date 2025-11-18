import React from 'react';

type CheckoutStep = 'address' | 'payment' | 'confirmation';

interface StepIndicatorProps {
    currentStep: CheckoutStep;
}

const steps: { id: CheckoutStep; label: string }[] = [
    { id: 'address', label: 'Dirección' },
    { id: 'payment', label: 'Pago' },
    { id: 'confirmation', label: 'Confirmar' },
];

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
    const currentStepIndex = steps.findIndex(s => s.id === currentStep);

    return (
        <div className="flex items-center justify-center">
            {steps.map((step, index) => {
                const isActive = index === currentStepIndex;
                const isCompleted = index < currentStepIndex;

                return (
                    <React.Fragment key={step.id}>
                        <div className="flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                                isActive ? 'border-[#FFDF00] bg-[#FFDF00]/20 scale-110' :
                                isCompleted ? 'border-green-500 bg-green-500/20' :
                                'border-gray-600'
                            }`}>
                                {isCompleted && <span className="text-green-500">✓</span>}
                                {isActive && <div className="w-3 h-3 rounded-full bg-[#FFDF00] animate-pulse"></div>}
                            </div>
                            <span className={`text-xs mt-2 font-semibold ${isActive || isCompleted ? 'text-white' : 'text-gray-500'}`}>{step.label}</span>
                        </div>

                        {index < steps.length - 1 && (
                             <div className={`flex-1 h-1 mx-4 rounded ${isCompleted ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

export default StepIndicator;