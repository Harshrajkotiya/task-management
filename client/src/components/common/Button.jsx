import React from 'react';

const Button = ({ 
  children, 
  type = 'button', 
  variant = 'primary', 
  className = '', 
  disabled = false, 
  onClick,
  ...props 
}) => {
  const baseStyles = 'w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-[#5D5CDE] hover:bg-[#4A49B8] text-white shadow-lg shadow-indigo-100',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-800',
    outline: 'border-2 border-gray-200 hover:border-[#5D5CDE] text-gray-600 hover:text-[#5D5CDE]',
    ghost: 'hover:bg-gray-50 text-gray-600'
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
