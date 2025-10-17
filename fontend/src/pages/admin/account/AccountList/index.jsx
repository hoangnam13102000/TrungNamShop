import { memo, useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import AdminListTable from "../../../../components/common/AdminListTable";
import DynamicForm from "../../../../components/DynamicForm";
import useAdminCrud from "../../../../utils/useAdminCrud";
import {
  getAccountAPI,
  createAccountAPI,
  updateAccountAPI,
  deleteAccountAPI,
} from "../../../../api/account/accountManagement/request";
import { getAccountTypeAPI } from "../../../../api/account/accountType/request";
import { getAccountLevelingAPI } from "../../../../api/account/memberLeveling/request";

const AccountList = () => {
  // State to hold account type and member level options
  const [accountTypes, setAccountTypes] = useState([]);
  const [accountLevels, setAccountLevels] = useState([]);

 // Fetch account type and member level options for the dropdowns
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [types, levels] = await Promise.all([
          getAccountTypeAPI(),
          getAccountLevelingAPI(),
        ]);
        // Map API data to {value, label} format for select fields
        setAccountTypes(
          types.map((t) => ({ value: t.id, label: t.account_type_name }))
        );
        setAccountLevels(levels.map((l) => ({ value: l.id, label: l.name })));
      } catch (err) {
        console.error(
          "Không thể tải loại tài khoản hoặc cấp độ thành viên:",
          err
        );
      }
    };
    fetchOptions();
  }, []);

   // Custom hook for CRUD operations
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
      fetch: getAccountAPI,
      create: createAccountAPI,
      update: updateAccountAPI,
      delete: deleteAccountAPI,
    },
    rules: {
      username: { required: true, message: "Tên tài khoản là bắt buộc" },
      password: { required: true, message: "Mật khẩu là bắt buộc" },
      account_type_id: {
        required: true,
        message: "Loại tài khoản là bắt buộc",
      },
      account_level_id: {
        required: true,
        message: "Cấp độ thành viên là bắt buộc",
      },
    },
    hooks: {
      beforeSave: async (data, editingItem) => {
        if (!editingItem) {
          return window.confirm(
            `Bạn có chắc muốn thêm tài khoản "${data.username}" không?`
          );
        }
        return true;
      },
    },
  });

  // Save form data
  const onSave = async (formData) => {
    const success = await handleSave(formData);
    if (success) {
      await fetchData();
      handleCloseModal();
    }
  };

  // Delete an account
  const onDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa tài khoản này không?")) return;
    const success = await handleDelete(id);
    if (success) {
      await fetchData();
    }
  };

   // Loading State
  if (loading)
    return <div className="p-6 text-center text-gray-600">Đang tải...</div>;
  // Error state
  if (error)
    return (
      <div className="p-6 text-center text-red-500">
        Không thể tải dữ liệu tài khoản.
      </div>
    );

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Quản lý tài khoản</h1>

       {/* Header: Add button and search input */}
      <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-3 mb-6">
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition w-full sm:w-auto"
        >
          <FaPlus /> Thêm tài khoản
        </button>

        <input
          type="text"
          placeholder="Tìm kiếm tài khoản..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

     
      <AdminListTable
        columns={[
          { field: "username", label: "Tên tài khoản" },
          {
            field: "account_type_id",
            label: "Loại tài khoản",
            render: (val) => {
              const type = accountTypes.find((t) => t.value === val);
              return type ? type.label : "—";
            },
          },
          {
            field: "account_level_id",
            label: "Cấp độ thành viên",
            render: (val) => {
              const level = accountLevels.find((l) => l.value === val);
              return level ? level.label : "—";
            },
          },
          {
            field: "status",
            label: "Trạng thái",
            render: (value) => (
              <span
                className={`px-2 py-1 rounded-full text-sm ${
                  value === 1
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {value === 1 ? "Hoạt động" : "Ngừng hoạt động"}
              </span>
            ),
          },
        ]}
        data={filteredItems}
        actions={[
          { icon: <FaEdit />, label: "Sửa", onClick: handleEdit },
          {
            icon: <FaTrash />,
            label: "Xóa",
            onClick: (row) => onDelete(row.id),
          },
        ]}
      />

      {showForm && (
        <DynamicForm
          title={editingItem ? "Chỉnh sửa tài khoản" : "Thêm tài khoản"}
          fields={[
            {
              name: "username",
              label: "Tên tài khoản",
              type: "text",
              required: true,
            },
            // Chỉ hiển thị password khi thêm mới
            ...(!editingItem
              ? [
                  {
                    name: "password",
                    label: "Mật khẩu",
                    type: "password",
                    required: true,
                  },
                ]
              : []),
            {
              name: "account_type_id",
              label: "Loại tài khoản",
              type: "select",
              options: accountTypes,
              required: true,
            },
            {
              name: "account_level_id",
              label: "Cấp độ thành viên",
              type: "select",
              options: accountLevels,
              required: true,
            },
            {
              name: "status",
              label: "Trạng thái",
              type: "select",
              options: [
                { value: 1, label: "Hoạt động" },
                { value: 0, label: "Ngừng hoạt động" },
              ],
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

export default memo(AccountList);
