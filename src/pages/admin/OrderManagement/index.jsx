import { useState } from "react";

const initialOrders = [
  {
    id: 1,
    code: "VUBAOSHOPAABBCC20180101",
    name: "Nguyễn Văn A",
    phone: "0918123456",
    address: "123 Lũy Bán Bích",
    coupon: "Không áp dụng",
  },
  {
    id: 2,
    code: "VUBAOSHOPAABBCC20190101",
    name: "Nguyễn Văn A",
    phone: "0918123456",
    address: "123 Lũy Bán Bích",
    coupon: "Không áp dụng",
  },
  {
    id: 3,
    code: "VUBAOSHOPAABBCC20200101",
    name: "Nguyễn Văn A",
    phone: "0918123456",
    address: "123 Lũy Bán Bích",
    coupon: "Không áp dụng",
  },
  {
    id: 4,
    code: "VUBAOSHOPAABBCC20210101",
    name: "Nguyễn Văn A",
    phone: "0918123456",
    address: "123 Lũy Bán Bích",
    coupon: "Không áp dụng",
  },
];

export default function OrderManagement() {
  const [orders] = useState(initialOrders);
  const [search, setSearch] = useState("");

  const filteredOrders = orders.filter(
    (order) =>
      order.code.toLowerCase().includes(search.toLowerCase()) ||
      order.name.toLowerCase().includes(search.toLowerCase()) ||
      order.phone.includes(search)
  );

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-xl md:text-2xl font-semibold mb-4">Quản lý đơn hàng</h1>

      {/* Bộ lọc và tìm kiếm */}
      <div className="flex flex-col md:flex-row md:justify-between mb-4 gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor="show" className="text-sm text-gray-700">
            Hiển thị
          </label>
          <select
            id="show"
            className="border px-2 py-1 rounded text-sm"
            defaultValue="10"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
          <span className="text-sm text-gray-700">mục</span>
        </div>

        <input
          type="text"
          placeholder="Tìm kiếm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-full md:w-64"
        />
      </div>

      {/* Bảng dữ liệu */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-2 border">STT</th>
              <th className="p-2 border">Mã đơn hàng</th>
              <th className="p-2 border">Họ tên người nhận</th>
              <th className="p-2 border">Số điện thoại người nhận</th>
              <th className="p-2 border">Địa chỉ nhận hàng</th>
              <th className="p-2 border">Phiếu giảm giá</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order, index) => (
              <tr
                key={order.id}
                className={`border-b hover:bg-gray-50 ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="p-2 border">{index + 1}</td>
                <td className="p-2 border">{order.code}</td>
                <td className="p-2 border">{order.name}</td>
                <td className="p-2 border">{order.phone}</td>
                <td className="p-2 border">{order.address}</td>
                <td className="p-2 border">{order.coupon}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Responsive note */}
      <p className="text-xs text-gray-500 mt-2 md:hidden text-center">
        👉 Kéo bảng ngang để xem đầy đủ thông tin
      </p>
    </div>
  );
}
