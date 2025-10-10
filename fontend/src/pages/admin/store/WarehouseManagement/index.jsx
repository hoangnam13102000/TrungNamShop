import { memo } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import AdminListTable from "../../../../components/common/AdminListTable";
import DynamicForm from "../../../../components/DynamicForm";
import useAdminCrud from "../../../../utils/useAdminCrud";

const WarehouseManagement = () => {
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
      name: "Kho Trung Tâm",
      address: "65 D. Huỳnh Thúc Kháng, Quận 1, TP. Hồ Chí Minh",
      note: "Kho chính chứa hàng nhập khẩu",
    },
  ]);

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Quản lý kho hàng</h1>
      <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-3 mb-6">
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition w-full sm:w-auto"
        >
          <FaPlus /> Thêm kho hàng
        </button>

        <input
          type="text"
          placeholder="Tìm kiếm kho..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      {/* WWareHouse Table */}
      <AdminListTable
        columns={[
          { field: "name", label: "Tên kho" },
          { field: "address", label: "Địa chỉ kho" },
          { field: "note", label: "Ghi chú" },
        ]}
        data={filteredItems}
        actions={[
          { icon: <FaEdit />, label: "Sửa", onClick: handleEdit },
          { icon: <FaTrash />, label: "Xóa", onClick: handleDelete },
        ]}
      />

      {/* Form Add & Edit */}
      {showForm && (
        <DynamicForm
          title={editingItem ? "✏️ Sửa kho hàng" : "➕ Thêm kho hàng"}
          fields={[
            {
              name: "name",
              label: "Tên kho",
              type: "text",
              required: true,
            },
            {
              name: "address",
              label: "Địa chỉ kho",
              type: "textarea",
              required: true,
            },
            {
              name: "note",
              label: "Ghi chú",
              type: "textarea",
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

export default memo(WarehouseManagement);
