import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import DynamicForm from "../../../../components/DynamicForm";
import AdminListTable from "../../../../components/common/AdminListTable";
import useAdminCrud from "../../../../utils/useAdminCrud";

export default function PromotionList() {
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
      name: "Khuyến mãi mùa hè 2024",
      startDate: "2024-06-01",
      endDate: "2024-08-30",
    },
  ]);

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <button
          onClick={handleAdd}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors w-full sm:w-auto"
        >
          <FaPlus /> Thêm khuyến mãi
        </button>

        <input
          type="text"
          placeholder="Tìm kiếm khuyến mãi..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      {/* List Table */}
      <AdminListTable
        columns={[
          { field: "name", label: "Tên khuyến mãi" },
          { field: "startDate", label: "Ngày bắt đầu" },
          { field: "endDate", label: "Ngày kết thúc" },
        ]}
        data={filteredItems}
        actions={[
          { icon: <FaEdit />, label: "Sửa", onClick: handleEdit },
          { icon: <FaTrash />, label: "Xóa", onClick: handleDelete },
        ]}
      />

      {/* Modal form Add / Edit */}
      {showForm && (
        <DynamicForm
          title={editingItem ? "Sửa khuyến mãi" : "Thêm khuyến mãi"}
          fields={[
            { name: "name", label: "Tên khuyến mãi", type: "text", required: true },
            { name: "startDate", label: "Ngày bắt đầu", type: "date", required: true },
            { name: "endDate", label: "Ngày kết thúc", type: "date", required: true },
          ]}
          initialData={editingItem}
          onSave={handleSave}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
