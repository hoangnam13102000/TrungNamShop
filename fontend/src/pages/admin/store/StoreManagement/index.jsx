import { memo, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import AdminListTable from "../../../../components/common/AdminListTable";
import DynamicForm from "../../../../components/DynamicForm";
import useAdminCrud from "../../../../utils/useAdminCrud";
import useGetStores from "../../../../api/homePage/queries";
import { createStoreAPI, updateStoreAPI, deleteStoreAPI } from "../../../../api/homePage/request";

const StoreManagement = () => {
  const { data: stores, isLoading, isError, refetch } = useGetStores();

  const {
    filteredItems,
    setItems,
    search,
    setSearch,
    showForm,
    editingItem,
    handleAdd,
    handleEdit,
    handleCloseModal,
    setShowForm,
    setEditingItem,
  } = useAdminCrud([]);

  useEffect(() => {
    if (stores) setItems(stores);
  }, [stores, setItems]);

  const handleSave = async (formData) => {
    try {
      if (editingItem) {
        await updateStoreAPI(editingItem.id, formData);
      } else {
        await createStoreAPI(formData);
      }
      await refetch();
      setShowForm(false);
      setEditingItem(null);
    } catch (error) {
      console.error("Lỗi lưu cửa hàng:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa cửa hàng này?")) {
      try {
        await deleteStoreAPI(id);
        await refetch();
      } catch (error) {
        console.error("Lỗi khi xóa cửa hàng:", error);
      }
    }
  };

  if (isLoading) return <div className="p-6 text-center text-gray-600">Đang tải...</div>;
  if (isError) return <div className="p-6 text-center text-red-500">Không thể tải dữ liệu.</div>;

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
          { icon: <FaTrash />, label: "Xóa", onClick: (row) => handleDelete(row.id) },
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
          ]}
          initialData={editingItem}
          onSave={handleSave}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default memo(StoreManagement);
