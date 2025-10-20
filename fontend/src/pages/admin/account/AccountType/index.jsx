import { memo, useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import AdminListTable from "../../../../components/common/AdminListTable";
import DynamicForm from "../../../../components/formAndDialog/DynamicForm";
import DynamicDialog from "../../../../components/formAndDialog/DynamicDialog";
import useAdminCrud from "../../../../utils/useAdminCrud";
import {
  getAccountTypeAPI,
  createAccountTypeAPI,
  updateAccountTypeAPI,
  deleteAccountTypeAPI,
} from "../../../../api/account/accountType/request";

const AccountTypeList = () => {
  const protectedNames = ["Admin", "Nhân viên", "Khách hàng"];
  const [dialog, setDialog] = useState({ open: false });

  // CRUD logic
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
      fetch: getAccountTypeAPI,
      create: createAccountTypeAPI,
      update: updateAccountTypeAPI,
      delete: deleteAccountTypeAPI,
    },
    rules: {
      account_type_name: {
        required: true,
        message: "Tên loại tài khoản là bắt buộc",
      },
    },
  });

  const showDialog = (options) => setDialog({ open: true, ...options });
  const closeDialog = () => setDialog({ open: false });

  // --- Save ---
  const onSave = async (formData) => {
    const isEditing = Boolean(editingItem);

    // Chặn loại hệ thống
    if (!isEditing && protectedNames.includes(formData.account_type_name)) {
      return showDialog({
        mode: "warning",
        title: "Không hợp lệ",
        message: "Không thể tạo trùng loại tài khoản hệ thống.",
        onClose: closeDialog,
      });
    }

    // Hộp xác nhận
    showDialog({
      mode: "confirm",
      title: isEditing
        ? "Xác nhận cập nhật loại tài khoản"
        : "Xác nhận thêm loại tài khoản",
      message: isEditing
        ? `Bạn có chắc chắn muốn cập nhật loại "${formData.account_type_name}" không?`
        : `Bạn có chắc chắn muốn thêm loại "${formData.account_type_name}" không?`,
      onConfirm: async () => {
        const success = await handleSave(formData);
        closeDialog();

        if (success) {
          await fetchData();
          handleCloseModal();

          showDialog({
            mode: "success",
            title: "Thành công",
            message: isEditing
              ? "Cập nhật loại tài khoản thành công!"
              : "Thêm loại tài khoản mới thành công!",
            onClose: closeDialog,
          });
        } else {
          showDialog({
            mode: "error",
            title: "Lỗi",
            message: "Không thể lưu loại tài khoản.",
            onClose: closeDialog,
          });
        }
      },
      onClose: closeDialog,
    });
  };

  // --- Delete ---
  const onDelete = (id, name) => {
    if (protectedNames.includes(name)) {
      return showDialog({
        mode: "warning",
        title: "Không thể xóa",
        message: "Không thể xóa loại tài khoản hệ thống.",
        onClose: closeDialog,
      });
    }

    showDialog({
      mode: "confirm",
      title: "Xác nhận xóa loại tài khoản",
      message: `Bạn có chắc chắn muốn xóa loại "${name}" không?`,
      onConfirm: async () => {
        const success = await handleDelete(id);
        closeDialog();

        if (success) {
          await fetchData();
          showDialog({
            mode: "success",
            title: "Thành công",
            message: "Xóa loại tài khoản thành công!",
            onClose: closeDialog,
          });
        } else {
          showDialog({
            mode: "error",
            title: "Thất bại",
            message: "Không thể xóa loại tài khoản này.",
            onClose: closeDialog,
          });
        }
      },
      onClose: closeDialog,
    });
  };

  // --- Loading / Error ---
  if (loading)
    return <div className="p-6 text-center text-gray-600">Đang tải...</div>;
  if (error)
    return (
      <div className="p-6 text-center text-red-500">
        Không thể tải dữ liệu loại tài khoản.
      </div>
    );

  // --- Main UI ---
  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Quản lý loại tài khoản</h1>

      {/* Toolbar */}
      <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-3 mb-6">
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition w-full sm:w-auto"
        >
          <FaPlus /> Thêm loại tài khoản
        </button>

        <input
          type="text"
          placeholder="Tìm kiếm loại tài khoản..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      {/* Table */}
      <AdminListTable
        columns={[{ field: "account_type_name", label: "Tên loại tài khoản" }]}
        data={filteredItems}
        actions={[
          {
            icon: <FaEdit />,
            label: "Sửa",
            onClick: (row) => {
              if (protectedNames.includes(row.account_type_name)) {
                showDialog({
                  mode: "warning",
                  title: "Không thể sửa",
                  message: "Không thể sửa loại tài khoản hệ thống.",
                  onClose: closeDialog,
                });
                return;
              }
              handleEdit(row);
            },
          },
          {
            icon: <FaTrash />,
            label: "Xóa",
            onClick: (row) => onDelete(row.id, row.account_type_name),
          },
        ]}
      />

      {/* Form */}
      {showForm && (
        <DynamicForm
          title={editingItem ? "Sửa loại tài khoản" : "Thêm loại tài khoản"}
          fields={[
            {
              name: "account_type_name",
              label: "Tên loại tài khoản",
              type: "text",
              required: true,
            },
          ]}
          initialData={editingItem}
          onSave={onSave}
          onClose={handleCloseModal}
          errors={errors}
        />
      )}

      {/* Dialog */}
      <DynamicDialog {...dialog} />
    </div>
  );
};

export default memo(AccountTypeList);
