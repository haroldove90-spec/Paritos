import React from 'react';
import type { MediaItem } from '../../types';

interface MediaLibraryModalProps {
    mediaLibrary: MediaItem[];
    onClose: () => void;
    onSelect: (url: string) => void;
}

const MediaLibraryModal: React.FC<MediaLibraryModalProps> = ({ mediaLibrary, onClose, onSelect }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-[60] flex justify-center items-center p-4">
            <div className="bg-[#1e1e1e] w-full max-w-4xl rounded-lg shadow-lg flex flex-col max-h-[90vh]">
                <header className="flex justify-between items-center p-4 border-b border-[#3A3D42]">
                    <h2 className="font-bold text-lg text-[#FFDF00]">Seleccionar de Mediateca</h2>
                    <button onClick={onClose} className="text-2xl leading-none">&times;</button>
                </header>
                <div className="p-4 overflow-y-auto">
                    {mediaLibrary.length > 0 ? (
                         <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                            {mediaLibrary.map(item => (
                                <div 
                                    key={item.id} 
                                    className="group relative bg-[#2a2a2a] rounded-lg overflow-hidden aspect-square shadow-md cursor-pointer"
                                    onClick={() => onSelect(item.url)}
                                >
                                    <img src={item.url} alt={item.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-2">
                                        <p className="text-xs text-white text-center">Seleccionar</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <p className="text-gray-400 text-lg">Tu mediateca está vacía.</p>
                        </div>
                    )}
                </div>
                <footer className="p-4 border-t border-[#3A3D42] flex justify-end">
                    <button onClick={onClose} className="bg-[#3A3D42] text-white font-bold py-2 px-4 rounded-lg hover:bg-[#4a4d52]">
                        Cerrar
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default MediaLibraryModal;
