import { memo, useState, useMemo } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useCRUDApi } from "../../../../api/hooks/useCRUDApi";
import useAdminCrud from "../../../../utils/hooks/useAdminCrud1";
import useAdminHandler from "../../../../components/common/useAdminHandler";
import AdminLayoutPage from "../../../../components/common/Layout";
import DynamicDialog from "../../../../components/formAndDialog/DynamicDialog";

const AccountTypeManagement = () => {
  const protectedNames = ["Admin", "Nhân viên", "Khách hàng"];

  /** 1. FETCH DATA */
  const accountTypeAPI = useCRUDApi("account-types");
  const { data: accountTypes = [], isLoading, refetch } = accountTypeAPI.useGetAll();
  const createMutation = accountTypeAPI.useCreate();
  const updateMutation = accountTypeAPI.useUpdate();
  const deleteMutation = accountTypeAPI.useDelete();

  /** 2. CRUD */
  const crud = useAdminCrud(
    {
      create: createMutation.mutateAsync,
      update: async (id, data) => updateMutation.mutateAsync({ id, data }),
      delete: async (id) => deleteMutation.mutateAsync(id),
    },
    "account-types"
  );

  const { dialog, handleSave, handleDelete, closeDialog } = useAdminHandler(
    crud,
    refetch,
    (item) => item?.account_type_name || "Không tên",
    protectedNames
  );

  /** 3. STATE SEARCH + PAGINATION */
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  /** 4. FILTER & PAGINATION */
  const filteredItems = useMemo(
    () => accountTypes.filter((a) =>
      (a.account_type_name || "").toLowerCase().includes(search.toLowerCase().trim())
    ),
    [accountTypes, search]
  );

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [filteredItems, currentPage]);

  /** 5. TABLE CONFIG */
  const tableColumns = [{ field: "account_type_name", label: "Tên loại tài khoản" }];

  const tableActions = [
    {
      icon: <FaEdit />,
      label: "Sửa",
      onClick: crud.handleEdit,
      disabled: (row) => protectedNames.includes(row.account_type_name),
      tooltip: (row) =>
        protectedNames.includes(row.account_type_name)
          ? "Loại tài khoản hệ thống - không thể sửa"
          : "Sửa loại tài khoản",
    },
    {
      icon: <FaTrash />,
      label: "Xóa",
      onClick: handleDelete,
      disabled: (row) => protectedNames.includes(row.account_type_name),
      tooltip: (row) =>
        protectedNames.includes(row.account_type_name)
          ? "Loại tài khoản hệ thống - không thể xóa"
          : "Xóa loại tài khoản",
    },
  ];

  /** 6. FORM CONFIG */
  const formFields = [
    { name: "account_type_name", label: "Tên loại tài khoản", type: "text", required: true },
  ];

  return (
    <>
      <AdminLayoutPage
        title="Loại tài khoản"
        description="Quản lý các loại tài khoản trong hệ thống"
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
          title: crud.mode === "edit"
            ? `Sửa loại tài khoản - ${crud.selectedItem?.account_type_name}`
            : "Thêm loại tài khoản",
          fields: formFields,
          initialData: crud.selectedItem,
          errors: crud.errors,
        }}
        onFormSave={handleSave}           // giữ logic save
        onFormClose={crud.handleCloseForm} // nút Hủy form modal
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

export default memo(AccountTypeManagement);
