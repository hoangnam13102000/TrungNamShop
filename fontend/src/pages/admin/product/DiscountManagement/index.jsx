import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import DynamicForm from "../../../../components/formAndDialog/DynamicForm";
import AdminListTable from "../../../../components/common/AdminListTable";
import useAdminCrud from "../../../../utils/useAdminCrud";

export default function DiscountList() {
  const initialDiscounts = [
    {
      id: 1,
      code: "SUMMER2024",
      description: "Giảm 20% cho đơn hàng trên 1.000.000đ",
      discountPercent: 20,
      startDate: "2024-06-01",
      endDate: "2024-08-30",
    },
  ];

  const {
    items: filteredDiscounts,
    search,
    setSearch,
    showForm,
    editingItem,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSave,
    handleCloseModal,
  } = useAdminCrud(initialDiscounts);

  return (
   <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Quản lý giảm giá</h1>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <button
          onClick={handleAdd}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors w-full sm:w-auto"
        >
          <FaPlus /> Thêm mã giảm giá
        </button>

        <input
          type="text"
          placeholder="Tìm kiếm mã giảm giá..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Table List */}
      <AdminListTable
        columns={[
          { field: "code", label: "Mã giảm giá" },
          { field: "description", label: "Mô tả" },
          { field: "discountPercent", label: "Giảm (%)" },
          { field: "startDate", label: "Ngày bắt đầu" },
          { field: "endDate", label: "Ngày kết thúc" },
        ]}
        data={filteredDiscounts}
        imageFields={[]}
        actions={[
          { icon: <FaEdit />, label: "Edit", onClick: handleEdit },
          { icon: <FaTrash />, label: "Delete", onClick: (row) => handleDelete(row.id) },
        ]}
      />

      {/* Form Add/Edit */}
      {showForm && (
        <DynamicForm
          title={editingItem ? "Sửa mã giảm giá" : "Thêm mã giảm giá"}
          fields={[
            { name: "code", label: "Mã giảm giá", type: "text", required: true },
            { name: "description", label: "Mô tả", type: "textarea", required: true },
            {
              name: "discountPercent",
              label: "Phần trăm giảm",
              type: "number",
              required: true,
              min: 1,
              max: 100,
            },
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
