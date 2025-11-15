import { memo, useState, useMemo } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useCRUDApi } from "../../../../api/hooks/useCRUDApi";
import useAdminCrud from "../../../../utils/hooks/useAdminCrud1";
import useAdminHandler from "../../../../components/common/useAdminHandler";
import AdminLayoutPage from "../../../../components/common/Layout";
import DynamicDialog from "../../../../components/formAndDialog/DynamicDialog";

const AccountManagement = () => {
  /** 1. FETCH DATA */
  const { useGetAll: useGetAccounts, useCreate: useCreateAccount, useUpdate: useUpdateAccount, useDelete: useDeleteAccount } = useCRUDApi("accounts");
  const { useGetAll: useGetAccountLevels } = useCRUDApi("account-leveling");
  const { useGetAll: useGetAccountTypes } = useCRUDApi("account-types");

  const { data: accounts = [], isLoading, refetch } = useGetAccounts();
  const { data: accountLevels = [] } = useGetAccountLevels();
  const { data: accountTypes = [] } = useGetAccountTypes();

  const createMutation = useCreateAccount();
  const updateMutation = useUpdateAccount();
  const deleteMutation = useDeleteAccount();

  const accountLevelOptions = useMemo(
    () => accountLevels.map(l => ({ value: l.id, label: l.name })),
    [accountLevels]
  );
  const accountTypeOptions = useMemo(
    () => accountTypes.map(t => ({ value: t.id, label: t.account_type_name })),
    [accountTypes]
  );

  /** 2. CRUD */
  const crud = useAdminCrud(
    {
      create: createMutation.mutateAsync,
      update: async (id, data) => updateMutation.mutateAsync({ id, data }),
      delete: async (id) => deleteMutation.mutateAsync(id),
    },
    "accounts"
  );

  const { dialog, handleSave, handleDelete, closeDialog } = useAdminHandler(crud, refetch);

  /** 3. STATE */
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  /** 4. FILTER & PAGINATION */
  const filteredItems = useMemo(() => {
    return accounts.filter(acc => (acc.username || "").toLowerCase().includes(search.toLowerCase().trim()));
  }, [accounts, search]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [currentPage, filteredItems]);

  /** 5. TABLE & FORM CONFIG */
  const tableColumns = [
    { field: "username", label: "Tên tài khoản" },
    { field: "account_type.account_type_name", label: "Loại tài khoản" },
    { field: "account_level.name", label: "Cấp độ thành viên" },
    {
      field: "status",
      label: "Trạng thái",
      render: (val) => val === 1 ? "Hoạt động" : "Ngừng hoạt động",
    },
  ];

  const tableActions = [
    { icon: <FaEdit />, label: "Sửa", onClick: crud.handleEdit },
    { icon: <FaTrash />, label: "Xóa", onClick: handleDelete },
  ];

  const formFields = [
    { name: "username", label: "Tên tài khoản", type: "text", required: true, disabled: !!crud.selectedItem },
    ...(!crud.selectedItem ? [{ name: "password", label: "Mật khẩu", type: "password", required: true, minLength: 6 }] : []),
    { name: "account_type_id", label: "Loại tài khoản", type: "select", options: accountTypeOptions, required: true },
    { name: "account_level_id", label: "Cấp độ thành viên", type: "select", options: accountLevelOptions, required: true },
    { name: "status", label: "Trạng thái", type: "select", options: [{ value: 1, label: "Hoạt động" }, { value: 0, label: "Ngừng hoạt động" }], required: true },
  ];

  return (
    <>
      <AdminLayoutPage
        title="Tài khoản"
        description="Quản lý các tài khoản hệ thống"
        searchValue={search}
        onSearchChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
        onAdd={crud.handleAdd}
        tableColumns={tableColumns}
        tableData={currentItems}
        tableActions={tableActions}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        formModal={{
          open: crud.openForm,
          title: crud.mode === "edit" ? `Chỉnh sửa: ${crud.selectedItem?.username}` : "Thêm tài khoản",
          fields: formFields,
          initialData: crud.selectedItem,
          errors: crud.errors,
        }}
        onFormSave={handleSave}
        onFormClose={crud.handleCloseForm}
      />

      <DynamicDialog
        open={dialog.open}
        mode={dialog.mode}
        title={dialog.title}
        message={dialog.message}
        onClose={closeDialog}
        onConfirm={dialog.onConfirm}
        confirmText={dialog.confirmText}
        cancelText={dialog.cancelText}
        closeText={dialog.closeText}
        customButtons={dialog.customButtons}
      />
    </>
  );
};

export default memo(AccountManagement);
