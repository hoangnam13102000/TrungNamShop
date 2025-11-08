import { memo, useState, useCallback, useMemo } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import AdminListTable from "../../../../components/common/AdminListTable";
import DynamicForm from "../../../../components/formAndDialog/DynamicForm";
import DynamicDialog from "../../../../components/formAndDialog/DynamicDialog";
import useAdminCrud from "../../../../utils/hooks/useAdminCrud1";
import { useCRUDApi } from "../../../../api/hooks/useCRUDApi";
import Pagination from "../../../../components/common/Pagination";

const AccountList = () => {
  /** ==========================
   * 1. CRUDApi
   * ========================== */
  const accountAPI = useCRUDApi("accounts");
  const { data: accounts = [], isLoading, refetch } = accountAPI.useGetAll();
  const createMutation = accountAPI.useCreate();
  const updateMutation = accountAPI.useUpdate();
  const deleteMutation = accountAPI.useDelete();

  const accountLevelAPI = useCRUDApi("account-leveling");
  const { data: accountLevels = [] } = accountLevelAPI.useGetAll();

  const accountLevelOptions = useMemo(
    () => accountLevels.map((l) => ({ value: l.id, label: l.name })),
    [accountLevels]
  );

  /** ==========================
   * 2. CRUD HOOK
   * ========================== */
  const crud = useAdminCrud(
    {
      create: createMutation.mutateAsync,
      update: async (id, data) => updateMutation.mutateAsync({ id, data }),
      delete: async (id) => deleteMutation.mutateAsync(id),
    },
    "accounts"
  );

  const [search, setSearch] = useState("");
  const [dialog, setDialog] = useState({
    open: false,
    mode: "alert",
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
   * 3. Filter data
   * ========================== */
  const filteredItems = useMemo(() => {
    return accounts.filter((acc) =>
      (acc.username || "").toLowerCase().includes(search.toLowerCase().trim())
    );
  }, [accounts, search]);

  /** ==========================
   * 4. Pagination
   * ========================== */
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [currentPage, filteredItems]);

  /** ==========================
   * 5. Handlers
   * ========================== */
  const handleSave = async (formData) => {
    const payload = {
      ...formData,
      account_level_id: formData.account_level_id?.value || formData.account_level_id,
    };

    showDialog(
      "confirm",
      crud.selectedItem ? "Xác nhận cập nhật" : "Xác nhận thêm mới",
      crud.selectedItem
        ? `Bạn có chắc chắn muốn cập nhật tài khoản "${formData.username}" không?`
        : `Bạn có chắc chắn muốn thêm tài khoản "${formData.username}" không?`,
      async () => {
        try {
          await crud.handleSave(payload);
          await refetch();
          crud.handleCloseForm();
          showDialog(
            "success",
            "Thành công",
            crud.selectedItem
              ? "Tài khoản đã được cập nhật thành công!"
              : "Tài khoản đã được thêm thành công!"
          );
        } catch (err) {
          console.error(err);
          showDialog("error", "Lỗi", "Không thể lưu tài khoản!");
        }
      }
    );
  };

  const handleDelete = (item) => {
    showDialog(
      "confirm",
      "Xác nhận xoá",
      `Bạn có chắc chắn muốn xóa tài khoản "${item.username}" không?`,
      async () => {
        try {
          await crud.handleDelete(item.id);
          await refetch();
          showDialog("success", "Thành công", "Tài khoản đã được xóa thành công!");
        } catch (err) {
          console.error(err);
          showDialog("error", "Lỗi", "Không thể xóa tài khoản!");
        }
      }
    );
  };

  /** ==========================
   * 6. UI
   * ========================== */
  if (isLoading)
    return <div className="p-6 text-center text-gray-600">Đang tải...</div>;

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Quản lý tài khoản</h1>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <button
          onClick={crud.handleAdd}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 w-full sm:w-auto"
        >
          <FaPlus /> Thêm tài khoản
        </button>

        <input
          type="text"
          placeholder="Tìm kiếm tài khoản..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-3 py-2 w-full sm:w-72"
        />
      </div>

      <AdminListTable
        columns={[
          { field: "username", label: "Tên tài khoản" },
          {
            field: "account_type",
            label: "Loại tài khoản",
            render: (_, row) => row.account_type?.account_type_name || "—",
          },
          {
            field: "account_level",
            label: "Cấp độ thành viên",
            render: (_, row) => row.account_level?.name || "—",
          },
          {
            field: "status",
            label: "Trạng thái",
            render: (val) => (
              <span
                className={`px-2 py-1 rounded-full text-sm ${
                  val === 1
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {val === 1 ? "Hoạt động" : "Ngừng hoạt động"}
              </span>
            ),
          },
        ]}
        data={currentItems}
        actions={[
          { icon: <FaEdit />, label: "Sửa", onClick: crud.handleEdit },
          { icon: <FaTrash />, label: "Xóa", onClick: handleDelete },
        ]}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          maxVisible={5}
        />
      )}

      {crud.openForm && (
        <DynamicForm
          title={
            crud.mode === "edit"
              ? `Chỉnh sửa: ${crud.selectedItem?.username}`
              : "Thêm tài khoản"
          }
          fields={[
            {
              name: "username",
              label: "Tên tài khoản",
              type: "text",
              required: true,
              disabled: !!crud.selectedItem,
            },
            ...(!crud.selectedItem
              ? [
                  {
                    name: "password",
                    label: "Mật khẩu",
                    type: "password",
                    minLength: 6,
                    required: true,
                  },
                ]
              : []),
            {
              name: "account_type_name",
              label: "Loại tài khoản",
              type: "text",
              disabled: true,
              value: crud.selectedItem?.account_type?.account_type_name || "—",
            },
            {
              name: "account_level_id",
              label: "Cấp độ thành viên",
              type: "select",
              options: accountLevelOptions,
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
          initialData={crud.selectedItem}
          onSave={handleSave}
          onClose={crud.handleCloseForm}
        />
      )}

      <DynamicDialog
        open={dialog.open}
        mode={dialog.mode}
        title={dialog.title}
        message={dialog.message}
        onClose={closeDialog}
        onConfirm={async () => {
          setDialog((prev) => ({ ...prev, open: false }));
          if (dialog.onConfirm) await dialog.onConfirm();
        }}
      />
    </div>
  );
};

export default memo(AccountList);
