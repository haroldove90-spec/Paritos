import React, { useState, useEffect } from 'react';
import type { Session } from '@supabase/supabase-js';
import { UserIcon } from '../components/icons/UserIcon';
import type { DBProfile } from '../types';

interface ProfilePageProps {
    session: Session;
    profile: DBProfile;
    onProfileChange: (updates: Partial<DBProfile>) => void;
    onLogout: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ session, profile, onProfileChange, onLogout }) => {
    const [name, setName] = useState(profile.full_name);
    const [address, setAddress] = useState(profile.address || '');
    const [isSaving, setIsSaving] = useState(false);
    
    useEffect(() => {
        setName(profile.full_name);
        setAddress(profile.address || '');
    }, [profile]);

    const handleSaveChanges = async () => {
        setIsSaving(true);
        onProfileChange({ full_name: name, address });
        setTimeout(() => setIsSaving(false), 1000);
    };

    return (
        <div className="p-4 text-white flex flex-col items-center">
            <div className="w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center text-[#FFDF00]">Mi Perfil</h1>
                <div className="flex flex-col items-center">
                    <div className="w-24 h-24 bg-[#3A3D42] rounded-full flex items-center justify-center mb-4">
                        <UserIcon className="w-16 h-16 text-gray-400" />
                    </div>
                    <h2 className="text-xl font-semibold">{profile.full_name}</h2>
                    <p className="text-gray-400">{session.user.email}</p>
                </div>

                <div className="w-full mt-8 space-y-6">
                    <div className="bg-[#1e1e1e] p-4 rounded-lg">
                        <h3 className="font-semibold text-lg mb-3">Información Personal</h3>
                        <div className="space-y-3">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">Nombre Completo</label>
                                <input 
                                    type="text" 
                                    id="name" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-[#2a2a2a] text-white placeholder-gray-400 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#FFDF00] border border-transparent"
                                    placeholder="Tu nombre"
                                />
                            </div>
                            <div>
                                <label htmlFor="address" className="block text-sm font-medium text-gray-400 mb-1">Dirección (calle, número, colonia)</label>
                                <input 
                                    type="text" 
                                    id="address" 
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="w-full bg-[#2a2a2a] text-white placeholder-gray-400 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#FFDF00] border border-transparent"
                                    placeholder="Ej: Av. Siempre Viva 123"
                                />
                            </div>
                            <button 
                                onClick={handleSaveChanges}
                                disabled={isSaving}
                                className="w-full bg-[#FFDF00] text-[#181818] font-bold py-2 rounded-lg transform hover:scale-[1.03] transition-transform duration-200 disabled:bg-yellow-700"
                            >
                                {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                        </div>
                    </div>

                    <button 
                        onClick={onLogout}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors duration-200"
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;