import { memo, useState, useMemo, useCallback } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import AdminListTable from "../../../../components/common/AdminListTable";
import DynamicForm from "../../../../components/formAndDialog/DynamicForm";
import DynamicDialog from "../../../../components/formAndDialog/DynamicDialog";
import useAdminCrud from "../../../../utils/useAdminCrud1";
import {
  useAccountTypes,
  useCreateAccountType,
  useUpdateAccountType,
  useDeleteAccountType,
} from "../../../../api/account/accountType";

const AccountTypeList = () => {
  const protectedNames = ["Admin", "Nhân viên", "Khách hàng"];

  /** ==========================
   * 1. FETCH DATA
   * ========================== */
  const { data: accountTypes = [], isLoading } = useAccountTypes();

  /** ==========================
   * 2. CRUD MUTATIONS
   * ========================== */
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
   * 3. STATE
   * ========================== */
  const [search, setSearch] = useState("");
  const [dialog, setDialog] = useState({
    open: false,
    mode: "alert", // "alert" | "confirm" | "success" | "error" | "warning"
    title: "",
    message: "",
    onConfirm: null,
  });

  const showDialog = useCallback((mode, title, message, onConfirm = null) => {
    setDialog({ open: true, mode, title, message, onConfirm });
  }, []);

  const closeDialog = useCallback(() => {
    setDialog((prev) => ({ ...prev, open: false }));
  }, []);

  /** ==========================
   * 4. FILTER & MAP DATA
   * ========================== */
  const filteredItems = useMemo(() => {
    return accountTypes.filter((a) =>
      (a.account_type_name || "")
        .toLowerCase()
        .includes(search.toLowerCase().trim())
    );
  }, [accountTypes, search]);

  /** ==========================
   * 5. HANDLERS
   * ========================== */
  const handleSave = async (formData) => {
    const isEditing = Boolean(crud.selectedItem);

    // Chặn sửa loại hệ thống
    if (isEditing && protectedNames.includes(crud.selectedItem.account_type_name)) {
      showDialog("warning", "Không thể sửa", "Không thể sửa loại tài khoản hệ thống.");
      return;
    }

    showDialog(
      "confirm",
      isEditing ? "Xác nhận cập nhật" : "Xác nhận thêm",
      isEditing
        ? `Bạn có chắc muốn cập nhật loại "${formData.account_type_name}"?`
        : `Bạn có chắc muốn thêm loại "${formData.account_type_name}"?`,
      async () => {
        try {
          await crud.handleSave(formData);
          showDialog("success", "Thành công", "Đã lưu loại tài khoản thành công!");
        } catch (err) {
          console.error("Save error:", err);
          showDialog("error", "Lỗi", "Không thể lưu loại tài khoản!");
        }
      }
    );
  };

  const handleDelete = (item) => {
    if (protectedNames.includes(item.account_type_name)) {
      showDialog("warning", "Không thể xóa", "Không thể xóa loại tài khoản hệ thống.");
      return;
    }

    showDialog(
      "confirm",
      "Xác nhận xóa",
      `Bạn có chắc muốn xóa loại "${item.account_type_name}"?`,
      async () => {
        try {
          await crud.handleDelete(item.id);
          showDialog("success", "Thành công", "Đã xóa loại tài khoản!");
        } catch (err) {
          console.error("Delete error:", err);
          showDialog("error", "Lỗi", "Không thể xóa loại tài khoản!");
        }
      }
    );
  };

  /** ==========================
   * 6. UI
   * ========================== */
  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Quản lý loại tài khoản</h1>

      {/* BUTTON + SEARCH */}
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

      {/* TABLE */}
      {isLoading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <AdminListTable
          columns={[{ field: "account_type_name", label: "Tên loại tài khoản" }]}
          data={filteredItems}
          actions={[
            {
              icon: <FaEdit />,
              label: "Sửa",
              onClick: crud.handleEdit,
              disabled: (row) => protectedNames.includes(row.account_type_name),
            },
            {
              icon: <FaTrash />,
              label: "Xóa",
              onClick: handleDelete,
              disabled: (row) => protectedNames.includes(row.account_type_name),
            },
          ]}
        />
      )}

      {/* FORM ADD / EDIT */}
      {crud.openForm && (
        <DynamicForm
          title={
            crud.mode === "edit"
              ? `Sửa loại tài khoản - ${crud.selectedItem?.account_type_name}`
              : "Thêm loại tài khoản"
          }
          fields={[
            { name: "account_type_name", label: "Tên loại tài khoản", type: "text", required: true },
          ]}
          initialData={crud.selectedItem}
          onSave={handleSave}
          onClose={crud.handleCloseForm}
        />
      )}

      {/* DIALOG */}
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
