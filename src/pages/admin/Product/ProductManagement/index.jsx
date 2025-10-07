import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const initialProducts = [
  { id: 1, name: "iPhone 13 128GB", price: 28500000, stock: 10 },
  { id: 2, name: "Samsung Galaxy S23 Ultra", price: 29800000, stock: 5 },
  { id: 3, name: "Xiaomi Redmi Note 12", price: 7500000, stock: 20 },
];

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({ id: null, name: "", price: "", stock: "" });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // giả lập fetch từ server
    setProducts(initialProducts);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = () => {
    if (!formData.name || !formData.price || !formData.stock) return alert("Vui lòng điền đủ thông tin");

    if (isEditing) {
      // sửa sản phẩm
      setProducts((prev) =>
        prev.map((p) =>
          p.id === formData.id
            ? { ...p, name: formData.name, price: Number(formData.price), stock: Number(formData.stock) }
            : p
        )
      );
    } else {
      // thêm sản phẩm mới
      const newProduct = {
        id: products.length ? Math.max(...products.map(p => p.id)) + 1 : 1,
        name: formData.name,
        price: Number(formData.price),
        stock: Number(formData.stock),
      };
      setProducts((prev) => [...prev, newProduct]);
    }

    setFormData({ id: null, name: "", price: "", stock: "" });
    setIsEditing(false);
  };

  const handleEdit = (product) => {
    setFormData({ ...product });
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const filteredProducts = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Quản lý sản phẩm</h1>

      {/* Form thêm/sửa */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-2">{isEditing ? "Sửa sản phẩm" : "Thêm sản phẩm"}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
          <input
            type="text"
            name="name"
            placeholder="Tên sản phẩm"
            value={formData.name}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
          <input
            type="number"
            name="price"
            placeholder="Giá"
            value={formData.price}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
          <input
            type="number"
            name="stock"
            placeholder="Số lượng"
            value={formData.stock}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
          <button
            onClick={handleAdd}
            className="flex items-center justify-center bg-red-600 text-white p-2 rounded hover:bg-red-700 transition"
          >
            <FaPlus className="mr-2" />
            {isEditing ? "Cập nhật" : "Thêm"}
          </button>
        </div>
      </div>

      {/* Tìm kiếm */}
      <input
        type="text"
        placeholder="Tìm kiếm sản phẩm..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      />

      {/* Danh sách sản phẩm */}
      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Tên sản phẩm</th>
              <th className="px-4 py-2 text-left">Giá</th>
              <th className="px-4 py-2 text-left">Số lượng</th>
              <th className="px-4 py-2 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p) => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{p.id}</td>
                <td className="px-4 py-2">{p.name}</td>
                <td className="px-4 py-2">{p.price.toLocaleString()}₫</td>
                <td className="px-4 py-2">{p.stock}</td>
                <td className="px-4 py-2 flex gap-2">
                  <button
                    onClick={() => handleEdit(p)}
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  Không có sản phẩm nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
