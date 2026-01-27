import React from 'react';

const Card = ({ children, title, icon: Icon, className = '', ...props }) => {
  return (
    <div 
      className={`bg-white rounded-3xl p-6 shadow-sm border border-gray-100/50 hover:shadow-md transition-shadow duration-300 ${className}`} 
      {...props}
    >
      {title && (
        <div className="flex items-center gap-3 mb-6">
          {Icon && (
            <div className="p-2.5 bg-[#F8F7FF] rounded-xl text-[#5D5CDE]">
              <Icon className="w-5 h-5" />
            </div>
          )}
          <h2 className="text-xl font-bold text-gray-900 leading-none">{title}</h2>
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
