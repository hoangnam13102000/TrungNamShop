import { memo } from "react";

const DashboardCard = ({ name, Icon, color, value, subValue, path }) => {
  return (
    <div
      className={`group flex flex-col p-5 sm:p-6 lg:p-7 rounded-2xl text-white ${color}
        hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 shadow-lg 
        border border-white/20 backdrop-blur-sm overflow-hidden relative`}
    >
      {/* Animated background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Content wrapper */}
      <div className="relative z-10 flex flex-col h-full justify-between">
        {/* Header - Icon & Name horizontal with wrap */}
        <div className="flex items-start gap-2 sm:gap-3 mb-3">
          {Icon && (
            <div className="bg-white/20 p-2 sm:p-2.5 rounded-lg group-hover:bg-white/30 transition-all duration-300 flex-shrink-0">
              <Icon className="text-lg sm:text-xl" />
            </div>
          )}
          <span className="font-medium text-xs sm:text-sm lg:text-base text-left whitespace-normal break-words leading-tight">
            {name}
          </span>
        </div>
        
        {/* Value section */}
        <div className="flex flex-col min-w-0">
          {value && (
            <span className="text-base sm:text-lg lg:text-xl font-bold text-left break-words">
              {value}
            </span>
          )}
          {subValue && (
            <span className="text-xs opacity-90 text-left break-words">
              {subValue}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(DashboardCard);