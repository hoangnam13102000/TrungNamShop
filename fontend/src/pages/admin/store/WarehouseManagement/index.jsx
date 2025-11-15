import { memo, useState, useMemo } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useCRUDApi } from "../../../../api/hooks/useCRUDApi";
import useAdminCrud from "../../../../utils/hooks/useAdminCrud1";
import useAdminHandler from "../../../../components/common/useAdminHandler";
import AdminLayoutPage from "../../../../components/common/Layout";
import DynamicDialog from "../../../../components/formAndDialog/DynamicDialog"; // <- Sửa import ở đây

const WarehouseManagement = () => {
  const warehouseAPI = useCRUDApi("warehouses");
  const { data: warehouses = [], isLoading, isError, refetch } = warehouseAPI.useGetAll();
  const create = warehouseAPI.useCreate();
  const update = warehouseAPI.useUpdate();
  const remove = warehouseAPI.useDelete();

  const crud = useAdminCrud(
    {
      create: create.mutateAsync,
      update: async (id, data) => update.mutateAsync({ id, data }),
      delete: async (id) => remove.mutateAsync(id),
    },
    "warehouses"
  );

  const { dialog, handleSave, handleDelete, closeDialog } = useAdminHandler(
    crud,
    refetch,
    (item) => item?.name || "Không tên"
  );

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredItems = useMemo(
    () => warehouses.filter((w) => (w.name || "").toLowerCase().includes(search.toLowerCase().trim())),
    [warehouses, search]
  );

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [filteredItems, currentPage]);

  const tableColumns = [
    { field: "name", label: "Tên kho" },
    { field: "address", label: "Địa chỉ kho" },
    { field: "note", label: "Ghi chú" },
  ];

  const tableActions = [
    { icon: <FaEdit />, label: "Sửa", onClick: crud.handleEdit },
    { icon: <FaTrash />, label: "Xóa", onClick: handleDelete },
  ];

  const formFields = [
    { name: "name", label: "Tên kho", type: "text", required: true },
    { name: "address", label: "Địa chỉ kho", type: "textarea", required: true },
    { name: "note", label: "Ghi chú", type: "textarea" },
  ];

  if (isLoading)
    return <div className="p-6 sm:p-8 text-center text-gray-600">Đang tải...</div>;

  if (isError || create.isError || update.isError || remove.isError)
    return <div className="p-6 sm:p-8 text-center text-red-500">Có lỗi xảy ra khi tải dữ liệu kho.</div>;

  return (
    <>
      <AdminLayoutPage
        title="Kho hàng"
        description="Quản lý các kho hàng và thông tin lưu trữ"
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
          title: crud.mode === "edit" ? "Sửa kho" : "Thêm kho",
          fields: formFields,
          initialData: crud.selectedItem,
          errors: crud.errors,
        }}
        onFormSave={handleSave}        // Giữ nguyên logic save cũ
        onFormClose={crud.handleCloseForm} // Nút Hủy modal
      />

      {/* Dialog confirm / success / error */}
      <DynamicDialog
        open={dialog.open}
        mode={dialog.mode}
        title={dialog.title}
        message={dialog.message}
        onClose={closeDialog}        // Hủy / Đóng dialog
        onConfirm={dialog.onConfirm}  // Xác nhận dialog
        confirmText={dialog.confirmText}
        cancelText={dialog.cancelText}
        closeText={dialog.closeText}
        customButtons={dialog.customButtons}
      />
    </>
  );
};

export default memo(WarehouseManagement);
