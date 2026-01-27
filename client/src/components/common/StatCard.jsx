import React from 'react';

const StatCard = ({ title, value, subtitle, color = '#3B82F6' }) => {
  return (
    <div className='relative bg-white mb-16'>
      {/* Gradient left border */}
      <div
        className="absolute left-0 top-0 h-full w-[2px]"
        style={{
          background: `linear-gradient(to bottom, ${color}, transparent)`
        }}
      />
      <div className=" overflow-hidden">

        {/* Content */}
        <div className="p-4 relative z-10 flex justify-between">
          <div>
            <h4 className="text-sm text-black mb-1">{title}</h4>
            <p className="text-xs text-gray-400 mb-2 tracking-wide">{subtitle}</p>
          </div>
          <span className="text-4xl font-bold text-gray-900">{value}</span>
        </div>

      </div>
      {/* Bottom vertical bars */}
      <div className="relative w-full h-full flex items-end gap-[2px] pointer-events-none">
        {[...Array(70)].map((_, i) => (
          <div
            key={i}
            className="flex-1"
            style={{
              height: `100%`,
              background: `linear-gradient(to bottom, ${color}, transparent)`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default StatCard;