import { memo, useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import AdminListTable from "../../../../components/common/AdminListTable";
import DynamicForm from "../../../../components/formAndDialog/DynamicForm";
import DynamicDialog from "../../../../components/formAndDialog/DynamicDialog";
import useAdminCrud from "../../../../utils/useAdminCrud";
import {
  createStoreAPI,
  updateStoreAPI,
  deleteStoreAPI,
  getStoresAPI,
} from "../../../../api/stores/request";

const StoreManagement = () => {
  const [dialog, setDialog] = useState({
    open: false,
    mode: "confirm",
    title: "",
    message: "",
    onConfirm: null,
  });

  // --- CRUD logic ---
  const {
    filteredItems,
    search,
    setSearch,
    showForm,
    editingItem,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSave,
    handleCloseModal,
    loading,
    error,
    errors,
    fetchData,
  } = useAdminCrud([], {
    api: {
      fetch: getStoresAPI,
      create: createStoreAPI,
      update: updateStoreAPI,
      delete: deleteStoreAPI,
    },
    rules: {
      name: { required: true, message: "Tên cửa hàng là bắt buộc" },
      address: { required: true },
      email: { type: "email", message: "Email không hợp lệ" },
      phone: { type: "phone", message: "Số điện thoại không hợp lệ" },
      google_map: { type: "url", message: "Link Google Map không hợp lệ" },
    },
  });

  // --- Dialog helpers ---
  const showDialog = (options) => setDialog({ open: true, ...options });
  const closeDialog = () => setDialog((d) => ({ ...d, open: false }));

  // --- Save ---
  const onSave = async (formData) => {
    const isEditing = Boolean(editingItem);

    showDialog({
      mode: "confirm",
      title: isEditing ? "Xác nhận cập nhật" : "Xác nhận thêm cửa hàng",
      message: isEditing
        ? `Bạn có chắc chắn muốn cập nhật cửa hàng "${formData.name}" không?`
        : `Bạn có chắc chắn muốn thêm cửa hàng "${formData.name}" không?`,
      onConfirm: async () => {
        const success = await handleSave(formData);
        closeDialog();

        if (success) {
          await fetchData();
          handleCloseModal();

          // ✅ Hiển thị thông báo thành công
          showDialog({
            mode: "success",
            title: "Thành công",
            message: isEditing
              ? "Cập nhật cửa hàng thành công!"
              : "Thêm cửa hàng mới thành công!",
            onClose: closeDialog,
          });
        } else {
          // ❌ Hiển thị lỗi
          showDialog({
            mode: "error",
            title: "Thất bại",
            message: "Có lỗi xảy ra khi lưu dữ liệu.",
            onClose: closeDialog,
          });
        }
      },
      onClose: closeDialog,
    });
  };

  // --- Delete ---
  const onDelete = (id, name) => {
    showDialog({
      mode: "warning",
      title: "Xác nhận xóa cửa hàng",
      message: `Bạn có chắc chắn muốn xóa cửa hàng "${name}" không?`,
      onConfirm: async () => {
        const success = await handleDelete(id);
        closeDialog();

        if (success) {
          await fetchData();
          showDialog({
            mode: "success",
            title: "Thành công",
            message: "Xóa cửa hàng thành công!",
            onClose: closeDialog,
          });
        } else {
          showDialog({
            mode: "error",
            title: "Thất bại",
            message: "Không thể xóa cửa hàng. Vui lòng thử lại.",
            onClose: closeDialog,
          });
        }
      },
      onClose: closeDialog,
    });
  };

  // --- Loading / Error state ---
  if (loading)
    return <div className="p-6 text-center text-gray-600">Đang tải...</div>;
  if (error)
    return (
      <div className="p-6 text-center text-red-500">
        Không thể tải dữ liệu cửa hàng.
      </div>
    );

  // --- Main UI ---
  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Quản lý cửa hàng</h1>

      {/* --- Toolbar --- */}
      <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-3 mb-6">
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition w-full sm:w-auto"
        >
          <FaPlus /> Thêm cửa hàng
        </button>

        <input
          type="text"
          placeholder="Tìm kiếm cửa hàng..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      {/* --- Table --- */}
      <AdminListTable
        columns={[
          { field: "name", label: "Tên cửa hàng" },
          { field: "address", label: "Địa chỉ" },
          { field: "email", label: "Email" },
          { field: "phone", label: "Số điện thoại" },
        ]}
        data={filteredItems}
        actions={[
          { icon: <FaEdit />, label: "Sửa", onClick: handleEdit },
          {
            icon: <FaTrash />,
            label: "Xóa",
            onClick: (row) => onDelete(row.id, row.name),
          },
        ]}
      />

      {/* --- Form Add / Edit --- */}
      {showForm && (
        <DynamicForm
          title={editingItem ? "Sửa cửa hàng" : "Thêm cửa hàng"}
          fields={[
            { name: "name", label: "Tên cửa hàng", type: "text", required: true },
            {
              name: "address",
              label: "Địa chỉ cửa hàng",
              type: "textarea",
              required: true,
            },
            { name: "email", label: "Email", type: "email" },
            { name: "phone", label: "Số điện thoại", type: "text" },
            { name: "google_map", label: "Link Google Map", type: "text" },
          ]}
          initialData={editingItem}
          onSave={onSave}
          onClose={handleCloseModal}
          errors={errors}
        />
      )}

      {/* --- Dialog --- */}
      <DynamicDialog {...dialog} />
    </div>
  );
};

export default memo(StoreManagement);
