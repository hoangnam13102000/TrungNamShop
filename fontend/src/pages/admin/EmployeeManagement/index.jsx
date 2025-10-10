import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import AdminListTable from "../../../components/common/AdminListTable";
import DynamicForm from "../../../components/DynamicForm";
import useAdminCrud from "../../../utils/useAdminCrud";

const initialEmployees = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    email: "vana@example.com",
    phone: "0912345678",
    position: "Quản lý",
    status: "active",
  },
  {
    id: 2,
    name: "Trần Thị B",
    email: "thib@example.com",
    phone: "0987654321",
    position: "Nhân viên bán hàng",
    status: "inactive",
  },
];

const statusLabels = {
  active: "Đang làm việc",
  inactive: "Nghỉ việc",
};

export default function EmployeeManagement() {
  const {
    filteredItems,
    showForm,
    editingItem,
    search,
    setSearch,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSave,
    handleCloseModal,
  } = useAdminCrud(initialEmployees);

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Quản lý nhân viên</h1>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
        >
          <FaPlus /> Thêm nhân viên
        </button>

        <input
          type="text"
          placeholder="Tìm kiếm nhân viên..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-72 focus:ring-2 focus:ring-red-500"
        />
      </div>

      {/* Table */}
      <AdminListTable
        columns={[
          { field: "name", label: "Họ và tên" },
          { field: "email", label: "Email" },
          { field: "phone", label: "Số điện thoại" },
          { field: "position", label: "Chức vụ" },
          {
            field: "status",
            label: "Trạng thái",
            render: (value) => (
              <span
                className={`px-2 py-1 text-xs rounded ${
                  value === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {statusLabels[value] || value}
              </span>
            ),
          },
        ]}
        data={filteredItems}
        actions={[
          { icon: <FaEdit />, label: "Sửa", onClick: handleEdit },
          { icon: <FaTrash />, label: "Xoá", onClick: handleDelete },
        ]}
      />

      {/* Form Add & Edit */}
      {showForm && (
        <DynamicForm
          title={editingItem ? "Chỉnh sửa nhân viên" : "Thêm nhân viên mới"}
          fields={[
            { name: "name", label: "Họ và tên", type: "text" },
            { name: "email", label: "Email", type: "email" },
            { name: "phone", label: "Số điện thoại", type: "text" },
            { name: "position", label: "Chức vụ", type: "text" },
            {
              name: "status",
              label: "Trạng thái",
              type: "select",
              options: [
                { label: "Đang làm việc", value: "active" },
                { label: "Nghỉ việc", value: "inactive" },
              ],
            },
          ]}
          initialData={editingItem}
          onSave={handleSave}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}