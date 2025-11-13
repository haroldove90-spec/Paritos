import React from 'react';

interface InstallPWAProps {
  onInstall: () => void;
  onDismiss: () => void;
}

const InstallPWA: React.FC<InstallPWAProps> = ({ onInstall, onDismiss }) => {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-11/12 max-w-md bg-[#2a2a2a] rounded-lg shadow-2xl p-4 flex items-center justify-between z-50 animate-slide-up">
      <style>{`
        @keyframes slide-up {
          from { transform: translate(-50%, 100px); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
        .animate-slide-up { animation: slide-up 0.5s ease-out forwards; }
      `}</style>
      <div className="flex items-center">
        <img src="https://appdesignmex.com/parito.png" alt="Paritos Logo" className="w-10 h-10 mr-3" />
        <div>
            <p className="font-bold text-white">Instala Paritos</p>
            <p className="text-sm text-gray-300">Acceso rápido desde tu pantalla de inicio.</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button onClick={onInstall} className="bg-[#FFDF00] text-[#181818] font-bold py-2 px-4 rounded-lg text-sm">
            Instalar
        </button>
        <button onClick={onDismiss} className="text-gray-400 hover:text-white p-2 text-xl">&times;</button>
      </div>
    </div>
  );
};

export default InstallPWA;
