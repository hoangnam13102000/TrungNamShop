import { memo, useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import AdminListTable from "../../../../components/common/AdminListTable";
import DynamicForm from "../../../../components/formAndDialog/DynamicForm";
import DynamicDialog from "../../../../components/formAndDialog/DynamicDialog";
import useAdminCrud from "../../../../utils/useAdminCrud";
import {
  getRewardsAPI,
  createRewardAPI,
  updateRewardAPI,
  deleteRewardAPI,
} from "../../../../api/employee/reward/request";

const RewardList = () => {
  // Dynamic dialog
  const [dialog, setDialog] = useState({
    open: false,
    mode: "confirm", // confirm | success | error | warning | alert
    title: "",
    message: "",
    onConfirm: null,
  });

  // CRUD Hook
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
  });

  /** Save */
  const onSave = async (formData) => {
    setDialog({
      open: true,
      mode: "confirm",
      title: editingItem ? "Xác nhận cập nhật" : "Xác nhận thêm mới",
      message: editingItem
        ? `Bạn có chắc chắn muốn cập nhật thưởng "${formData.reward_name}" không?`
        : `Bạn có chắc chắn muốn thêm thưởng "${formData.reward_name}" với số tiền ${formData.reward_money} VNĐ không?`,
      onConfirm: async () => {
        const success = await handleSave(formData);
        if (success) {
          setDialog({
            open: true,
            mode: "success",
            title: "Thành công",
            message: editingItem
              ? "Cập nhật thưởng thành công!"
              : "Thêm thưởng mới thành công!",
            onConfirm: async () => {
              await fetchData();
              handleCloseModal();
              setDialog({ open: false });
            },
          });
        } else {
          setDialog({
            open: true,
            mode: "error",
            title: "Thất bại",
            message: "Không thể lưu dữ liệu. Vui lòng thử lại.",
            onConfirm: () => setDialog({ open: false }),
          });
        }
      },
    });
  };

  /** Delete */
  const onDelete = (id, name) => {
    setDialog({
      open: true,
      mode: "confirm",
      title: "Xác nhận xóa",
      message: `Bạn có chắc chắn muốn xóa thưởng "${name}" không?`,
      onConfirm: async () => {
        const success = await handleDelete(id);
        if (success) {
          await fetchData();
          setDialog({
            open: true,
            mode: "success",
            title: "Đã xóa",
            message: "Thưởng đã được xóa thành công.",
            onConfirm: () => setDialog({ open: false }),
          });
        } else {
          setDialog({
            open: true,
            mode: "error",
            title: "Lỗi xóa",
            message: "Không thể xóa thưởng. Vui lòng thử lại.",
            onConfirm: () => setDialog({ open: false }),
          });
        }
      },
    });
  };

  if (loading)
    return <div className="p-6 text-center text-gray-600">Đang tải...</div>;
  if (error)
    return (
      <div className="p-6 text-center text-red-500">
        Không thể tải dữ liệu.
      </div>
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
          {
            field: "reward_money",
            label: "Số tiền thưởng (VNĐ)",
            render: (value) =>
              Number(value ?? 0).toLocaleString("vi-VN") + " VNĐ",
          },
        ]}
        data={filteredItems}
        actions={[
          { icon: <FaEdit />, label: "Sửa", onClick: handleEdit },
          {
            icon: <FaTrash />,
            label: "Xóa",
            onClick: (row) => onDelete(row.reward_id, row.reward_name),
          },
        ]}
      />

      {/* Form Add/Edit */}
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

      {/* Dialog */}
      <DynamicDialog
        open={dialog.open}
        mode={dialog.mode} 
        title={dialog.title}
        message={dialog.message}
        onConfirm={dialog.onConfirm}
        onClose={() => setDialog({ open: false })}
      />
    </div>
  );
};

export default memo(RewardList);
