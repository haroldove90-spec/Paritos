import React from 'react';
import type { Order } from '../../types';
import { XIcon } from '../icons/XIcon';

interface MapViewProps {
  order: Order;
  onClose: () => void;
}

const MapView: React.FC<MapViewProps> = ({ order, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-center p-4">
      <div className="bg-[#1e1e1e] w-full max-w-2xl rounded-lg shadow-lg flex flex-col relative">
        <img 
            src="https://www.mapquestapi.com/staticmap/v5/map?key=K1jmykG2aAXp15fA0deAblj2oA2U5g07&center=34.0522,-118.2437&zoom=13&size=800,600@2x&type=dark&locations=34.0522,-118.2437|marker-start||34.0622,-118.2537|marker-end&route=fill:0x3A3D4280|color:0xFFDF00|width:3" 
            alt="Mapa de ruta" 
            className="rounded-t-lg object-cover w-full h-64 md:h-96"
        />
        <div className="p-4">
            <h2 className="font-bold text-lg text-[#FFDF00]">Entregando Pedido #{order.id.toString().slice(-4)}</h2>
            <p className="text-gray-300">Cliente: {order.customerName}</p>
            <p className="text-gray-300">Dirección: Av. Siempre Viva 123, Springfield</p>
            <p className="text-lg font-bold mt-2">Total: ${order.total.toFixed(2)}</p>
        </div>
         <button onClick={onClose} className="absolute top-3 right-3 bg-black/50 p-2 rounded-full text-white hover:bg-black/80 transition-colors">
            <XIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default MapView;
