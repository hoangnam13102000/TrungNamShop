import { useState, useEffect, useRef } from "react";
import { FaChevronDown, FaSignOutAlt } from "react-icons/fa";
import defaultAvatar from "../../assets/users/images/user/user.png";
import { getImageUrl } from "../../utils/getImageUrl"; 

const AuthDropdown = ({
  isLoggedIn,
  username,
  avatar,
  onLogout,
  onNavigate,
  menuItems = [],
  showRegisterLogin = true,
  maxUsernameLength = 120,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef();

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Nếu chưa đăng nhập
  if (!isLoggedIn) {
    if (!showRegisterLogin) return null;
    return (
      <div className="hidden lg:flex gap-2">
        <button
          onClick={() => onNavigate("/dang-nhap")}
          className="px-4 py-1.5 bg-white text-red-600 hover:bg-red-50 rounded-lg font-medium text-sm transition"
        >
          Đăng nhập
        </button>
        <button
          onClick={() => onNavigate("/dang-ky")}
          className="px-4 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded-lg font-medium text-sm transition"
        >
          Đăng ký
        </button>
      </div>
    );
  }

  // ✅ Dùng hàm getImageUrl
  const resolvedAvatar = getImageUrl(avatar) || defaultAvatar;

  const handleLogout = () => {
    setIsOpen(false);
    onLogout && onLogout();
  };

  const handleNavigate = (item) => {
    setIsOpen(false);
    if (item.action) {
      item.action();
    } else if (item.link) {
      onNavigate(item.link);
    }
  };

  return (
    <div ref={dropdownRef} className="relative hidden lg:block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 bg-white text-gray-700 hover:bg-gray-50 rounded-lg transition border border-gray-200"
      >
        <img
          src={resolvedAvatar}
          alt="Avatar"
          onError={(e) => (e.target.src = defaultAvatar)}
          className="w-6 h-6 rounded-full object-cover ring-1 ring-red-200"
        />
        <span
          className={`text-sm font-medium truncate max-w-[${maxUsernameLength}px]`}
        >
          {username}
        </span>
        <FaChevronDown
          className={`text-xs text-gray-500 transition ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center gap-3">
              <img
                src={resolvedAvatar}
                alt="Avatar"
                onError={(e) => (e.target.src = defaultAvatar)}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-red-200 flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900 truncate">{username}</p>
                <p className="text-xs text-gray-500">Tài khoản của bạn</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {menuItems.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleNavigate(item)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 transition text-left"
              >
                {item.icon && <item.icon className="text-red-600 w-4 flex-shrink-0" />}
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Logout */}
          {onLogout && (
            <div className="border-t border-gray-100">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition font-medium"
              >
                <FaSignOutAlt className="flex-shrink-0" />
                <span>Đăng xuất</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AuthDropdown;
