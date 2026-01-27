import React from 'react';

const Badge = ({ variant, children }) => {
    const getStyle = (status) => {
        switch (status) {
            case 'Pending':
                return 'bg-white text-[#F59E0B] border-2 border-[#F59E0B]';
            case 'In Progress':
                return 'bg-white text-[#3B82F6] border-2 border-[#3B82F6]';
            case 'Completed':
                return 'bg-white text-[#22C55E] border-2 border-[#22C55E]';
            default:
                return 'bg-gray-50 text-gray-500 border-2 border-gray-200';
        }
    };

    return (
        <span
            className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize tracking-wider ${getStyle(variant)}`}
        >
            {children || variant}
        </span>
    );
};

export default Badge;
