import { memo, useState, useMemo } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import AdminListTable from "../../../../components/common/AdminListTable";
import DynamicForm from "../../../../components/formAndDialog/DynamicForm";
import DynamicDialog from "../../../../components/formAndDialog/DynamicDialog";
import Pagination from "../../../../components/common/Pagination"; 
import useAdminCrud from "../../../../utils/hooks/useAdminCrud1";
import useAdminHandler from "../../../../components/common/useAdminHandler";
import { useCRUDApi } from "../../../../api/hooks/useCRUDApi";

const WarehouseManagement = () => {
  /** ==========================
   * FETCH DATA & CRUD
   * ========================== */
  const warehouseAPI = useCRUDApi("warehouses");
  const { data: warehouses = [], isLoading, refetch } = warehouseAPI.useGetAll();
  const createMutation = warehouseAPI.useCreate();
  const updateMutation = warehouseAPI.useUpdate();
  const deleteMutation = warehouseAPI.useDelete();

  const crud = useAdminCrud(
    {
      create: createMutation.mutateAsync,
      update: async (id, data) => updateMutation.mutateAsync({ id, data }),
      delete: async (id) => deleteMutation.mutateAsync(id),
    },
    "warehouses"
  );

  /** ==========================
   * HANDLER + DIALOG
   * ========================== */
  const { dialog, handleSave, handleDelete, closeDialog } = useAdminHandler(
    crud,
    refetch,
    (item) => item?.name || "Không tên"
  );

  /** ==========================
   * SEARCH & PAGINATION
   * ========================== */
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredItems = useMemo(() => {
    return warehouses.filter((w) =>
      (w.name || "").toLowerCase().includes(search.toLowerCase().trim())
    );
  }, [warehouses, search]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [filteredItems, currentPage]);

  /** ==========================
   * UI
   * ========================== */
  if (isLoading)
    return <div className="p-6 text-center text-gray-600">Đang tải...</div>;
  if (createMutation.isError || updateMutation.isError || deleteMutation.isError)
    return (
      <div className="p-6 text-center text-red-500">
        Có lỗi xảy ra khi tải dữ liệu kho.
      </div>
    );

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Quản lý kho hàng</h1>

      {/* Toolbar */}
      <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-3 mb-6">
        <button
          onClick={crud.handleAdd}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition w-full sm:w-auto"
        >
          <FaPlus /> Thêm kho
        </button>
        <input
          type="text"
          placeholder="Tìm kiếm kho..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1); // reset trang khi search
          }}
          className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-72 focus:ring-2 focus:ring-red-500"
        />
      </div>

      {/* Table */}
      <AdminListTable
        columns={[
          { field: "name", label: "Tên kho" },
          { field: "address", label: "Địa chỉ kho" },
          { field: "note", label: "Ghi chú" },
        ]}
        data={paginatedItems}
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

      {/* Form Add / Edit */}
      {crud.openForm && (
        <DynamicForm
          title={crud.mode === "edit" ? "Sửa kho" : "Thêm kho"}
          fields={[
            { name: "name", label: "Tên kho", type: "text", required: true },
            { name: "address", label: "Địa chỉ kho", type: "textarea", required: true },
            { name: "note", label: "Ghi chú", type: "textarea" },
          ]}
          initialData={crud.selectedItem}
          onSave={handleSave}
          onClose={crud.handleCloseForm}
          errors={crud.errors}
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

export default memo(WarehouseManagement);
