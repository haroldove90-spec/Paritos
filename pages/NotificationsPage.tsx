import React from 'react';
import type { Notification } from '../types';

interface NotificationsPageProps {
  notifications: Notification[];
  onClose: () => void;
  onClear: () => void;
}

const NotificationsPage: React.FC<NotificationsPageProps> = ({ notifications, onClose, onClear }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center">
      <div className="bg-[#1e1e1e] w-full max-w-md m-4 rounded-lg shadow-lg flex flex-col" style={{maxHeight: '80vh'}}>
        <header className="flex justify-between items-center p-4 border-b border-[#3A3D42]">
          <h2 className="font-bold text-lg text-[#FFDF00]">Notificaciones</h2>
          <button onClick={onClose} className="text-2xl leading-none">&times;</button>
        </header>
        <main className="p-4 overflow-y-auto flex-grow">
          {notifications.length === 0 ? (
            <p className="text-gray-400">No tienes notificaciones.</p>
          ) : (
            <div className="space-y-3">
              {notifications.map((notif) => (
                <div key={notif.id} className="bg-[#3A3D42] p-3 rounded-md">
                  <p>{notif.message}</p>
                  <p className="text-xs text-gray-400 mt-1 text-right">{new Date(notif.date).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </main>
        <footer className="p-4 border-t border-[#3A3D42] flex justify-end">
            <button
                onClick={onClear}
                disabled={notifications.length === 0}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
                Limpiar todo
            </button>
        </footer>
      </div>
    </div>
  );
};

export default NotificationsPage;