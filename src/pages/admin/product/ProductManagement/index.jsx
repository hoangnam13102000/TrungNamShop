import { memo } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import DynamicForm from "../../../../components/DynamicForm";
import AdminListTable from "../../../../components/common/AdminListTable";
import useAdminCrud from "../../../../utils/useAdminCrud";

const AdminProductPage = () => {
  const categories = ["iPhone", "Samsung", "Oppo", "Xiaomi", "Vivo"];

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
  } = useAdminCrud([
    {
      id: 1,
      name: "OPPO Reno6 Z 5G",
      brand: "Oppo",
      description: "Bộ sản phẩm gồm: Hộp, Cây lấy sim, Sạc",
      status: "Đang bán",
      image: "",
    },
  ]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-5">
        <h2 className="text-xl font-semibold text-gray-700 mb-3 sm:mb-0">
          Quản lý sản phẩm
        </h2>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition"
        >
          <FaPlus />
          <span>Thêm sản phẩm</span>
        </button>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 w-full sm:w-60 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      {/* Table */}
      <AdminListTable
        columns={[
          { field: "image", label: "Ảnh" },
          { field: "name", label: "Tên" },
          { field: "brand", label: "Thương hiệu" },
          { field: "description", label: "Mô tả" },
          { field: "status", label: "Trạng thái" },
        ]}
        data={filteredItems}
        imageFields={["image"]}
        actions={[
            { icon: <FaEdit />, label: "Sửa", onClick: handleEdit },
            { icon: <FaTrash />, label: "Xóa", onClick: handleDelete },
          ]}
      />

      {/* Modal Form */}
      {showForm && (
        <DynamicForm
          title={editingItem ? "Sửa sản phẩm" : "Thêm sản phẩm"}
          fields={[
            { name: "name", label: "Tên sản phẩm", type: "text", required: true },
            {
              name: "brand",
              label: "Thương hiệu",
              type: "select",
              options: categories,
              required: true,
            },
            { name: "description", label: "Mô tả", type: "textarea", required: true },
            {
              name: "status",
              label: "Trạng thái",
              type: "select",
              options: ["Đang bán", "Ngừng bán"],
              required: true,
            },
            { name: "image", label: "Ảnh sản phẩm", type: "file" },
          ]}
          initialData={editingItem}
          onSave={handleSave}
          onClose={handleCloseModal}
          
        />
      )}
    </div>
  );
};

export default memo(AdminProductPage);
