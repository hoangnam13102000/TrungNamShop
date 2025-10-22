import { memo, useState, useMemo } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import AdminListTable from "../../../../components/common/AdminListTable";
import DynamicForm from "../../../../components/formAndDialog/DynamicForm";
import DynamicDialog from "../../../../components/formAndDialog/DynamicDialog";
import useAdminCrud from "../../../../utils/useAdminCrud1";
import useAdminHandler from "../../../../components/common/useAdminHandler";
import {
  useAccountTypes,
  useCreateAccountType,
  useUpdateAccountType,
  useDeleteAccountType,
} from "../../../../api/account/accountType";

const AccountTypeList = () => {
  const protectedNames = ["Admin", "Nhân viên", "Khách hàng"];

  /** ==========================
   * 1. FETCH DATA & CRUD
   * ========================== */
  const { data: accountTypes = [], isLoading, refetch } = useAccountTypes();
  const createMutation = useCreateAccountType();
  const updateMutation = useUpdateAccountType();
  const deleteMutation = useDeleteAccountType();

  const crud = useAdminCrud(
    {
      create: createMutation.mutateAsync,
      update: async (id, data) => updateMutation.mutateAsync({ id, data }),
      delete: async (id) => deleteMutation.mutateAsync(id),
    },
    "account-types"
  );

  /** ==========================
   * 2. HANDLER + DIALOG
   * ========================== */
  const { dialog, handleSave, handleDelete, closeDialog } = useAdminHandler(
    crud,
    refetch,
    (item) => item?.account_type_name || "Không tên",
    protectedNames // truyền mảng bảo vệ
  );

  /** ==========================
   * 3. SEARCH & FILTER
   * ========================== */
  const [search, setSearch] = useState("");
  const filteredItems = useMemo(() => {
    return accountTypes.filter((a) =>
      (a.account_type_name || "")
        .toLowerCase()
        .includes(search.toLowerCase().trim())
    );
  }, [accountTypes, search]);

  /** ==========================
   * 4. UI
   * ========================== */
  if (isLoading)
    return <div className="p-6 text-center text-gray-600">Đang tải...</div>;
  if (createMutation.isError || updateMutation.isError || deleteMutation.isError)
    return (
      <div className="p-6 text-center text-red-500">
        Có lỗi xảy ra khi tải dữ liệu loại tài khoản.
      </div>
    );

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Quản lý loại tài khoản</h1>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <button
          onClick={crud.handleAdd}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 w-full sm:w-auto"
        >
          <FaPlus /> Thêm loại tài khoản
        </button>

        <input
          type="text"
          placeholder="Tìm kiếm loại tài khoản..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-3 py-2 w-full sm:w-72"
        />
      </div>

      {/* Table */}
      <AdminListTable
        columns={[{ field: "account_type_name", label: "Tên loại tài khoản" }]}
        data={filteredItems}
        actions={[
          { icon: <FaEdit />, label: "Sửa", onClick: crud.handleEdit, disabled: (row) => protectedNames.includes(row.account_type_name) },
          { icon: <FaTrash />, label: "Xóa", onClick: handleDelete, disabled: (row) => protectedNames.includes(row.account_type_name) },
        ]}
      />

      {/* Form Add / Edit */}
      {crud.openForm && (
        <DynamicForm
          title={crud.mode === "edit" ? `Sửa loại tài khoản - ${crud.selectedItem?.account_type_name}` : "Thêm loại tài khoản"}
          fields={[
            { name: "account_type_name", label: "Tên loại tài khoản", type: "text", required: true },
          ]}
          initialData={crud.selectedItem}
          onSave={handleSave}
          onClose={crud.handleCloseForm}
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

export default memo(AccountTypeList);
