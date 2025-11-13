import React from 'react';
import { UserIcon } from '../components/icons/UserIcon';

const ProfilePage: React.FC = () => {
  return (
    <div className="p-4 text-white flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-6 text-[#FFDF00]">Mi Perfil</h1>
        <div className="w-24 h-24 bg-[#3A3D42] rounded-full flex items-center justify-center mb-4">
            <UserIcon className="w-16 h-16 text-gray-400" />
        </div>
        <h2 className="text-xl font-semibold">Cliente Paritos</h2>
        <p className="text-gray-400">cliente@paritos.com</p>

        <div className="w-full max-w-md mt-8 space-y-3">
             <div className="bg-[#1e1e1e] p-4 rounded-lg flex justify-between items-center">
                <span className="font-semibold">Dirección de Envío</span>
                <span className="text-gray-400">Av. Siempre Viva 123</span>
            </div>
            <div className="bg-[#1e1e1e] p-4 rounded-lg flex justify-between items-center">
                <span className="font-semibold">Método de Pago</span>
                <span className="text-gray-400">**** **** **** 1234</span>
            </div>
             <div className="bg-[#1e1e1e] p-4 rounded-lg flex justify-between items-center">
                <span className="font-semibold">Teléfono</span>
                <span className="text-gray-400">+52 55 1234 5678</span>
            </div>
        </div>

         <button className="mt-8 w-full max-w-md bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors duration-200">
            Cerrar Sesión
        </button>
    </div>
  );
};

export default ProfilePage;