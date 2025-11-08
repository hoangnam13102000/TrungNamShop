import { memo } from "react";
import { Link } from "react-router-dom";
import DropdownSidebarItem from "../../../../components/dropdown/DropdownSidebarItem";
import LogoutButton from "../../../../components/LogoutButton";
import {
  FaBars,
  FaThLarge,
  FaShoppingCart,
  FaUsers,
  FaMobileAlt,
  FaBox,
  FaUser,
  FaKey,
  FaWarehouse,
} from "react-icons/fa";

const AdminSidebar = ({
  sidebarOpen,
  setSidebarOpen,
  menuOpen,
  setMenuOpen,
  handleLogout,
}) => {
  const handleMobileLinkClick = () => {
    if (window.innerWidth < 768) setMenuOpen(false);
  };

  const menuItems = [
    { label: "Bảng điều khiển", icon: <FaThLarge />, path: "/quan-tri/" },
    {
      label: "Đơn hàng",
      icon: <FaShoppingCart />,
      path: "/quan-tri/quan-ly-don-hang",
    },
    {
      label: "Khách hàng",
      icon: <FaUsers />,
      dropdown: [
        { label: "Quản lý khách hàng", path: "/quan-tri/quan-ly-khach-hang" },
        {
          label: "Quản lý bậc thành viên",
          path: "/quan-tri/quan-ly-bac-thanh-vien",
        },
      ],
    },
    {
      label: "Sản phẩm",
      icon: <FaMobileAlt />,
      dropdown: [
        { label: "Quản lý thương hiệu", path: "/quan-tri/quan-ly-thuong-hieu" },
        { label: "Quản lý sản phẩm", path: "/quan-tri/quan-ly-san-pham" },
        {
          label: "Quản lý hình sản phẩm",
          path: "/quan-tri/quan-ly-hinh-san-pham",
        },
        { label: "Chi tiết sản phẩm", path: "/quan-tri/chi-tiet-san-pham" },
        { label: "Quản lý màu sắc", path: "/quan-tri/quan-ly-mau-sac" },
        { label: "Màn hình", path: "/quan-tri/quan-ly-man-hinh" },
        { label: "Bộ nhớ", path: "/quan-tri/quan-ly-bo-nho" },
        { label: "Quản lý kết nối", path: "/quan-tri/quan-ly-ket-noi" },
        { label: "Pin và công nghệ sạc", path: "/quan-tri/quan-ly-pin" },
        { label: "Camera trước", path: "/quan-tri/quan-ly-camera-truoc" },
        { label: "Camera sau", path: "/quan-tri/quan-ly-camera-sau" },
        { label: "Hệ điều hành", path: "/quan-tri/quan-ly-he-dieu-hanh" },
        {
          label: "Thông tin chung",
          path: "/quan-tri/thong-tin-chung-san-pham",
        },
        { label: "Tiện ích khác", path: "/quan-tri/tien-ich-san-pham" },
        { label: "Quản lý đánh giá", path: "/quan-tri/quan-ly-danh-gia" },
        { label: "Quản lý khuyến mãi", path: "/quan-tri/quan-ly-khuyen-mai" },
        { label: "Quản lý giảm giá", path: "/quan-tri/quan-ly-giam-gia" },
      ],
    },
    { label: "Linh kiện", icon: <FaBox />, path: "/quan-tri/linh-kien" },
    {
      label: "Nhân viên",
      icon: <FaUser />,
      dropdown: [
        { label: "Quản lý nhân viên", path: "/quan-tri/quan-ly-nhan-vien" },
        { label: "Quản lý chức vụ", path: "/quan-tri/quan-ly-chuc-vu" },
        { label: "Quản lý hệ số lương", path: "/quan-tri/quan-ly-he-so-luong" },
        { label: "Quản lý phụ cấp", path: "/quan-tri/quan-ly-phu-cap" },
        { label: "Quản lý thưởng", path: "/quan-tri/quan-ly-thuong" },
        { label: "Quản lý chấm công", path: "/quan-tri/quan-ly-cham-cong" },
      ],
    },
    {
      label: "Tài khoản",
      icon: <FaKey />,
      dropdown: [
        {
          label: "Quản lý loại tài khoản",
          path: "/quan-tri/quan-ly-loai-tai-khoan",
        },
        { label: "Quản lý tài khoản", path: "/quan-tri/quan-ly-tai-khoan" },
      ],
    },
    {
      label: "Kho, cửa hàng",
      icon: <FaWarehouse />,
      dropdown: [
        { label: "Quản lý cửa hàng", path: "/quan-tri/quan-ly-cua-hang" },
        { label: "Quản lý kho", path: "/quan-tri/quan-ly-kho" },
      ],
    },
  ];

  const renderMenu = () =>
    menuItems.map((item, idx) =>
      item.dropdown ? (
        <DropdownSidebarItem
          key={idx}
          label={item.label}
          icon={item.icon}
          subItems={item.dropdown}
          sidebarOpen={sidebarOpen || menuOpen}
          onLinkClick={handleMobileLinkClick}
        />
      ) : (
        <Link
          key={idx}
          to={item.path}
          onClick={handleMobileLinkClick}
          className="flex items-center gap-3 px-4 py-2 hover:bg-red-500 transition-colors"
        >
          {item.icon}
          {(sidebarOpen || menuOpen) && (
            <span className="text-sm">{item.label}</span>
          )}
        </Link>
      )
    );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden md:flex fixed top-0 left-0 h-full bg-red-600 text-white flex-col transition-all duration-300 z-50
        ${sidebarOpen ? "w-64" : "w-16"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-red-500">
          <Link
            to="/quan-tri/"
            className={`text-2xl font-bold whitespace-nowrap overflow-hidden transition-all duration-300
            ${sidebarOpen ? "opacity-100 w-auto" : "opacity-0 w-0"}`}
          >
            ADMIN
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hover:text-gray-200 transition"
          >
            <FaBars />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto mt-4 space-y-1">
          {renderMenu()}
        </nav>

        {/* Logout */}
        <div className="mt-auto border-t border-red-500">
          <LogoutButton sidebarOpen={sidebarOpen} onLogout={handleLogout} />
        </div>
      </aside>

      {/* Mobile sidebar */}
      {menuOpen && (
        <aside className="md:hidden fixed top-0 left-0 w-full h-screen bg-red-600 text-white z-50 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-red-500">
            <span className="text-2xl font-bold">ADMIN</span>
            <button onClick={() => setMenuOpen(false)}>
              <FaBars />
            </button>
          </div>

          {/* Menu */}
          <nav className="flex flex-col mt-4 space-y-1 px-2">
            {renderMenu()}
          </nav>

          {/* Logout */}
          <div className="mt-auto border-t border-red-500">
            <LogoutButton sidebarOpen={true} onLogout={handleLogout} />
          </div>
        </aside>
      )}
    </>
  );
};

export default memo(AdminSidebar);
