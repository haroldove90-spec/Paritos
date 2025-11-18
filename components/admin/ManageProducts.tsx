import React, { useState, useMemo } from 'react';
import type { Restaurant, MenuItem, MediaItem } from '../../types';
import { PlusIcon } from '../icons/PlusIcon';
import { TrashIcon } from '../icons/TrashIcon';
import { SearchIcon } from '../icons/SearchIcon';
import ProductForm from './ProductForm';
import ConfirmationDialog from './ConfirmationDialog';

interface ManageProductsProps {
    restaurants: Restaurant[];
    onSaveProduct: (product: MenuItem, restaurantId: number) => void;
    onDeleteProduct: (productId: number, restaurantId: number) => void;
    mediaLibrary: MediaItem[];
    onFileUpload: (file: File) => Promise<string | null>;
}

type EditableProduct = { product: MenuItem, restaurantId: number };

type ProductWithRestaurant = MenuItem & {
    restaurantId: number;
    restaurantName: string;
};

type SortKey = 'name' | 'price' | 'restaurantName';
type SortDirection = 'asc' | 'desc';

const ManageProducts: React.FC<ManageProductsProps> = ({ restaurants, onSaveProduct, onDeleteProduct, mediaLibrary, onFileUpload }) => {
    const [isFormOpen, setFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<EditableProduct | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<ProductWithRestaurant | null>(null);
    const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({ key: 'name', direction: 'asc' });

    const allProducts = useMemo((): ProductWithRestaurant[] => {
        return restaurants.flatMap(r => 
            r.menu_items.map(item => ({
                ...item,
                restaurantId: r.id,
                restaurantName: r.name,
            }))
        );
    }, [restaurants]);

    const processedProducts = useMemo(() => {
        const filtered = allProducts.filter(p => 
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.restaurantName.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        filtered.sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];
            
            let comparison = 0;
            if (typeof aValue === 'string' && typeof bValue === 'string') {
                comparison = aValue.localeCompare(bValue);
            } else if (typeof aValue === 'number' && typeof bValue === 'number') {
                comparison = aValue - bValue;
            }

            return sortConfig.direction === 'asc' ? comparison : -comparison;
        });

        return filtered;
    }, [allProducts, searchTerm, sortConfig]);

    const handleSort = (key: SortKey) => {
        setSortConfig(prev => {
            const isAsc = prev.key === key && prev.direction === 'asc';
            return { key, direction: isAsc ? 'desc' : 'asc' };
        });
    };

    const handleEdit = (product: ProductWithRestaurant) => {
        const { restaurantName, restaurantId, ...productData } = product;
        setEditingProduct({ product: productData, restaurantId });
        setFormOpen(true);
    }

    const handleAddNew = () => {
        setEditingProduct(null);
        setFormOpen(true);
    }

    const handleSave = (product: MenuItem, restaurantId: number) => {
        onSaveProduct(product, restaurantId);
        setFormOpen(false);
    }

    const openDeleteConfirm = (product: ProductWithRestaurant) => {
        setProductToDelete(product);
        setIsConfirmOpen(true);
    };

    const handleConfirmDelete = () => {
        if (productToDelete) {
            onDeleteProduct(productToDelete.id, productToDelete.restaurantId);
        }
        setIsConfirmOpen(false);
        setProductToDelete(null);
    };

    const SortButton: React.FC<{ sortKey: SortKey, label: string }> = ({ sortKey, label }) => {
        const isActive = sortConfig.key === sortKey;
        const directionIcon = sortConfig.direction === 'asc' ? '▲' : '▼';
        return (
             <button 
                onClick={() => handleSort(sortKey)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors duration-200 ${isActive ? 'bg-[#3a3a3a] text-white' : 'bg-transparent text-gray-400 hover:bg-[#2a2a2a]'}`}
            >
                {label} {isActive && directionIcon}
            </button>
        );
    };
    
    return (
        <main className="flex-grow overflow-y-auto p-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-2 gap-4">
                <div>
                     <h1 className="text-3xl font-bold text-white">Productos</h1>
                     <p className="text-md text-gray-400">Gestiona todos los platillos de los restaurantes.</p>
                </div>
                <button onClick={handleAddNew} className="bg-[#FFDF00] text-[#181818] font-bold py-2 px-4 rounded-lg flex items-center space-x-2 hover:scale-105 transition-transform flex-shrink-0 self-start md:self-center">
                    <PlusIcon className="w-5 h-5" />
                    <span>Añadir</span>
                </button>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar producto o restaurante..."
                        className="w-full bg-[#2a2a2a] text-white placeholder-gray-400 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[#FFDF00]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400 bg-[#1e1e1e] p-1 rounded-full">
                    <span className="pl-2">Ordenar:</span>
                    <SortButton sortKey="name" label="Nombre" />
                    <SortButton sortKey="price" label="Precio" />
                    <SortButton sortKey="restaurantName" label="Restaurante" />
                </div>
            </div>

            <div className="bg-[#1e1e1e] rounded-lg">
                <ul className="divide-y divide-[#3A3D42]">
                {processedProducts.length > 0 ? processedProducts.map(p => (
                    <li key={`${p.id}-${p.restaurantId}`} className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                        <div className="flex items-center space-x-4">
                            <img src={p.imageUrl} alt={p.name} className="w-12 h-12 rounded-md object-cover flex-shrink-0" />
                            <div>
                                <p className="font-semibold text-white">{p.name}</p>
                                <p className="text-sm text-gray-400">{p.restaurantName}</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-end space-x-4">
                             <p className="font-bold text-lg text-[#FFDF00]">${p.price.toFixed(2)}</p>
                             <button onClick={() => handleEdit(p)} className="text-sm font-semibold text-[#FFDF00] hover:underline">Editar</button>
                            <button onClick={() => openDeleteConfirm(p)} className="text-red-500 hover:text-red-400">
                                <TrashIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </li>
                )) : (
                    <li className="p-8 text-center text-gray-400">
                        No se encontraron productos con ese criterio de búsqueda.
                    </li>
                )}
                </ul>
            </div>

            {isFormOpen && (
                <ProductForm
                    productToEdit={editingProduct} 
                    restaurants={restaurants}
                    onSave={handleSave} 
                    onClose={() => setFormOpen(false)}
                    mediaLibrary={mediaLibrary}
                    onFileUpload={onFileUpload}
                />
            )}

            <ConfirmationDialog
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Confirmar Eliminación"
                message={`¿Estás seguro de que quieres eliminar el producto "${productToDelete?.name}" del restaurante "${productToDelete?.restaurantName}"?`}
            />
        </main>
    );
};

export default ManageProducts;