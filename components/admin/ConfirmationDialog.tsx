import React from 'react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  zIndexClass?: string;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ isOpen, onClose, onConfirm, title, message, zIndexClass = 'z-50' }) => {
  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center p-4 animate-fade-in-fast ${zIndexClass}`}>
      <div className="bg-[#1e1e1e] w-full max-w-sm rounded-lg shadow-2xl p-6 text-center border border-[#3A3D42]">
        <h2 className="font-bold text-xl text-red-500">{title}</h2>
        <p className="text-gray-300 mt-2 mb-6">{message}</p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onClose}
            className="bg-[#3A3D42] text-white font-bold py-2 px-6 rounded-lg hover:bg-[#4a4d52] transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            Eliminar
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
  );
};

export default ConfirmationDialog;
