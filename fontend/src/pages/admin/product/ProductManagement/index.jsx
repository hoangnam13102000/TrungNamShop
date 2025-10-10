import { memo } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import DynamicForm from "../../../../components/DynamicForm";
import AdminListTable from "../../../../components/common/AdminListTable";
import useAdminCrud from "../../../../utils/useAdminCrud";

const AdminProductPage = () => {
  const categories = ["iPhone", "Samsung", "Oppo", "Xiaomi", "Vivo"];

  const {
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
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6"> Quản lý sản phẩm</h1>
      <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-3 mb-6">
        {/* Add */}
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition w-full sm:w-auto"
        >
          <FaPlus /> Thêm sản phẩm
        </button>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      {/* Product Table */}
      <AdminListTable
        columns={[
          { field: "image", label: "Ảnh" },
          { field: "name", label: "Tên sản phẩm" },
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
          title={editingItem ? " Sửa sản phẩm" : "Thêm sản phẩm"}
          fields={[
            {
              name: "name",
              label: "Tên sản phẩm",
              type: "text",
              required: true,
            },
            {
              name: "brand",
              label: "Thương hiệu",
              type: "select",
              options: categories.map((c) => ({ label: c, value: c })),
              required: true,
            },
            {
              name: "description",
              label: "Mô tả",
              type: "textarea",
              required: true,
            },
            {
              name: "status",
              label: "Trạng thái",
              type: "select",
              options: [
                { label: "Đang bán", value: "Đang bán" },
                { label: "Ngừng bán", value: "Ngừng bán" },
              ],
              required: true,
            },
            {
              name: "image",
              label: "Ảnh sản phẩm",
              type: "file",
            },
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
