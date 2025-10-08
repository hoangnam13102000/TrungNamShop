import { memo, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaInfoCircle, FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";

const AdminProductPage = () => {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "OPPO Reno6 Z 5G",
      brand: "OPPO",
      description: "Bộ sản phẩm gồm: Hộp, Cây lấy sim",
      status: "Đang bán",
    },
    {
      id: 2,
      name: "iPhone 13 Pro Max",
      brand: "IPHONE",
      description: "Bộ sản phẩm gồm: Hộp, Sách hướng dẫn",
      status: "Đang bán",
    },
    {
      id: 3,
      name: "Samsung Galaxy S22 Ultra 5G",
      brand: "SAMSUNG",
      description: "Bộ sản phẩm gồm: Bút S-Pen, Cáp Type-C",
      status: "Đang bán",
    },
    {
      id: 4,
      name: "Vivo V23e",
      brand: "VIVO",
      description: "Bộ sản phẩm gồm: Hộp, Tai nghe",
      status: "Đang bán",
    },
  ]);

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-5">
        <h2 className="text-xl font-semibold text-gray-700 mb-3 sm:mb-0">
          Quản lý sản phẩm
        </h2>
        <Link to="/quan-tri/them-san-pham" className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition">
          <FaPlus />
          <span>Thêm sản phẩm</span>
        </Link>
      </div>

      {/* Tìm kiếm */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
        <div>
          <label className="text-sm text-gray-600 mr-2">Hiển thị:</label>
          <select className="border border-gray-300 rounded-md px-2 py-1 text-sm">
            <option>10</option>
            <option>20</option>
            <option>50</option>
          </select>
        </div>

        <input
          type="text"
          placeholder="Tìm kiếm..."
          className="border border-gray-300 rounded-md px-3 py-2 w-full sm:w-60 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      {/* Bảng sản phẩm */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-red-600 text-white text-sm">
              <th className="p-3 text-left w-12">STT</th>
              <th className="p-3 text-left">Tên sản phẩm</th>
              <th className="p-3 text-left">Thương hiệu</th>
              <th className="p-3 text-left">Mô tả</th>
              <th className="p-3 text-left">Trạng thái</th>
              <th className="p-3 text-center">Chức năng</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, index) => (
              <tr
                key={p.id}
                className={`border-b hover:bg-gray-50 text-sm ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="p-3">{index + 1}</td>
                <td className="p-3">{p.name}</td>
                <td className="p-3">{p.brand}</td>
                <td className="p-3 truncate max-w-xs">{p.description}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      p.status === "Đang bán"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="p-3 flex justify-center gap-2 text-gray-700">
                  <button className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    <FaInfoCircle />
                  </button>
                  <button className="p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    <FaTrash />
                  </button>
                  <button className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                    <FaEye />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default memo(AdminProductPage);
