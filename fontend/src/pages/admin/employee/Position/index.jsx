import { memo, useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import AdminListTable from "../../../../components/common/AdminListTable";
import DynamicForm from "../../../../components/formAndDialog/DynamicForm";
import DynamicDialog from "../../../../components/formAndDialog/DynamicDialog"; 
import useAdminCrud from "../../../../utils/useAdminCrud";
import {
  getPositionsAPI,
  createPositionAPI,
  updatePositionAPI,
  deletePositionAPI,
} from "../../../../api/employee/position/request";

const PositionManagement = () => {
  const [dialog, setDialog] = useState({
    open: false,
    mode: "confirm",
    title: "",
    message: "",
    onConfirm: null,
  });

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
      fetch: getPositionsAPI,
      create: createPositionAPI,
      update: updatePositionAPI,
      delete: deletePositionAPI,
    },
    rules: {
      name: { required: true, message: "Tên chức vụ là bắt buộc" },
      base_salary: { required: true, message: "Lương cơ bản là bắt buộc" },
    },
  });

  // Create
  const onSave = async (formData) => {
    setDialog({
      open: true,
      mode: "confirm",
      title: editingItem ? "Xác nhận cập nhật" : "Xác nhận thêm mới",
      message: editingItem
        ? `Bạn có chắc chắn muốn cập nhật chức vụ "${formData.name}" không?`
        : `Bạn có chắc chắn muốn thêm chức vụ "${formData.name}" với lương cơ bản ${formData.base_salary.toLocaleString()} VNĐ không?`,
      onConfirm: async () => {
        const success = await handleSave(formData);
        if (success) {
          await fetchData();
          handleCloseModal();
          setDialog({
            open: true,
            mode: "success",
            title: "Thành công",
            message: editingItem
              ? "Đã cập nhật chức vụ thành công!"
              : "Đã thêm chức vụ mới thành công!",
            onConfirm: null,
          });
        } else {
          setDialog({
            open: true,
            mode: "error",
            title: "Lỗi",
            message: "Không thể lưu dữ liệu. Vui lòng thử lại!",
          });
        }
      },
    });
  };

  // Delete
  const onDelete = (id, name) => {
    setDialog({
      open: true,
      mode: "warning",
      title: "Xác nhận xoá",
      message: `Bạn có chắc chắn muốn xoá chức vụ "${name}" không?`,
      onConfirm: async () => {
        const success = await handleDelete(id);
        if (success) {
          await fetchData();
          setDialog({
            open: true,
            mode: "success",
            title: "Đã xoá",
            message: `Chức vụ "${name}" đã được xoá thành công!`,
          });
        } else {
          setDialog({
            open: true,
            mode: "error",
            title: "Lỗi",
            message: "Không thể xoá chức vụ. Vui lòng thử lại!",
          });
        }
      },
    });
  };

  if (loading)
    return <div className="p-6 text-center text-gray-600">Đang tải...</div>;
  if (error)
    return (
      <div className="p-6 text-center text-red-500">Không thể tải dữ liệu.</div>
    );

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Quản lý chức vụ</h1>

      {/* Header */}
      <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-3 mb-6">
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition w-full sm:w-auto"
        >
          <FaPlus /> Thêm chức vụ
        </button>

        <input
          type="text"
          placeholder="Tìm kiếm theo tên hoặc lương cơ bản..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      {/* Table List */}
      <AdminListTable
        columns={[
          { field: "name", label: "Tên chức vụ" },
          {
            field: "base_salary",
            label: "Lương cơ bản (VNĐ)",
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
            onClick: (row) => onDelete(row.id, row.name),
          },
        ]}
      />

      {/* Form Add / Edit */}
      {showForm && (
        <DynamicForm
          title={editingItem ? "Sửa chức vụ" : "Thêm chức vụ"}
          fields={[
            {
              name: "name",
              label: "Tên chức vụ",
              type: "text",
              required: true,
            },
            {
              name: "base_salary",
              label: "Lương cơ bản (VNĐ)",
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

      {/*  DynamicDialog */}
      <DynamicDialog
        open={dialog.open}
        mode={dialog.mode}
        title={dialog.title}
        message={dialog.message}
        onConfirm={dialog.onConfirm}
        onClose={() => setDialog({ ...dialog, open: false })}
      />
    </div>
  );
};

export default memo(PositionManagement);
