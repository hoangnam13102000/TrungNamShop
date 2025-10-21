import { memo, useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import AdminListTable from "../../../../components/common/AdminListTable";
import DynamicForm from "../../../../components/formAndDialog/DynamicForm";
import DynamicDialog from "../../../../components/formAndDialog/DynamicDialog";
import useAdminCrud from "../../../../utils/useAdminCrud1";
import {
  useWarehouses,
  useCreateWarehouse,
  useUpdateWarehouse,
  useDeleteWarehouse,
} from "../../../../api/warehouse";

const WarehouseManagement = () => {
  // --- Dialog state ---
  const [dialog, setDialog] = useState({
    open: false,
    mode: "confirm",
    title: "",
    message: "",
    onConfirm: null,
  });

  const showDialog = (options) => setDialog({ open: true, ...options });
  const closeDialog = () => setDialog((d) => ({ ...d, open: false }));

  // --- Fetch data & mutations ---
  const { data: warehouses = [], isLoading } = useWarehouses();
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

  // --- Search/filter ---
  const [search, setSearch] = useState("");
  const filteredItems = warehouses.filter((w) =>
    (w.name || "").toLowerCase().includes(search.toLowerCase().trim())
  );

  // --- Handlers ---
  const handleSave = async (formData) => {
    const isEditing = Boolean(crud.selectedItem);
    showDialog({
      mode: "confirm",
      title: isEditing ? "Xác nhận cập nhật" : "Xác nhận thêm kho",
      message: isEditing
        ? `Bạn có chắc chắn muốn cập nhật kho "${formData.name}" không?`
        : `Bạn có chắc chắn muốn thêm kho "${formData.name}" không?`,
      onConfirm: async () => {
        try {
          await crud.handleSave(formData);
          showDialog({
            mode: "success",
            title: "Thành công",
            message: isEditing
              ? "Cập nhật kho thành công!"
              : "Thêm kho mới thành công!",
            onClose: closeDialog,
          });
        } catch (err) {
          console.error(err);
          showDialog({
            mode: "error",
            title: "Lỗi",
            message: "Không thể lưu kho.",
            onClose: closeDialog,
          });
        }
      },
      onClose: closeDialog,
    });
  };

  const handleDelete = (row) => {
    showDialog({
      mode: "confirm",
      title: "Xác nhận xóa",
      message: `Bạn có chắc chắn muốn xóa kho "${row.name}" không?`,
      onConfirm: async () => {
        try {
          await crud.handleDelete(row.id);
          showDialog({
            mode: "success",
            title: "Thành công",
            message: "Xóa kho thành công!",
            onClose: closeDialog,
          });
        } catch (err) {
          console.error(err);
          showDialog({
            mode: "error",
            title: "Lỗi",
            message: "Không thể xóa kho.",
            onClose: closeDialog,
          });
        }
      },
      onClose: closeDialog,
    });
  };

  // --- Loading / Error ---
  if (isLoading)
    return <div className="p-6 text-center text-gray-600">Đang tải...</div>;
  if (createMutation.isError || updateMutation.isError || deleteMutation.isError)
    return (
      <div className="p-6 text-center text-red-500">
        Có lỗi xảy ra khi tải dữ liệu kho.
      </div>
    );

  // --- UI ---
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
          onSave={handleSave}
          onClose={crud.handleCloseForm}
          errors={crud.errors}
        />
      )}

      {/* Dialog */}
      <DynamicDialog {...dialog} />
    </div>
  );
};

export default memo(WarehouseManagement);
