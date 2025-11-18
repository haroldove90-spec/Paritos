import React, { useRef, useState, useMemo } from 'react';
import type { MediaItem } from '../../types';
import { PlusIcon } from '../icons/PlusIcon';
import { TrashIcon } from '../icons/TrashIcon';
import { ClipboardIcon } from '../icons/ClipboardIcon';
import ConfirmationDialog from './ConfirmationDialog';

interface ManageMediaProps {
    mediaLibrary: MediaItem[];
    onUpload: (file: File) => void;
    onDelete: (name: string) => void;
}

type SortKey = 'name' | 'created_at';
type SortDirection = 'asc' | 'desc';

const ManageMedia: React.FC<ManageMediaProps> = ({ mediaLibrary, onUpload, onDelete }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<MediaItem | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({ key: 'created_at', direction: 'desc' });

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onUpload(file);
        }
        if (event.target) {
            event.target.value = "";
        }
    };
    
    const openDeleteConfirm = (item: MediaItem) => {
        setItemToDelete(item);
        setIsConfirmOpen(true);
    };

    const handleConfirmDelete = () => {
        if (itemToDelete) {
            onDelete(itemToDelete.id);
        }
        setIsConfirmOpen(false);
        setItemToDelete(null);
    };

    const handleCopyUrl = (url: string, id: string) => {
        navigator.clipboard.writeText(url).then(() => {
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        });
    };
    
    const handleSort = (key: SortKey) => {
        setSortConfig(prev => {
            const isAsc = prev.key === key && prev.direction === 'asc';
            return { key, direction: isAsc ? 'desc' : 'asc' };
        });
    };

    const sortedMedia = useMemo(() => {
        return [...mediaLibrary].sort((a, b) => {
            if (!a[sortConfig.key] || !b[sortConfig.key]) return 0;

            const aValue = a[sortConfig.key]!;
            const bValue = b[sortConfig.key]!;

            let comparison = 0;
            if (sortConfig.key === 'created_at') {
                comparison = new Date(aValue).getTime() - new Date(bValue).getTime();
            } else {
                comparison = (aValue as string).localeCompare(bValue as string);
            }

            return sortConfig.direction === 'asc' ? comparison : -comparison;
        });
    }, [mediaLibrary, sortConfig]);

    return (
        <main className="flex-grow overflow-y-auto p-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
                <div>
                     <h1 className="text-3xl font-bold text-white">Mediateca</h1>
                     <p className="text-md text-gray-400">Gestiona las imágenes de tus productos y restaurantes.</p>
                </div>
                 <div className="flex items-center gap-2 flex-shrink-0 self-start md:self-center">
                    <div className="flex items-center gap-2 text-sm text-gray-400 bg-[#1e1e1e] p-1 rounded-full">
                        <span className="pl-2">Ordenar:</span>
                        <button onClick={() => handleSort('name')} className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${sortConfig.key === 'name' ? 'bg-[#3a3a3a] text-white' : 'bg-transparent hover:bg-[#2a2a2a]'}`}>Nombre</button>
                        <button onClick={() => handleSort('created_at')} className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${sortConfig.key === 'created_at' ? 'bg-[#3a3a3a] text-white' : 'bg-transparent hover:bg-[#2a2a2a]'}`}>Fecha</button>
                    </div>
                    <button onClick={handleUploadClick} className="bg-[#FFDF00] text-[#181818] font-bold py-2 px-4 rounded-lg flex items-center space-x-2 hover:scale-105 transition-transform">
                        <PlusIcon className="w-5 h-5" />
                        <span>Subir</span>
                    </button>
                </div>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                />
            </div>
            
            {sortedMedia.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {sortedMedia.map(item => (
                        <div key={item.id} className="group relative bg-[#1e1e1e] rounded-lg overflow-hidden aspect-square shadow-lg">
                            <img src={item.url} alt={item.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-2">
                                <div className="flex justify-end gap-2">
                                     <button onClick={() => handleCopyUrl(item.url, item.id)} className="bg-black/50 p-2 rounded-full text-white hover:bg-black/80" title="Copiar URL">
                                        <ClipboardIcon className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => openDeleteConfirm(item)} className="bg-black/50 p-2 rounded-full text-white hover:bg-red-500" title="Eliminar Imagen">
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </div>
                                <p className="text-xs text-white truncate" title={item.name}>{item.name}</p>
                            </div>
                             {copiedId === item.id && (
                                <div className="absolute inset-x-0 bottom-0 bg-[#FFDF00] text-center text-[#181818] text-xs font-bold py-1 animate-fade-out">
                                    ¡Copiado!
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-[#1e1e1e] rounded-lg">
                    <p className="text-gray-400 text-lg">Tu mediateca está vacía.</p>
                    <p className="text-sm text-gray-500 mt-2">Haz clic en "Subir" para empezar.</p>
                </div>
            )}
            
            <ConfirmationDialog
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Confirmar Eliminación"
                message={`¿Estás seguro de que quieres eliminar la imagen "${itemToDelete?.name}"? Esta acción no se puede deshacer.`}
            />

            <style>{`
                @keyframes fade-out {
                    from { opacity: 1; transform: translateY(0); }
                    to { opacity: 0; transform: translateY(10px); }
                }
                .animate-fade-out {
                    animation: fade-out 2s ease-out forwards;
                }
            `}</style>
        </main>
    );
};

export default ManageMedia;