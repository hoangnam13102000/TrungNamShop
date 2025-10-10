import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import AdminListTable from "../../../../components/common/AdminListTable";
import DynamicForm from "../../../../components/DynamicForm";
import useAdminCrud from "../../../../utils/useAdminCrud";

export default function MemberLevelList() {
  const initialLevels = [
    { id: 1, name: "Thành viên", pointLimit: 0 },
    { id: 2, name: "Thành viên đồng", pointLimit: 100 },
    { id: 3, name: "Thành viên bạc", pointLimit: 1000 },
    { id: 4, name: "Thành viên vàng", pointLimit: 10000 },
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
  } = useAdminCrud(initialLevels);

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Quản lý bậc thành viên</h1>
      <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-3 mb-6">
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg transition w-full sm:w-auto"
        >
          <FaPlus /> Thêm bậc thành viên
        </button>
        <input
          type="text"
          placeholder="Tìm kiếm bậc thành viên..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      {/* Table */}
      <AdminListTable
        columns={[
          { field: "name", label: "Tên bậc tài khoản" },
          { field: "pointLimit", label: "Hạn mức điểm" },
        ]}
        data={filteredItems}
        actions={[
          { icon: <FaEdit />, label: "Sửa", onClick: handleEdit },
          {
            icon: <FaTrash />,
            label: "Xoá",
            onClick: (row) => handleDelete(row.id),
          },
        ]}
      />

      {/* Form Add & Edit */}
      {showForm && (
        <DynamicForm
          title={editingItem ? " Sửa bậc thành viên" : " Thêm bậc thành viên"}
          fields={[
            {
              name: "name",
              label: "Tên bậc tài khoản",
              type: "text",
              required: true,
            },
            {
              name: "pointLimit",
              label: "Hạn mức điểm",
              type: "number",
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
