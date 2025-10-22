import { memo, useState, useMemo } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import AdminListTable from "../../../../components/common/AdminListTable";
import DynamicForm from "../../../../components/formAndDialog/DynamicForm";
import DynamicDialog from "../../../../components/formAndDialog/DynamicDialog";
import useAdminCrud from "../../../../utils/useAdminCrud1";
import useAdminHandler from "../../../../components/common/useAdminHandler";
import {
  useWarehouses,
  useCreateWarehouse,
  useUpdateWarehouse,
  useDeleteWarehouse,
} from "../../../../api/warehouse";

const WarehouseManagement = () => {
  /** ==========================
   * 1. FETCH DATA & CRUD
   * ========================== */
  const { data: warehouses = [], isLoading, refetch } = useWarehouses();
  const createMutation = useCreateWarehouse();
  const updateMutation = useUpdateWarehouse();
  const deleteMutation = useDeleteWarehouse();

  const crud = useAdminCrud(
    {
      create: createMutation.mutateAsync,
      update: async (id, data) => updateMutation.mutateAsync({ id, data }),
      delete: async (id) => deleteMutation.mutateAsync(id),
    },
    "warehouses"
  );

  /** ==========================
   * 2. HANDLER + DIALOG
   * ========================== */
  const { dialog, handleSave, handleDelete, closeDialog } = useAdminHandler(
    crud,
    refetch,
    (item) => item?.name || "Không tên"
  );

  /** ==========================
   * 3. SEARCH & FILTER
   * ========================== */
  const [search, setSearch] = useState("");
  const filteredItems = useMemo(() => {
    return warehouses.filter((w) =>
      (w.name || "").toLowerCase().includes(search.toLowerCase().trim())
    );
  }, [warehouses, search]);

  /** ==========================
   * 4. UI
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
          onChange={(e) => setSearch(e.target.value)}
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
        data={filteredItems}
        actions={[
          { icon: <FaEdit />, label: "Sửa", onClick: crud.handleEdit },
          { icon: <FaTrash />, label: "Xóa", onClick: handleDelete },
        ]}
      />

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
          onSave={handleSave} // handleSave đã xử lý dialog
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
        onClose={closeDialog} // ← fix để đóng dialog
      />
    </div>
  );
};

export default memo(WarehouseManagement);
