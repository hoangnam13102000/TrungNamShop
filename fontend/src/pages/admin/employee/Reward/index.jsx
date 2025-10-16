import { memo } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import AdminListTable from "../../../../components/common/AdminListTable";
import DynamicForm from "../../../../components/DynamicForm";
import useAdminCrud from "../../../../utils/useAdminCrud";
import {
  getRewardsAPI,
  createRewardAPI,
  updateRewardAPI,
  deleteRewardAPI,
} from "../../../../api/employee/reward/request";

const RewardList = () => {
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
      fetch: getRewardsAPI,
      create: createRewardAPI,
      update: updateRewardAPI,
      delete: deleteRewardAPI,
    },
    rules: {
      reward_name: { required: true, message: "Tên thưởng là bắt buộc" },
      reward_money: { required: true, message: "Số tiền thưởng là bắt buộc" },
    },
    hooks: {
      beforeSave: async (data, editingItem) => {
        if (!editingItem) {
          return window.confirm(
            `Bạn có chắc chắn muốn thêm thưởng "${data.reward_name}" với số tiền "${data.reward_money}" không?`
          );
        }
        return true;
      },
    },
  });

  // Save
  const onSave = async (formData) => {
    const success = await handleSave(formData);
    if (success) {
      await fetchData();
      handleCloseModal();
    }
  };

  // Delete
  const onDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa thưởng này?")) return;
    const success = await handleDelete(id);
    if (success) {
      await fetchData();
    }
  };

  if (loading)
    return <div className="p-6 text-center text-gray-600">Đang tải...</div>;
  if (error)
    return (
      <div className="p-6 text-center text-red-500">Không thể tải dữ liệu.</div>
    );

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Quản lý thưởng</h1>

      {/* Header */}
      <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-3 mb-6">
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition w-full sm:w-auto"
        >
          <FaPlus /> Thêm thưởng
        </button>

        <input
          type="text"
          placeholder="Tìm kiếm theo tên hoặc số tiền thưởng..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      {/* Table List */}
      <AdminListTable
        columns={[
          { field: "reward_name", label: "Tên thưởng" },
          {field: "reward_money", label: "Số tiền thưởng (VNĐ)",
            render: (value) => Number(value ?? 0).toLocaleString("vi-VN") + " VNĐ"},
        ]}
        data={filteredItems}
        actions={[
          { icon: <FaEdit />, label: "Sửa", onClick: handleEdit },
          { icon: <FaTrash />, label: "Xóa", onClick: (row) => onDelete(row.reward_id) },
        ]}
      />

      {/* Form Add / Edit */}
      {showForm && (
        <DynamicForm
          title={editingItem ? "Sửa thưởng" : "Thêm thưởng"}
          fields={[
            {
              name: "reward_name",
              label: "Tên thưởng",
              type: "text",
              required: true,
            },
            {
              name: "reward_money",
              label: "Số tiền thưởng (VNĐ)",
              type: "number",
              required: true,
              min: 0,
            },
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

export default memo(RewardList);
