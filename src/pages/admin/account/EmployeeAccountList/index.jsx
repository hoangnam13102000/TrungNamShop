import { FaPlus, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import AdminListTable from "../../../../components/common/AdminListTable";
import DynamicForm from "../../../../components/DynamicForm";
import useAdminCrud from "../../../../utils/useAdminCrud";

export default function EmployeeAccountList() {
  const initialEmployees = [
    {
      id: 1,
      username: "quanlycuahang",
      fullName: "Nguyễn Văn Bảo",
      role: "Quản lý cửa hàng",
      status: "Hoạt động",
    },
    {
      id: 2,
      username: "quanlykho",
      fullName: "Trương Đức Quyền",
      role: "Quản lý kho",
      status: "Hoạt động",
    },
    {
      id: 3,
      username: "nhanvien1",
      fullName: "Phan Võ An Vinh",
      role: "Nhân viên",
      status: "Hoạt động",
    },
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
  } = useAdminCrud(initialEmployees);

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <button
          onClick={handleAdd}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors w-full sm:w-auto"
        >
          <FaPlus /> Thêm tài khoản nhân viên
        </button>

        <input
          type="text"
          placeholder="Tìm kiếm nhân viên..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      {/* Table */}
      <AdminListTable
        columns={[
          { field: "username", label: "Username" },
          { field: "fullName", label: "Tên nhân viên" },
          { field: "role", label: "Loại tài khoản" },
          {
            field: "status",
            label: "Trạng thái",
            render: (value) => (
              <span
                className={`px-2 py-1 rounded-full text-sm ${
                  value === "Hoạt động"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {value}
              </span>
            ),
          },
        ]}
        data={filteredItems}
        actions={[
          { icon: <FaEdit />, label: "Sửa", onClick: handleEdit },
          { icon: <FaTrash />, label: "Xoá", onClick: (row) => handleDelete(row.id) },
        ]}
      />

      {/* Modal Form */}
      {showForm && (
        <DynamicForm
          title={editingItem ? "Sửa tài khoản nhân viên" : "Thêm tài khoản nhân viên"}
          fields={[
            { name: "username", label: "Tên đăng nhập", type: "text", required: true },
            { name: "fullName", label: "Tên nhân viên", type: "text", required: true },
            {
              name: "role",
              label: "Loại tài khoản",
              type: "select",
              options: ["Quản lý cửa hàng", "Quản lý kho", "Nhân viên"],
              required: true,
            },
            {
              name: "status",
              label: "Trạng thái",
              type: "select",
              options: ["Hoạt động", "Ngưng hoạt động"],
              required: true,
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
