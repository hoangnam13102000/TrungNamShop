import { memo, useState, useMemo } from "react";
import { FaEdit, FaTrash, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
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
  console.log(accounts);
  /** 5. UI - Status Label */
  const renderStatusLabel = (val) => {
    const isActive = val === 1;
    return (
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          padding: "6px 12px",
          borderRadius: "8px",
          fontSize: "13px",
          fontWeight: "600",
          color: isActive ? "#047857" : "#6b7280",
          backgroundColor: isActive ? "#d1fae5" : "#f3f4f6",
          border: `1.5px solid ${isActive ? "#6ee7b7" : "#d1d5db"}`,
          transition: "all 0.2s ease",
        }}
      >
        {isActive ? (
          <>
            <FaCheckCircle style={{ fontSize: "12px", color: "#10b981" }} />
            <span>Hoạt động</span>
          </>
        ) : (
          <>
            <FaTimesCircle style={{ fontSize: "12px", color: "#9ca3af" }} />
            <span>Ngừng hoạt động</span>
          </>
        )}
      </div>
    );
  };

  /** 6. TABLE & FORM CONFIG */
  const tableColumns = [
    { field: "username", label: "Tên tài khoản" },
    { field: "account_type.account_type_name", label: "Loại tài khoản" },
    { field: "member_level", label: "Cấp độ thành viên" }, // read-only, từ accessor model
    { field: "reward_points", label: "Điểm thưởng" },
    {
      field: "status",
      label: "Trạng thái",
      render: (val) => renderStatusLabel(val),
    },
  ];

  const tableActions = [
    { icon: <FaEdit />, label: "Sửa", onClick: crud.handleEdit },
    { icon: <FaTrash />, label: "Xóa", onClick: handleDelete },
  ];

  // Form fields
  const formFields = [
    { name: "username", label: "Tên tài khoản", type: "text", required: true, disabled: !!crud.selectedItem },
    ...(!crud.selectedItem ? [{ name: "password", label: "Mật khẩu", type: "password", required: true, minLength: 6 }] : []),
    { name: "account_type_id", label: "Loại tài khoản", type: "select", options: accountTypeOptions, required: true },
    { name: "member_level", label: "Cấp độ thành viên", type: "text", disabled: true }, // read-only
    { name: "reward_points", label: "Điểm thưởng", type: "number", required: false, disabled:true },
    { name: "status", label: "Trạng thái", type: "select", options: [{ value: 1, label: "Hoạt động" }, { value: 0, label: "Ngừng hoạt động" }], required: true },
  ];

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
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
      )}

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
