import { FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const LogoutButton = ({ sidebarOpen }) => {
  const navigate = useNavigate();

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("avatar");
    localStorage.removeItem("account_id");

    
    window.dispatchEvent(new Event("storage"));

   
    navigate("/quan-tri/"); 
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-red-700 transition-colors"
    >
      <FaSignOutAlt className="text-lg" />
      {sidebarOpen && <span className="text-sm font-medium">Đăng xuất</span>}
    </button>
  );
};

export default LogoutButton;
