import React from 'react';

export const MotorcycleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="5" cy="16" r="3" />
    <circle cx="19" cy="16" r="3" />
    <path d="M7.5 14h5l4 -4h-10.5" />
    <path d="M16 5l1.5 3l-3.5 4" />
  </svg>
);
