import { memo, useState } from "react";
import { FaBars, FaThLarge, FaShoppingCart, FaUser, FaMobileAlt, FaBox, FaUsers, FaKey, FaWarehouse } from "react-icons/fa";

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { name: "Bảng điều khiển", icon: FaThLarge, key: "dashboard" },
    { name: "Đơn hàng", icon: FaShoppingCart, key: "orders" },
    { name: "Khách hàng", icon: FaUsers, key: "customers" },
    { name: "Sản phẩm", icon: FaMobileAlt, key: "products" },
    { name: "Linh kiện", icon: FaBox, key: "components" },
    { name: "Nhân viên", icon: FaUser, key: "staff" },
    { name: "Tài khoản", icon: FaKey, key: "accounts" },
    { name: "Kho, cửa hàng", icon: FaWarehouse, key: "warehouse" },
  ];

  const dashboardCards = [
    { name: "Bảng điều khiển", icon: FaThLarge, color: "bg-blue-500" },
    { name: "Đơn hàng", icon: FaShoppingCart, color: "bg-green-500" },
    { name: "Khách hàng", icon: FaUsers, color: "bg-yellow-400" },
    { name: "Sản phẩm", icon: FaMobileAlt, color: "bg-blue-700" },
    { name: "Linh kiện", icon: FaBox, color: "bg-gray-400" },
    { name: "Nhân viên", icon: FaUser, color: "bg-pink-400" },
    { name: "Tài khoản", icon: FaKey, color: "bg-green-600" },
    { name: "Kho, cửa hàng", icon: FaWarehouse, color: "bg-purple-700" },
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className={`bg-red-600 text-white transition-all ${sidebarOpen ? "w-64" : "w-16"} flex flex-col`}>
        <div className="flex items-center justify-between px-4 py-3">
          <span className={`text-2xl font-bold ${sidebarOpen ? "block" : "hidden"}`}>ADMIN</span>
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            <FaBars />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto mt-4">
          {menuItems.map((item) => (
            <div key={item.key} className="flex items-center gap-3 px-4 py-2 hover:bg-red-500 cursor-pointer">
              <item.icon />
              {sidebarOpen && <span>{item.name}</span>}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-6 overflow-auto">
        <h1 className="text-xl font-semibold mb-6">Bảng điều khiển</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {dashboardCards.map((card, i) => (
            <div key={i} className={`flex items-center justify-center gap-3 p-6 rounded-lg text-white ${card.color} cursor-pointer hover:opacity-90 transition`}>
              <card.icon className="text-2xl" />
              <span className="font-medium">{card.name}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default memo(AdminDashboard);
