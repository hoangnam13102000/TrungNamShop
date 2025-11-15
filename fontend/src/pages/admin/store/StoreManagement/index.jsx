import { memo, useState, useMemo } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useCRUDApi } from "../../../../api/hooks/useCRUDApi";
import useAdminCrud from "../../../../utils/hooks/useAdminCrud1";
import useAdminHandler from "../../../../components/common/useAdminHandler";
import AdminLayoutPage from "../../../../components/common/Layout";
import DynamicDialog from "../../../../components/formAndDialog/DynamicDialog";

const StoreManagement = () => {
  const storeAPI = useCRUDApi("stores");
  const { data: stores = [], isLoading, isError, refetch } = storeAPI.useGetAll();
  const create = storeAPI.useCreate();
  const update = storeAPI.useUpdate();
  const remove = storeAPI.useDelete();

  // CRUD logic
  const crud = useAdminCrud(
    {
      create: create.mutateAsync,
      update: async (id, data) => update.mutateAsync({ id, data }),
      delete: async (id) => remove.mutateAsync(id),
    },
    "stores"
  );

  // Dialog + Save/Delete handler
  const { dialog, handleSave, handleDelete, closeDialog } = useAdminHandler(
    crud,
    refetch,
    (item) => item?.name || "Không tên"
  );

  // Search & pagination
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredItems = useMemo(
    () => stores.filter((s) => (s.name || "").toLowerCase().includes(search.toLowerCase().trim())),
    [stores, search]
  );

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [filteredItems, currentPage]);

  // Table columns and actions
  const tableColumns = [
    { field: "name", label: "Tên cửa hàng" },
    { field: "address", label: "Địa chỉ" },
    { field: "email", label: "Email" },
    { field: "phone", label: "Số điện thoại" },
  ];

  const tableActions = [
    { icon: <FaEdit />, label: "Sửa", onClick: crud.handleEdit },
    { icon: <FaTrash />, label: "Xóa", onClick: handleDelete },
  ];

  // Form fields
  const formFields = [
    { name: "name", label: "Tên cửa hàng", type: "text", required: true },
    { name: "address", label: "Địa chỉ", type: "textarea", required: true },
    { name: "email", label: "Email", type: "email" },
    { name: "phone", label: "Số điện thoại", type: "text" },
    { name: "google_map", label: "Link Google Map", type: "text" },
  ];

  // Loading / Error
  if (isLoading) return <div className="p-6 text-center text-gray-600">Đang tải...</div>;
  if (isError) return <div className="p-6 text-center text-red-500">Có lỗi xảy ra khi tải dữ liệu cửa hàng.</div>;

  return (
    <>
      <AdminLayoutPage
        title="Cửa hàng"
        description="Quản lý các cửa hàng và thông tin chi nhánh"
        searchValue={search}
        onSearchChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
        onAdd={crud.handleAdd}
        tableColumns={tableColumns}
        tableData={paginatedItems}
        tableActions={tableActions}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        formModal={{
          open: crud.openForm,
          title: crud.mode === "edit" ? "Sửa cửa hàng" : "Thêm cửa hàng",
          fields: formFields,
          initialData: crud.selectedItem,
          errors: crud.errors,
        }}
        onFormSave={handleSave}       
        onFormClose={crud.handleCloseForm} 
      />

      {/* Dialog confirm / success / error */}
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

export default memo(StoreManagement);
