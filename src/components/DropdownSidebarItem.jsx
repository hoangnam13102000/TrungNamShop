import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { Link } from "react-router-dom";

const DropdownSidebarItem = ({ label, icon, subItems, sidebarOpen, onLinkClick }) => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-500 transition-colors"
      >
        {icon}
        {sidebarOpen && (
          <>
            <span className="flex-1 text-sm text-left">{label}</span>
            {open ? <FaChevronUp /> : <FaChevronDown />}
          </>
        )}
      </button>

      {open && sidebarOpen && (
        <div className="bg-red-700 text-sm ml-6 mt-1 rounded-md overflow-hidden">
          {subItems.map((sub, i) => (
            <Link
              key={i}
              to={sub.path}
              onClick={onLinkClick}
              className="block px-4 py-2 hover:bg-red-500 transition"
            >
              {sub.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownSidebarItem;
