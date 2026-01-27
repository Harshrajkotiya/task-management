import React from 'react';

const StatCard = ({ title, value, subtitle, colorClass }) => {
  // Map color names to Tailwind patterns matching the screenshots
  const styleConfigs = {
    blue: {
      border: 'border-l-4 border-[#5D5CDE]',
      gradient: 'from-[#5D5CDE]/5 to-transparent',
      text: 'text-[#5D5CDE]',
      pattern: 'bg-[#5D5CDE]'
    },
    orange: {
      border: 'border-l-4 border-orange-400',
      gradient: 'from-orange-50 to-transparent',
      text: 'text-orange-500',
      pattern: 'bg-orange-400'
    },
    purple: {
      border: 'border-l-4 border-purple-400',
      gradient: 'from-purple-50 to-transparent',
      text: 'text-purple-500',
      pattern: 'bg-purple-400'
    },
    green: {
      border: 'border-l-4 border-emerald-400',
      gradient: 'from-emerald-50 to-transparent',
      text: 'text-emerald-500',
      pattern: 'bg-emerald-400'
    }
  };

  const config = styleConfigs[colorClass] || styleConfigs.blue;

  return (
    <div className={`bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-start justify-between relative overflow-hidden group ${config.border}`}>
      <div className="z-10">
        <h4 className="text-xs font-bold text-gray-900 mb-1">{title}</h4>
        <p className="text-[10px] text-gray-400 mb-2">{subtitle}</p>
        <div className="flex items-baseline gap-2">
           <span className="text-4xl font-extrabold text-[#111827]">{value}</span>
        </div>
      </div>

      {/* Background Graphic Pattern (matching the vertical lines in screenshot) */}
      <div className="absolute inset-0 bg-gradient-to-t opacity-40 pointer-events-none transition-opacity group-hover:opacity-60">
        <div className="absolute bottom-0 left-0 w-full h-1/2 flex items-end gap-[2px] px-2 opacity-30">
          {[...Array(60)].map((_, i) => (
            <div 
              key={i} 
              className={`flex-1 ${config.pattern} transition-all duration-500`} 
              style={{ 
                height: `${20 + Math.random() * 80}%`,
                opacity: 1 - (i / 60)
              }} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
