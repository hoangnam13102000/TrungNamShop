import { memo } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import AdminListTable from "../../../../components/common/AdminListTable";
import DynamicForm from "../../../../components/DynamicForm";
import useAdminCrud from "../../../../utils/useAdminCrud";
import {
  getPromotionsAPI,
  createPromotionAPI,
  updatePromotionAPI,
  deletePromotionAPI,
} from "../../../../api/product/promotion/request";

const PromotionManagement = () => {
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
      fetch: getPromotionsAPI,
      create: createPromotionAPI,
      update: updatePromotionAPI,
      delete: deletePromotionAPI,
    },
    rules: {
      name: { required: true, message: "Tên khuyến mãi là bắt buộc" },
      start_date: { required: true, message: "Ngày bắt đầu là bắt buộc" },
      end_date: { required: true, message: "Ngày kết thúc là bắt buộc" },
    },
    hooks: {
      beforeSave: async (data) => {
        // Kiểm tra logic ngày tháng
        if (new Date(data.start_date) > new Date(data.end_date)) {
          alert("Ngày bắt đầu không được sau ngày kết thúc!");
          return false;
        }

        // Xác nhận thêm/sửa
        return window.confirm("Bạn có chắc chắn muốn lưu khuyến mãi này?");
      },
    },
  });

  // Lưu form
  const onSave = async (formData) => {
    const success = await handleSave(formData);
    if (success) await fetchData();
  };

  // Xóa
  const onDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa khuyến mãi này?")) {
      const success = await handleDelete(id);
      if (success) await fetchData();
    }
  };

  // Loading / Error
  if (loading)
    return <div className="p-6 text-center text-gray-600">Đang tải...</div>;
  if (error)
    return (
      <div className="p-6 text-center text-red-500">
        Không thể tải dữ liệu khuyến mãi.
      </div>
    );

  // Giao diện chính
  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Quản lý khuyến mãi</h1>

      {/* Thanh công cụ */}
      <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-3 mb-6">
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition w-full sm:w-auto"
        >
          <FaPlus /> Thêm khuyến mãi
        </button>

        <input
          type="text"
          placeholder="Tìm kiếm khuyến mãi..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      {/* Bảng danh sách */}
      <AdminListTable
        columns={[
          { field: "name", label: "Tên khuyến mãi" },
          { field: "start_date", label: "Ngày bắt đầu" },
          { field: "end_date", label: "Ngày kết thúc" },
          { field: "description", label: "Mô tả" },
        ]}
        data={filteredItems}
        actions={[
          { icon: <FaEdit />, label: "Sửa", onClick: handleEdit },
          { icon: <FaTrash />, label: "Xóa", onClick: (row) => onDelete(row.id) },
        ]}
      />

      {/* Form thêm/sửa */}
      {showForm && (
        <DynamicForm
          title={editingItem ? "Sửa khuyến mãi" : "Thêm khuyến mãi"}
          fields={[
            { name: "name", label: "Tên khuyến mãi", type: "text", required: true },
            { name: "description", label: "Mô tả", type: "textarea" },
            { name: "start_date", label: "Ngày bắt đầu", type: "date", required: true },
            { name: "end_date", label: "Ngày kết thúc", type: "date", required: true },
          ]}
          initialData={
            editingItem
              ? {
                  ...editingItem,
                  start_date: editingItem.start_date?.split("T")[0],
                  end_date: editingItem.end_date?.split("T")[0],
                }
              : null
          }
          onSave={onSave}
          onClose={handleCloseModal}
          errors={errors}
        />
      )}
    </div>
  );
};

export default memo(PromotionManagement);
