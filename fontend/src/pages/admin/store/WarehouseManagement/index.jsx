import { memo } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import AdminListTable from "../../../../components/common/AdminListTable";
import DynamicForm from "../../../../components/formAndDialog/DynamicForm";
import useAdminCrud from "../../../../utils/useAdminCrud";
import { createWarehouseAPI, getWarehousesAPI, updateWarehouseAPI, deleteWarehouseAPI } from "../../../../api/warehouse/request";

const WarehouseManagement = () => {
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
      fetch: getWarehousesAPI,
      create: createWarehouseAPI,
      update: updateWarehouseAPI,
      delete: deleteWarehouseAPI,
    },
    rules: {
      name: { required: true, message: "Tên kho là bắt buộc" },
      address: { required: true, message: "Địa chỉ là bắt buộc" },
      note: { required: false },
    },
    hooks: {
      beforeSave: async (data, editingItem) => {
        if (!editingItem) {
          return window.confirm(`Bạn có chắc chắn muốn thêm kho "${data.name}" không?`);
        }
        return true;
      },
    },
  });

  const onSave = async (formData) => {
    const success = await handleSave(formData);
    if (success) await fetchData(); // reload dữ liệu từ server
  };

  const onDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa kho này?")) {
      const success = await handleDelete(id);
      if (success) await fetchData();
    }
  };

  if (loading) return <div className="p-6 text-center text-gray-600">Đang tải...</div>;
  if (error) return <div className="p-6 text-center text-red-500">Không thể tải dữ liệu.</div>;

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Quản lý kho hàng</h1>

      <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-3 mb-6">
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition w-full sm:w-auto"
        >
          <FaPlus /> Thêm kho hàng
        </button>

        <input
          type="text"
          placeholder="Tìm kiếm kho..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      <AdminListTable
        columns={[
          { field: "name", label: "Tên kho" },
          { field: "address", label: "Địa chỉ kho" },
          { field: "note", label: "Ghi chú" },
        ]}
        data={filteredItems}
        actions={[
          { icon: <FaEdit />, label: "Sửa", onClick: handleEdit },
          { icon: <FaTrash />, label: "Xóa", onClick: (row) => onDelete(row.id) },
        ]}
      />

      {showForm && (
        <DynamicForm
          title={editingItem ? "Sửa kho hàng" : "Thêm kho hàng"}
          fields={[
            { name: "name", label: "Tên kho", type: "text", required: true },
            { name: "address", label: "Địa chỉ kho", type: "textarea", required: true },
            { name: "note", label: "Ghi chú", type: "textarea" },
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

export default memo(WarehouseManagement);
