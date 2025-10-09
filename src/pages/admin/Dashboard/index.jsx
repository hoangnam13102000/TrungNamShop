import { memo} from "react";
import DashboardCard from "../../../components/DashboardCard";

import {
  FaThLarge,
  FaShoppingCart,
  FaUser,
  FaMobileAlt,
  FaBox,
  FaUsers,
  FaKey,
  FaWarehouse,
} from "react-icons/fa";

const dashboardCards = [
  { name: "Bảng điều khiển", Icon: FaThLarge, color: "bg-blue-500", path: "/quan-tri/bang-dieu-khien" },
  { name: "Đơn hàng", Icon: FaShoppingCart, color: "bg-green-500", path: "/quan-tri/quan-ly-don-hang" },
  { name: "Khách hàng", Icon: FaUsers, color: "bg-yellow-400", path: "/quan-tri/khach-hang" },
  { name: "Sản phẩm", Icon: FaMobileAlt, color: "bg-blue-700", path: "/quan-tri/quan-ly-san-pham" },
  { name: "Linh kiện", Icon: FaBox, color: "bg-gray-400", path: "/quan-tri/linh-kien" },
  { name: "Nhân viên", Icon: FaUser, color: "bg-pink-400", path: "/quan-tri/nhan-vien" },
  { name: "Tài khoản", Icon: FaKey, color: "bg-green-600", path: "/quan-tri/tai-khoan" },
  { name: "Kho, cửa hàng", Icon: FaWarehouse, color: "bg-purple-700", path: "/quan-tri/kho" },
];

const Dashboard = () => {
  return (
      <main className="flex-1 bg-gray-100 p-6 overflow-auto">
        <h1 className="text-xl font-semibold mb-6">Bảng điều khiển</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {dashboardCards.map((card, i) => (
            <DashboardCard key={i} {...card} />
          ))}
        </div>
      </main>
  );
};

export default memo(Dashboard);
