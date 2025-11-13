import React, { useState } from 'react';
import type { UserRole } from '../types';
import { AdjustmentsVerticalIcon } from './icons/AdjustmentsVerticalIcon';
import { XIcon } from './icons/XIcon';

interface RoleSwitcherProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

const roles: UserRole[] = ['Cliente', 'Mensajero', 'Administracion'];

const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ currentRole, onRoleChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleRoleChange = (role: UserRole) => {
        onRoleChange(role);
        setIsOpen(false);
    };

    return (
        <div className="fixed bottom-24 right-4 z-50 md:bottom-6">
            <div className="relative flex flex-col items-center">
                <div
                    className={`transition-all duration-300 ease-in-out ${
                        isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
                    }`}
                >
                    <div className="flex flex-col items-center mb-4 space-y-2 p-3 bg-[#1e1e1e] rounded-xl shadow-2xl w-40">
                        <span className="text-sm font-bold text-gray-300 mb-1">Ver como:</span>
                        {roles.map((role) => (
                            <button
                                key={role}
                                onClick={() => handleRoleChange(role)}
                                className={`w-full text-center px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-200
                                ${
                                    currentRole === role
                                    ? 'bg-[#FFDF00] text-[#181818]'
                                    : 'bg-[#3A3D42] text-white hover:bg-gray-600'
                                }`}
                            >
                                {role}
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Cambiar rol de usuario"
                    className="w-16 h-16 bg-[#FFDF00] rounded-full flex items-center justify-center text-[#181818] shadow-lg transform hover:scale-110 transition-transform duration-200 focus:outline-none focus:ring-4 focus:ring-[#FFDF00]/50"
                >
                    {isOpen ? <XIcon className="w-8 h-8" /> : <AdjustmentsVerticalIcon className="w-8 h-8" />}
                </button>
            </div>
        </div>
    );
};

export default RoleSwitcher;
