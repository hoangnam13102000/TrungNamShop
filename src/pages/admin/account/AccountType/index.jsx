import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import useAdminCrud from "../../../../utils/useAdminCrud";
import DynamicForm from "../../../../components/DynamicForm";
import AdminListTable from "../../../../components/common/AdminListTable";

export default function AccountTypeList() {
  const initialTypes = [
    { id: 1, name: "Quản lý cửa hàng" },
    { id: 2, name: "Quản lý kho" },
    { id: 3, name: "Nhân viên" },
    { id: 4, name: "Người dùng VuBaoShop" },
    { id: 5, name: "Người dùng Google" },
  ];

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
  } = useAdminCrud(initialTypes);

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <button
          onClick={handleAdd}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors w-full sm:w-auto"
        >
          <FaPlus /> Thêm loại tài khoản
        </button>

        <input
          type="text"
          placeholder="Tìm kiếm loại tài khoản..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <AdminListTable
          columns={[
            { field: "name", label: "Tên loại tài khoản" },
          ]}
          data={filteredItems}
          actions={[
            { icon: <FaEdit />, label: "Sửa", onClick: handleEdit },
            { icon: <FaTrash />, label: "Xóa", onClick: (row) => handleDelete(row.id) },
          ]}
        />
      </div>

      {/* Form Add/Edit */}
      {showForm && (
        <DynamicForm
          title={editingItem ? "Sửa loại tài khoản" : "Thêm loại tài khoản"}
          fields={[
            { name: "name", label: "Tên loại tài khoản", type: "text", required: true },
          ]}
          initialData={editingItem}
          onSave={handleSave}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
