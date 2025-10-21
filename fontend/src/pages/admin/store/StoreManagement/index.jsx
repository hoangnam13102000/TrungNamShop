import { memo, useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import AdminListTable from "../../../../components/common/AdminListTable";
import DynamicForm from "../../../../components/formAndDialog/DynamicForm";
import DynamicDialog from "../../../../components/formAndDialog/DynamicDialog";
import useAdminCrud from "../../../../utils/useAdminCrud1";
import {
  useStores,
  useCreateStore,
  useUpdateStore,
  useDeleteStore,
} from "../../../../api/stores";

const StoreManagement = () => {
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
  const { data: stores = [], isLoading } = useStores();
  const createMutation = useCreateStore();
  const updateMutation = useUpdateStore();
  const deleteMutation = useDeleteStore();

  const crud = useAdminCrud(
    {
      create: createMutation.mutateAsync,
      update: async (id, data) => updateMutation.mutateAsync({ id, data }),
      delete: async (id) => deleteMutation.mutateAsync(id),
    },
    "stores"
  );

  // --- Search/filter ---
  const [search, setSearch] = useState("");
  const filteredItems = stores.filter((s) =>
    (s.name || "").toLowerCase().includes(search.toLowerCase().trim())
  );

  // --- Handlers ---
  const handleSave = async (formData) => {
    const isEditing = Boolean(crud.selectedItem);
    showDialog({
      mode: "confirm",
      title: isEditing ? "Xác nhận cập nhật" : "Xác nhận thêm cửa hàng",
      message: isEditing
        ? `Bạn có chắc chắn muốn cập nhật cửa hàng "${formData.name}" không?`
        : `Bạn có chắc chắn muốn thêm cửa hàng "${formData.name}" không?`,
      onConfirm: async () => {
        try {
          await crud.handleSave(formData);
          showDialog({
            mode: "success",
            title: "Thành công",
            message: isEditing
              ? "Cập nhật cửa hàng thành công!"
              : "Thêm cửa hàng thành công!",
            onClose: closeDialog,
          });
        } catch (err) {
          console.error(err);
          showDialog({
            mode: "error",
            title: "Lỗi",
            message: "Không thể lưu cửa hàng.",
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
      message: `Bạn có chắc chắn muốn xóa cửa hàng "${row.name}" không?`,
      onConfirm: async () => {
        try {
          await crud.handleDelete(row.id);
          showDialog({
            mode: "success",
            title: "Thành công",
            message: "Xóa cửa hàng thành công!",
            onClose: closeDialog,
          });
        } catch (err) {
          console.error(err);
          showDialog({
            mode: "error",
            title: "Lỗi",
            message: "Không thể xóa cửa hàng.",
            onClose: closeDialog,
          });
        }
      },
      onClose: closeDialog,
    });
  };

  // --- Loading / error ---
  if (isLoading)
    return <div className="p-6 text-center text-gray-600">Đang tải...</div>;
  if (createMutation.isError || updateMutation.isError || deleteMutation.isError)
    return (
      <div className="p-6 text-center text-red-500">
        Có lỗi xảy ra khi tải dữ liệu cửa hàng.
      </div>
    );

  // --- UI ---
  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Quản lý cửa hàng</h1>

      {/* Toolbar */}
      <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-3 mb-6">
        <button
          onClick={crud.handleAdd}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition w-full sm:w-auto"
        >
          <FaPlus /> Thêm cửa hàng
        </button>
        <input
          type="text"
          placeholder="Tìm kiếm cửa hàng..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-72 focus:ring-2 focus:ring-red-500"
        />
      </div>

      {/* Table */}
      <AdminListTable
        columns={[
          { field: "name", label: "Tên cửa hàng" },
          { field: "address", label: "Địa chỉ" },
          { field: "email", label: "Email" },
          { field: "phone", label: "Số điện thoại" },
          
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
          title={crud.mode === "edit" ? "Sửa cửa hàng" : "Thêm cửa hàng"}
          fields={[
            { name: "name", label: "Tên cửa hàng", type: "text", required: true },
            { name: "address", label: "Địa chỉ", type: "textarea", required: true },
            { name: "email", label: "Email", type: "email" },
            { name: "phone", label: "Số điện thoại", type: "text" },
            { name: "google_map", label: "Link Google Map", type: "text" },
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

export default memo(StoreManagement);
