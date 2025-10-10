import { memo } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import AdminListTable from "../../../../components/common/AdminListTable";
import DynamicForm from "../../../../components/DynamicForm";
import useAdminCrud from "../../../../utils/useAdminCrud";

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
  } = useAdminCrud([
    {
      id: 1,
      name: "Cửa hàng 65",
      address: "65 D. Huỳnh Thúc Kháng, Bến Nghé, Quận 1, TP. Hồ Chí Minh, Việt Nam",
    },
  ]);

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6"> Quản lý cửa hàng</h1>
      <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-3 mb-6">
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition w-full sm:w-auto"
        >
          <FaPlus /> Thêm cửa hàng
        </button>
        <input
          type="text"
          placeholder=" Tìm kiếm cửa hàng..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      {/* Store Table*/}
      <AdminListTable
        columns={[
          { field: "name", label: "Tên cửa hàng" },
          { field: "address", label: "Địa chỉ cửa hàng" },
        ]}
        data={filteredItems}
        actions={[
          { icon: <FaEdit />, label: "Sửa", onClick: handleEdit },
          { icon: <FaTrash />, label: "Xóa", onClick: (row) => handleDelete(row.id) },
        ]}
      />

      {/* Form Add & Edit */}
      {showForm && (
        <DynamicForm
          title={editingItem ? " Sửa cửa hàng" : " Thêm cửa hàng"}
          fields={[
            { name: "name", label: "Tên cửa hàng", type: "text", required: true },
            { name: "address", label: "Địa chỉ cửa hàng", type: "textarea", required: true },
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
