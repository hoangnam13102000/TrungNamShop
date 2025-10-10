import { FaSignOutAlt } from "react-icons/fa";

const LogoutButton = ({ sidebarOpen, onLogout }) => (
  <button
    onClick={onLogout}
    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-red-700 transition-colors"
  >
    <FaSignOutAlt className="text-lg" />
    {sidebarOpen && <span className="text-sm font-medium">Đăng xuất</span>}
  </button>
);

export default LogoutButton;