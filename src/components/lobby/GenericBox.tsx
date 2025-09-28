import React from 'react';

const GenericBox = ({ children, className }: { children?: React.ReactNode, className?: string }) => (
    <div className={`border-2 border-yellow-500 rounded-xl flex items-center justify-center text-white w-full h-full ${className}`}>
        {children}
    </div>
);

export default GenericBox;
