import { FaPlus,FaEdit, FaTrash  } from "react-icons/fa";
import DynamicForm from "../../../../components/DynamicForm";
import AdminListTable from "../../../../components/common/AdminListTable";
import useAdminCrud from "../../../../utils/useAdminCrud";

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
  const {
    items:
    filteredItems,
    search,
    setSearch,
    showForm,
    editingItem,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSave,
    handleCloseModal,
  } = useAdminCrud(initialBrands);

  return (
   <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Quản lý thương hiệu</h1>
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

      {/* Brand Table */}
      <AdminListTable
        columns={[
          { field: "name", label: "Tên thương hiệu" },
          { field: "image", label: "Hình ảnh" },
        ]}
        data={filteredItems}
       actions={[
            { icon: <FaEdit />, label: "Sửa", onClick: handleEdit },
            { icon: <FaTrash />, label: "Xóa", onClick: handleDelete },
          ]}
        imageFields={["image"]}
      />

      {/* Modal Form Add & Edit */}
      {showForm && (
        <DynamicForm
          title={editingItem ? "Sửa thương hiệu" : "Thêm thương hiệu"}
          fields={[
            { name: "name", label: "Tên thương hiệu", type: "text", required: true },
            { name: "image", label: "Hình ảnh", type: "file", required: true },
          ]}
          initialData={editingItem}
          onSave={handleSave}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
