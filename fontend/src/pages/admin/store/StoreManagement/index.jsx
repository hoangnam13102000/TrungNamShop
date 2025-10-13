import { memo } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import AdminListTable from "../../../../components/common/AdminListTable";
import DynamicForm from "../../../../components/DynamicForm";
import useAdminCrud from "../../../../utils/useAdminCrud";
import {
  createStoreAPI,
  updateStoreAPI,
  deleteStoreAPI,
  getStoresAPI,
} from "../../../../api/stores/request";

const StoreManagement = () => {
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
    hooks: {
      beforeSave: async (data, editingItem) => {
        if (!editingItem) {
          return window.confirm(`Bạn có chắc chắn muốn thêm cửa hàng "${data.name}" không?`);
        }
        return true;
      },
    },
  });

  const onSave = async (formData) => {
    const success = await handleSave(formData);
    if (success) await fetchData();
  };

  const onDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa cửa hàng này?")) {
      const success = await handleDelete(id);
      if (success) await fetchData();
    }
  };

  if (loading)
    return <div className="p-6 text-center text-gray-600">Đang tải...</div>;
  if (error)
    return <div className="p-6 text-center text-red-500">Không thể tải dữ liệu.</div>;

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Quản lý cửa hàng</h1>

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
          { icon: <FaTrash />, label: "Xóa", onClick: (row) => onDelete(row.id) },
        ]}
      />

      {showForm && (
        <DynamicForm
          title={editingItem ? "Sửa cửa hàng" : "Thêm cửa hàng"}
          fields={[
            { name: "name", label: "Tên cửa hàng", type: "text", required: true },
            { name: "address", label: "Địa chỉ cửa hàng", type: "textarea", required: true },
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
    </div>
  );
};

export default memo(StoreManagement);
