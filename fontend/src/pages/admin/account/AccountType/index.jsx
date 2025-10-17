import { memo } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import AdminListTable from "../../../../components/common/AdminListTable";
import DynamicForm from "../../../../components/DynamicForm";
import useAdminCrud from "../../../../utils/useAdminCrud";
import {
  getAccountTypeAPI,
  createAccountTypeAPI,
  updateAccountTypeAPI,
  deleteAccountTypeAPI,
} from "../../../../api/account/accountType/request";

const AccountTypeList = () => {
  const protectedNames = ['Admin', 'Nhân viên', 'Khách hàng'];

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
      account_type_name: { required: true, message: "Tên loại tài khoản là bắt buộc" },
    },
    hooks: {
      beforeSave: async (data, editingItem) => {
        if (!editingItem && protectedNames.includes(data.account_type_name)) {
          alert("Không thể tạo trùng loại tài khoản hệ thống.");
          return false;
        }

        if (!editingItem) {
          return window.confirm(
            `Bạn có chắc chắn muốn thêm loại tài khoản "${data.account_type_name}" không?`
          );
        }

        return true;
      },
    },
  });

  const onSave = async (formData) => {
    try {
      const success = await handleSave(formData);
      if (success) {
        await fetchData(); // refresh data
        handleCloseModal(); // close modal
      }
    } catch (err) {
      if (err.response?.status === 403) {
        alert("Không thể chỉnh sửa loại tài khoản hệ thống.");
      } else {
        alert("Lỗi xảy ra khi lưu loại tài khoản.");
      }
    }
  };

  const onDelete = async (id, name) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa loại tài khoản này?")) return;

    if (protectedNames.includes(name)) {
      alert("Không thể xóa loại tài khoản hệ thống.");
      return;
    }

    try {
      const success = await handleDelete(id);
      if (!success) return;
      await fetchData(); // refresh data
    } catch (err) {
      alert("Lỗi xảy ra khi xóa loại tài khoản.");
    }
  };

  if (loading) return <div className="p-6 text-center text-gray-600">Đang tải...</div>;
  if (error) return <div className="p-6 text-center text-red-500">Không thể tải dữ liệu.</div>;

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Quản lý loại tài khoản</h1>

      {/* Header */}
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
                alert("Không thể sửa loại tài khoản hệ thống.");
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

      {/* Add/Edit Form */}
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
    </div>
  );
};

export default memo(AccountTypeList);
