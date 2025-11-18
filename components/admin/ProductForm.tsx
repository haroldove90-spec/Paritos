import React, { useState } from 'react';
import type { MenuItem, Restaurant, MediaItem } from '../../types';
import MediaLibraryModal from './MediaLibraryModal';

interface ProductFormProps {
    productToEdit: { product: MenuItem, restaurantId: number } | null;
    restaurants: Restaurant[];
    onSave: (item: MenuItem, restaurantId: number) => void;
    onClose: () => void;
    mediaLibrary: MediaItem[];
    onFileUpload: (file: File) => Promise<string | null>;
}

const ProductForm: React.FC<ProductFormProps> = ({ productToEdit, restaurants, onSave, onClose, mediaLibrary, onFileUpload }) => {
    const [formData, setFormData] = useState<Omit<MenuItem, 'id'>>({
        name: productToEdit?.product.name || '',
        description: productToEdit?.product.description || '',
        price: productToEdit?.product.price || 0,
        imageUrl: productToEdit?.product.imageUrl || '',
    });
    
    const [selectedRestaurantId, setSelectedRestaurantId] = useState<number | ''>(productToEdit?.restaurantId || '');
    const [error, setError] = useState('');
    const [isLibraryOpen, setIsLibraryOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) : value }));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedRestaurantId === '') {
            setError('Debes seleccionar un restaurante.');
            return;
        }
        setError('');
        const itemToSave: MenuItem = {
            ...formData,
            id: productToEdit?.product.id || Date.now(),
        };
        onSave(itemToSave, selectedRestaurantId as number);
    }
    
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsUploading(true);
            const newUrl = await onFileUpload(file);
            if (newUrl) {
                setFormData(prev => ({...prev, imageUrl: newUrl}));
            }
            setIsUploading(false);
        }
    };

    const handleSelectFromLibrary = (url: string) => {
        setFormData(prev => ({ ...prev, imageUrl: url }));
        setIsLibraryOpen(false);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4">
            <div className="bg-[#1e1e1e] w-full max-w-lg rounded-lg shadow-lg flex flex-col animate-fade-in-fast">
                <header className="flex justify-between items-center p-4 border-b border-[#3A3D42]">
                    <h2 className="font-bold text-lg text-[#FFDF00]">{productToEdit ? 'Editar' : 'Añadir'} Producto</h2>
                    <button onClick={onClose} className="text-2xl leading-none">&times;</button>
                </header>
                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                    <div>
                        <label htmlFor="restaurant" className="block text-sm font-medium text-gray-300 mb-1">Restaurante</label>
                        <select 
                            id="restaurant"
                            value={selectedRestaurantId}
                            onChange={(e) => setSelectedRestaurantId(Number(e.target.value))}
                            disabled={!!productToEdit}
                            required
                            className="w-full bg-[#2a2a2a] rounded-md border-transparent focus:ring-2 focus:ring-[#FFDF00] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <option value="" disabled>Selecciona un restaurante...</option>
                            {restaurants.map(r => (
                                <option key={r.id} value={r.id}>{r.name}</option>
                            ))}
                        </select>
                        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                    </div>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Nombre del Producto</label>
                        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="w-full bg-[#2a2a2a] rounded-md border-transparent focus:ring-2 focus:ring-[#FFDF00]" required/>
                    </div>
                     <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">Descripción</label>
                        <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={3} className="w-full bg-[#2a2a2a] rounded-md border-transparent focus:ring-2 focus:ring-[#FFDF00]" required></textarea>
                    </div>
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-1">Precio</label>
                        <input type="number" step="0.01" name="price" id="price" value={formData.price} onChange={handleChange} className="w-full bg-[#2a2a2a] rounded-md border-transparent focus:ring-2 focus:ring-[#FFDF00]" required />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Imagen del Producto</label>
                        <div className="mt-1 flex justify-center items-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md space-y-1 text-center bg-[#2a2a2a]">
                            {isUploading ? (
                                <p className="text-gray-400">Subiendo...</p>
                            ) : formData.imageUrl ? (
                                <img src={formData.imageUrl} alt="Preview" className="max-h-32 rounded-md mx-auto" />
                            ) : (
                                <svg className="mx-auto h-12 w-12 text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                            )}
                            <div className="flex text-sm text-gray-400 justify-center gap-4 mt-2">
                                <label htmlFor="product-file-upload" className="relative cursor-pointer bg-[#3A3D42] rounded-md font-medium text-white hover:text-[#FFDF00] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#FFDF00] px-3 py-1">
                                    <span>Subir archivo</span>
                                    <input id="product-file-upload" name="product-file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" disabled={isUploading} />
                                </label>
                                <button type="button" onClick={() => setIsLibraryOpen(true)} className="relative cursor-pointer bg-[#3A3D42] rounded-md font-medium text-white hover:text-[#FFDF00] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#FFDF00] px-3 py-1" disabled={isUploading}>
                                    Elegir de Mediateca
                                </button>
                            </div>
                            <p className="text-xs text-gray-500">PNG, JPG, GIF hasta 10MB</p>
                        </div>
                    </div>
                    <footer className="pt-4 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="bg-[#3A3D42] text-white font-bold py-2 px-4 rounded-lg hover:bg-[#4a4d52]">Cancelar</button>
                        <button type="submit" className="bg-[#FFDF00] text-[#181818] font-bold py-2 px-4 rounded-lg hover:scale-105 transition-transform">Guardar Producto</button>
                    </footer>
                </form>
            </div>
             {isLibraryOpen && (
                <MediaLibraryModal
                    mediaLibrary={mediaLibrary}
                    onClose={() => setIsLibraryOpen(false)}
                    onSelect={handleSelectFromLibrary}
                />
            )}
            <style>{`.animate-fade-in-fast { animation: fade-in-fast 0.2s ease-out forwards; } @keyframes fade-in-fast { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }`}</style>
        </div>
    );
};

export default ProductForm;