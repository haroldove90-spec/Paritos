import React from 'react';

const PromoBanner: React.FC = () => {
  return (
    <div className="px-4 pt-4">
      <div className="relative bg-cover bg-center rounded-xl overflow-hidden shadow-lg h-40 group cursor-pointer" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/20 group-hover:from-black/70 transition-all duration-300"></div>
        <div className="relative h-full flex flex-col justify-center items-start p-6 text-white">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#FFDF00]">Descuentos Exclusivos</h2>
          <p className="mt-1 text-sm md:text-md text-gray-200">¡Tus platillos favoritos a precios increíbles!</p>
          <button 
            onClick={() => console.log('Ver Ofertas clicked')}
            className="mt-4 bg-[#FFDF00] text-[#181818] font-bold py-2 px-5 rounded-lg text-sm transform hover:scale-105 transition-transform duration-200"
          >
            Ver Ofertas
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromoBanner;
