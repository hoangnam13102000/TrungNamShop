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
  /** ==========================
   * 1. Proctected Account
   * ========================== */
  const protectedNames = ["Admin", "Nhân viên", "Khách hàng"];

  /** ==========================
   * 2. Fetch + CRUD
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
   * 3. Handler chung + dialog confirm của useAdminHandler
   * ========================== */
  const { dialog, handleSave, handleDelete, closeDialog } = useAdminHandler(
    crud,
    refetch,
    (item) => item?.account_type_name || "Không tên",
    protectedNames
  );

  /** ==========================
   * 4. Dialog riêng cho protected-case (không cho sửa/xóa)
   * ========================== */
  const [protectedDialog, setProtectedDialog] = useState({
    open: false,
    title: "",
    message: "",
  });

  const openProtectedDialog = (title, message) =>
    setProtectedDialog({ open: true, title, message });

  const closeProtectedDialog = () =>
    setProtectedDialog({ open: false, title: "", message: "" });

  /** ==========================
   * 5. Click handlers: check protectedNames trước
   * ========================== */
  const handleEditClick = (row) => {
    if (protectedNames.includes(row.account_type_name)) {
      openProtectedDialog(
        "Không thể sửa",
        `Loại tài khoản "${row.account_type_name}" là hệ thống và không được phép sửa.`
      );
      return;
    }
    // nếu không protected => mở form edit bình thường
    crud.handleEdit(row);
  };

  const handleDeleteClick = (row) => {
    if (protectedNames.includes(row.account_type_name)) {
      openProtectedDialog(
        "Không thể xóa",
        `Loại tài khoản "${row.account_type_name}" là hệ thống và không được phép xóa.`
      );
      return;
    }
    // nếu không protected => gọi handler xóa bình thường (sẽ mở confirm dialog của useAdminHandler)
    handleDelete(row);
  };

  /** ==========================
   * 6. Search & Filter
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
   * 7. Loading / Error UI
   * ========================== */
  if (isLoading)
    return <div className="p-6 text-center text-gray-600">Đang tải...</div>;
  if (createMutation.isError || updateMutation.isError || deleteMutation.isError)
    return (
      <div className="p-6 text-center text-red-500">
        Có lỗi xảy ra khi tải dữ liệu loại tài khoản.
      </div>
    );

  /** ==========================
   * 8. Render
   * ========================== */
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
          {
            icon: <FaEdit />,
            label: "Sửa",
            // onClick nhận row từ AdminListTable
            onClick: (row) => handleEditClick(row),
            // vẫn có disabled để UI rõ ràng
            disabled: (row) => protectedNames.includes(row.account_type_name),
            tooltip: (row) =>
              protectedNames.includes(row.account_type_name)
                ? "Loại tài khoản hệ thống - không thể sửa"
                : "Sửa loại tài khoản",
          },
          {
            icon: <FaTrash />,
            label: "Xóa",
            onClick: (row) => handleDeleteClick(row),
            disabled: (row) => protectedNames.includes(row.account_type_name),
            tooltip: (row) =>
              protectedNames.includes(row.account_type_name)
                ? "Loại tài khoản hệ thống - không thể xóa"
                : "Xóa loại tài khoản",
          },
        ]}
      />

      {/* Form Add / Edit */}
      {crud.openForm && (
        <DynamicForm
          title={
            crud.mode === "edit"
              ? `Sửa loại tài khoản - ${crud.selectedItem?.account_type_name}`
              : "Thêm loại tài khoản"
          }
          fields={[
            {
              name: "account_type_name",
              label: "Tên loại tài khoản",
              type: "text",
              required: true,
            },
          ]}
          initialData={crud.selectedItem}
          onSave={handleSave}
          onClose={crud.handleCloseForm}
        />
      )}

      {/* Dialog: confirm của useAdminHandler (xóa/cập nhật) */}
      <DynamicDialog
        open={dialog.open}
        mode={dialog.mode}
        title={dialog.title}
        message={dialog.message}
        onConfirm={dialog.onConfirm}
        onClose={closeDialog}
      />

      {/* Dialog: thông báo không được phép sửa/xóa (protected) */}
      <DynamicDialog
        open={protectedDialog.open}
        mode="info"
        title={protectedDialog.title}
        message={protectedDialog.message}
        onClose={closeProtectedDialog}
        // onConfirm không cần (khi người dùng nhấn OK chỉ đóng)
      />
    </div>
  );
};

export default memo(AccountTypeList);
