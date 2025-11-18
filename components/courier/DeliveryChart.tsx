import React from 'react';

interface ChartData {
    label: string;
    value: number;
}

interface DeliveryChartProps {
    data: ChartData[];
    title: string;
}

const DeliveryChart: React.FC<DeliveryChartProps> = ({ data, title }) => {
    const maxValue = Math.max(...data.map(d => d.value), 1); // Avoid division by zero

    return (
        <div className="bg-[#1e1e1e] p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold text-white mb-4">{title}</h3>
            <div className="flex justify-between items-end h-64 border-l border-b border-gray-700 p-4">
                {data.map((item, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center justify-end h-full relative group">
                        <div className="absolute -top-6 bg-[#2a2a2a] px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            {item.value}
                        </div>
                        <div 
                            className="w-3/4 bg-gradient-to-t from-[#FFDF00] to-yellow-300 rounded-t-md transition-all duration-1000 ease-out cursor-pointer hover:opacity-80"
                            style={{ 
                                height: `${(item.value / maxValue) * 100}%`,
                                animation: `grow-bar 1s ${index * 0.1}s ease-out forwards`,
                            }}
                            title={`${item.label}: ${item.value} entregas`}
                        >
                        </div>
                        <span className="text-xs text-gray-400 mt-2 font-semibold">{item.label}</span>
                    </div>
                ))}
            </div>
            <style>{`
                @keyframes grow-bar {
                    from { transform: scaleY(0); }
                    to { transform: scaleY(1); }
                }
                div[style*="animation-name: grow-bar"] {
                    transform-origin: bottom;
                    animation-name: grow-bar;
                    animation-fill-mode: forwards;
                }
            `}</style>
        </div>
    );
};

export default DeliveryChart;
