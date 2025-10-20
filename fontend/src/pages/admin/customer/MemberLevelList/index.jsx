import { memo, useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import AdminListTable from "../../../../components/common/AdminListTable";
import DynamicForm from "../../../../components/formAndDialog/DynamicForm";
import DynamicDialog from "../../../../components/formAndDialog/DynamicDialog";
import useAdminCrud from "../../../../utils/useAdminCrud";
import {
  getAccountLevelingAPI,
  createAccountLevelingAPI,
  updateAccountLevelingAPI,
  deleteAccountLevelingAPI,
} from "../../../../api/account/memberLeveling/request";

const MemberLevelingList = () => {
  // --- Dialog State ---
  const [dialog, setDialog] = useState({
    open: false,
    mode: "confirm", // confirm | success | error | alert
    title: "",
    message: "",
    onConfirm: null,
  });

  const openDialog = (options) => setDialog({ open: true, ...options });
  const closeDialog = () => setDialog((d) => ({ ...d, open: false }));

  // --- CRUD logic ---
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
        // Không cho sửa cấp đặc biệt
        if (editingItem?.id === 1) {
          openDialog({
            mode: "alert",
            title: "Cảnh báo",
            message: "Không thể sửa bậc thành viên này!",
          });
          return false;
        }

        if (data.limit != null) data.limit = Math.floor(Number(data.limit));

        // Hiển thị hộp xác nhận
        return new Promise((resolve) => {
          openDialog({
            mode: "confirm",
            title: "Xác nhận",
            message: `Bạn có chắc chắn muốn ${
              editingItem ? "cập nhật" : "thêm"
            } bậc thành viên "${data.name}" không?`,
            onConfirm: () => resolve(true),
          });
        });
      },
    },
  });

  // --- Xử lý lưu ---
  const onSave = async (formData) => {
    const success = await handleSave(formData);
    if (success) {
      await fetchData();
      handleCloseModal();
      openDialog({
        mode: "success",
        title: "Thành công",
        message: editingItem
          ? "Cập nhật thành công!"
          : "Thêm mới thành công!",
      });
    }
  };

  // --- Xử lý xoá ---
  const onDelete = async (id) => {
    if (id === 1) {
      openDialog({
        mode: "alert",
        title: "Cảnh báo",
        message: "Không thể xoá bậc thành viên này!",
      });
      return;
    }

    openDialog({
      mode: "confirm",
      title: "Xác nhận xoá",
      message: "Bạn có chắc chắn muốn xóa bậc thành viên này?",
      onConfirm: async () => {
        const success = await handleDelete(id);
        if (success) {
          await fetchData();
          openDialog({
            mode: "success",
            title: "Thành công",
            message: "Xóa thành công!",
          });
        }
      },
    });
  };

  // --- UI loading / error ---
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
          { field: "limit", label: "Hạn mức (point)" },
        ]}
        data={filteredItems}
        actions={[
          {
            icon: <FaEdit />,
            label: "Sửa",
            onClick: handleEdit,
            disabled: (row) => row.id === 1,
          },
          {
            icon: <FaTrash />,
            label: "Xóa",
            onClick: (row) => onDelete(row.id),
            disabled: (row) => row.id === 1,
          },
        ]}
      />

      {/* Form Add/Edit */}
      {showForm && (
        <DynamicForm
          title={editingItem ? "Sửa bậc thành viên" : "Thêm bậc thành viên"}
          fields={[
            {
              name: "name",
              label: "Tên bậc thành viên",
              type: "text",
              required: true,
            },
            {
              name: "limit",
              label: "Hạn mức (point)",
              type: "number",
              required: true,
              step: 1,
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
        onClose={closeDialog}
      />
    </div>
  );
};

export default memo(MemberLevelingList);
