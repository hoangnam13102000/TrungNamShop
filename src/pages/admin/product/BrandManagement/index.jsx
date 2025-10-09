import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import DynamicForm from "../../../../components/DynamicForm";
import AdminListTable from "../../../../components/common/AdminListTable";

import logoIphone from "../../../../assets/users/images/brands/logo-iphone.png";
import logoItel from "../../../../assets/users/images/brands/logo-itel.jpg";
import logoMasstel from "../../../../assets/users/images/brands/logo-masstel.png";
import logoNokia from "../../../../assets/users/images/brands/logo-nokia.jpg";

const initialBrands = [
  { id: 1, name: "IPHONE", image: logoIphone },
  { id: 2, name: "ITEL", image: logoItel },
  { id: 3, name: "MASSTEL", image: logoMasstel },
  { id: 4, name: "NOKIA", image: logoNokia },
];

export default function BrandManagement() {
  const [brands, setBrands] = useState(initialBrands);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa thương hiệu này không?")) {
      setBrands(brands.filter((b) => b.id !== id));
    }
  };

  const handleSave = (data) => {
    if (data.id) {
      setBrands((prev) =>
        prev.map((b) =>
          b.id === data.id ? { ...b, ...data, image: data.image || b.image } : b
        )
      );
    } else {
      setBrands([...brands, { ...data, id: Date.now() }]);
    }
    setShowForm(false);
    setEditingBrand(null);
  };

  const handleEdit = (brand) => {
    setEditingBrand(brand);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingBrand(null);
    setShowForm(true);
  };

  const filteredBrands = brands.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
        <button
          onClick={handleAdd}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center gap-2"
        >
          <FaPlus /> <span>Thêm thương hiệu</span>
        </button>

        <input
          type="text"
          placeholder="Tìm kiếm thương hiệu..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      {/* Table - Sử dụng AdminListTable */}
      <AdminListTable
        columns={[
          { field: "name", label: "Tên thương hiệu" },
          { field: "image", label: "Hình ảnh" },
        ]}
        data={filteredBrands}
        onEdit={handleEdit}
        onDelete={handleDelete}
        imageFields={["image"]}
      />

      {/* Modal Form */}
      {showForm && (
        <DynamicForm
          title={editingBrand ? "Sửa thương hiệu" : "Thêm thương hiệu"}
          fields={[
            { name: "name", label: "Tên thương hiệu", type: "text", required: true },
            { name: "image", label: "Hình ảnh", type: "file", required: true },
          ]}
          initialData={editingBrand}
          onSave={handleSave}
          onClose={() => {
            setShowForm(false);
            setEditingBrand(null);
          }}
        />
      )}
    </div>
  );
}