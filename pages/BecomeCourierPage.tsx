import React, { useState, useEffect } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../supabaseClient';
import type { CourierApplication } from '../types';
import BecomeCourierForm from '../components/profile/BecomeCourierForm';

interface BecomeCourierPageProps {
    session: Session;
    onApplicationSubmit: () => void;
}

const BecomeCourierPage: React.FC<BecomeCourierPageProps> = ({ session, onApplicationSubmit }) => {
    const [courierApplication, setCourierApplication] = useState<CourierApplication | null>(null);
    const [isLoadingApp, setIsLoadingApp] = useState(true);

    useEffect(() => {
        const fetchApplicationStatus = async () => {
            setIsLoadingApp(true);
            const { data, error } = await supabase
                .from('courier_applications')
                .select('*')
                .eq('user_id', session.user.id)
                .single();
            
            if (error && error.code !== 'PGRST116') {
                console.error('Error fetching courier application:', error);
            }

            setCourierApplication(data);
            setIsLoadingApp(false);
        };
        fetchApplicationStatus();
    }, [session.user.id, onApplicationSubmit]);
    
    const renderContent = () => {
        if (isLoadingApp) {
            return (
                <div className="bg-[#1e1e1e] p-6 rounded-lg text-center mt-8">
                    <p className="text-gray-400 animate-pulse">Verificando estado de solicitud...</p>
                </div>
            );
        }

        if (courierApplication) {
            if (courierApplication.status === 'pendiente') {
                return (
                     <div className="bg-[#1e1e1e] p-4 rounded-lg text-center border border-yellow-500/50 mt-8">
                        <h3 className="font-semibold text-lg mb-2 text-[#FFDF00]">Solicitud Enviada</h3>
                        <p className="text-gray-300">Tu solicitud para ser mensajero está siendo revisada. Te notificaremos pronto.</p>
                    </div>
                );
            }
            if (courierApplication.status === 'rechazado') {
                 return (
                     <div className="bg-red-900/50 border border-red-700 p-4 rounded-lg text-center mt-8">
                        <h3 className="font-semibold text-lg mb-2 text-red-400">Solicitud Rechazada</h3>
                        <p className="text-gray-300">Lamentablemente, tu solicitud no fue aprobada en este momento.</p>
                    </div>
                );
            }
            return null;
        }

        return <BecomeCourierForm userId={session.user.id} onApplicationSubmit={onApplicationSubmit} />;
    }

    return (
         <div className="p-4 text-white flex flex-col items-center">
            <div className="w-full max-w-md">
                {renderContent()}
            </div>
        </div>
    );
};

export default BecomeCourierPage;