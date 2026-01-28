import React from 'react';
import illustration from '../../assets/Frame 1.svg';

const AuthLayout = ({ children }) => {
  return (
    <div className="h-screen flex bg-white overflow-hidden">
      {/* Left side: Illustration */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center">
        <div className="max-w-full">
          <img
            src={illustration}
            alt="Task Management Illustration"
            className="w-full h-auto object-contain"
          />
        </div>
      </div>

      {/* Right side: Form Content */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-20 overflow-y-auto custom-scrollbar">
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
