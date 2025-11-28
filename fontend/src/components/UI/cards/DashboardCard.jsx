import { memo } from "react";
import { Link } from "react-router-dom";

const DashboardCard = ({ name, Icon, color, value, subValue, path }) => {
  return (
    <Link
      to={path || "#"}
      className={`flex flex-col sm:flex-row items-center justify-between gap-3
        p-5 sm:p-6 rounded-xl text-white ${color}
        cursor-pointer hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]
        transition-all shadow-md`}
    >
      {/* Icon */}
      {Icon && <Icon className="text-3xl sm:text-2xl" />}
      
      {/* Texts */}
      <div className="flex flex-col items-center sm:items-start">
        <span className="font-medium text-base sm:text-lg text-center sm:text-left">{name}</span>
        {value && <span className="text-xl sm:text-2xl font-bold mt-1">{value}</span>}
        {subValue && <span className="text-sm sm:text-base opacity-80 mt-0.5">{subValue}</span>}
      </div>
    </Link>
  );
};

export default memo(DashboardCard);
