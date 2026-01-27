import React from 'react';
import Button from './Button';

const RoleCard = ({ 
  title, 
  description, 
  features, 
  isSelected, 
  onSelect, 
  buttonText,
  variant = 'user'
}) => {
  const isUser = variant === 'user';
  
  return (
    <div className={`p-6 rounded-2xl border-2 transition-all duration-300 flex flex-col h-full bg-white ${
      isSelected 
        ? 'border-[#5D5CDE] shadow-xl shadow-indigo-50' 
        : 'border-gray-100 hover:border-gray-200 shadow-sm'
    }`}>
      <div className="flex-grow">
        <h3 className={`text-2xl font-bold mb-2 ${isUser ? 'text-gray-900' : 'text-[#5D5CDE]'}`}>
          {title}
        </h3>
        <p className="text-gray-400 text-xs mb-6 w-5/6">
          {description}
        </p>
        
        <ul className="space-y-3 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center text-[10px] text-gray-500">
              <span className={`w-1.5 h-1.5 rounded-full mr-2 ${isUser ? 'bg-gray-300' : 'bg-[#5D5CDE]'}`}></span>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <Button 
        variant={isUser ? 'secondary' : 'primary'} 
        onClick={onSelect}
        className="!py-2.5 text-xs"
      >
        {buttonText}
      </Button>
    </div>
  );
};

export default RoleCard;
