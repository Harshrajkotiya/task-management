import React from 'react';

const QuickActionCard = ({ title, subtitle, icon: Icon, onClick }) => {
    return (
        <div
            onClick={onClick}
            className="bg-white px-4 py-6 rounded-2xl border border-[#E6E6E6] cursor-pointer flex items-center gap-4 group"
        >
            <div className="p-3 bg-[#5856D61A] rounded-full">
                <Icon className="w-6 h-6 text-[#5856D6]" />
            </div>
            <div>
                <h4 className="font-bold text-black text-xl">{title}</h4>
                <p className="text-gray-400 text-xs mt-1 tracking-wider">{subtitle}</p>
            </div>
        </div>
    );
};

export default QuickActionCard;
