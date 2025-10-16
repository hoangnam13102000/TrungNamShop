import { memo } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import AdminListTable from "../../../../components/common/AdminListTable";
import DynamicForm from "../../../../components/DynamicForm";
import useAdminCrud from "../../../../utils/useAdminCrud";
import {
  getAccountLevelingAPI,
  createAccountLevelingAPI,
  updateAccountLevelingAPI,
  deleteAccountLevelingAPI,
} from "../../../../api/account/memberLeveling/request";

const MemberLevelingList = () => {
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
    loading,
    error,
    errors,
    fetchData,
  } = useAdminCrud([], {
    api: {
      fetch: async () => {
        const data = await getAccountLevelingAPI();
        // Ép limit về số nguyên ngay khi fetch
        return data.map((item) => ({
          ...item,
          limit: item.limit != null ? Math.floor(Number(item.limit)) : null,
        }));
      },
      create: createAccountLevelingAPI,
      update: updateAccountLevelingAPI,
      delete: deleteAccountLevelingAPI,
    },
    rules: {
      name: { required: true, message: "Tên bậc thành viên là bắt buộc" },
      limit: { type: "number", min: 0, message: "Hạn mức phải là số >= 0" },
    },
    hooks: {
      beforeSave: async (data, editingItem) => {
        if (data.limit != null) data.limit = Math.floor(Number(data.limit));
        if (!editingItem) {
          return window.confirm(`Bạn có chắc chắn muốn thêm bậc thành viên "${data.name}" không?`);
        }
        return true;
      },
    },
  });

  const onSave = async (formData) => {
    const success = await handleSave(formData);
    if (success) {
      await fetchData(); // refresh dữ liệu
      handleCloseModal(); // đóng form
      alert(editingItem ? "Cập nhật thành công!" : "Thêm mới thành công!");
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bậc thành viên này?")) return;
    const success = await handleDelete(id);
    if (success) {
      await fetchData(); // refresh dữ liệu
      alert("Xóa thành công!");
    }
  };

  if (loading) return <div className="p-6 text-center text-gray-600">Đang tải...</div>;
  if (error) return <div className="p-6 text-center text-red-500">Không thể tải dữ liệu.</div>;

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Quản lý bậc thành viên</h1>

      {/* Header */}
      <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-3 mb-6">
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition w-full sm:w-auto"
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
          { field: "name", label: "Tên bậc thành viên" },
          { field: "limit", label: "Hạn mức (point)" }, // đã là số nguyên từ API
        ]}
        data={filteredItems}
        actions={[
          { icon: <FaEdit />, label: "Sửa", onClick: handleEdit },
          { icon: <FaTrash />, label: "Xóa", onClick: (row) => onDelete(row.id) },
        ]}
      />

      {/* Form Add/Edit */}
      {showForm && (
        <DynamicForm
          title={editingItem ? "Sửa bậc thành viên" : "Thêm bậc thành viên"}
          fields={[
            { name: "name", label: "Tên bậc thành viên", type: "text", required: true },
            { name: "limit", label: "Hạn mức (point)", type: "number", required: true, step: 1, min: 0 },
          ]}
          initialData={editingItem}
          onSave={onSave}
          onClose={handleCloseModal}
          errors={errors}
        />
      )}
    </div>
  );
};

export default memo(MemberLevelingList);
