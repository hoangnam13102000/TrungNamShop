import { memo } from "react";
import { Link } from "react-router-dom";

const DashboardCard = ({ name, Icon, color, path }) => {
  return (
    <Link
      to={path || "#"}
      className={`flex flex-col sm:flex-row items-center justify-center gap-3 
        p-5 sm:p-6 rounded-xl text-white ${color} 
        cursor-pointer hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] 
        transition-all shadow-md`}
    >
      {Icon && <Icon className="text-3xl sm:text-2xl" />}
      <span className="font-medium text-base sm:text-lg text-center sm:text-left">
        {name}
      </span>
    </Link>
  );
};

export default memo(DashboardCard);
