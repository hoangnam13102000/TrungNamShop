import { FaEye, FaSyncAlt } from "react-icons/fa";
import AdminListTable from "../../../components/common/AdminListTable";
import DynamicForm from "../../../components/formAndDialog/DynamicForm";
import useAdminCrud from "../../../utils/hooks/useAdminCrud1";

const initialOrders = [
  {
    id: 1,
    code: "DH001",
    name: "Nguyễn Văn A",
    phone: "0918123456",
    address: "Quận 1, TP.HCM",
    status: "shipping",
    total: "3.200.000₫",
  },
  {
    id: 2,
    code: "DH002",
    name: "Trần Thị B",
    phone: "0987654321",
    address: "Quận 5, TP.HCM",
    status: "pending",
    total: "5.100.000₫",
  },
];

const statusLabels = {
  pending: "Chờ xác nhận",
  processing: "Đang xử lý",
  shipping: "Đang giao",
  completed: "Hoàn thành",
  canceled: "Đã hủy",
};

export default function OrderManagement() {
  const {
    items:
    filteredItems,
    showForm,
    viewMode,
    selectedItem,
    search,
    setSearch,
    handleView,
    handleUpdateStatus,
    handleSaveStatus,
    handleCloseModal,
  } = useAdminCrud(initialOrders);

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Quản lý đơn hàng</h1>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between mb-4 gap-3">
        <input
          type="text"
          placeholder="Tìm kiếm đơn hàng..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-72 focus:ring-2 focus:ring-red-500"
        />
      </div>

      {/* Orders Table */}
      <AdminListTable
        columns={[
          { field: "code", label: "Mã đơn" },
          { field: "name", label: "Người nhận" },
          { field: "phone", label: "SĐT" },
          { field: "address", label: "Địa chỉ" },
          { field: "total", label: "Tổng tiền" },
          {
            field: "status",
            label: "Trạng thái",
            render: (value) => {
              const colors = {
                pending: "bg-yellow-100 text-yellow-800",
                processing: "bg-blue-100 text-blue-800",
                shipping: "bg-purple-100 text-purple-800",
                completed: "bg-green-100 text-green-800",
                canceled: "bg-red-100 text-red-800",
              };
              return (
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    colors[value] || "bg-gray-100 text-gray-800"
                  }`}
                >
                  {statusLabels[value] || value}
                </span>
              );
            },
          },
        ]}
        data={filteredItems}
        actions={[
          { icon: <FaEye />, label: "Xem", onClick: handleView },
          { icon: <FaSyncAlt />, label: "Cập nhật", onClick: handleUpdateStatus },
        ]}
      />

      {/* Modal Form View and Update */}
      {showForm && (
        <DynamicForm
          mode={viewMode ? "view" : "edit"}
          title={
            viewMode
              ? `Chi tiết đơn hàng - ${selectedItem?.code}`
              : `Cập nhật trạng thái - ${selectedItem?.code}`
          }
          fields={
            viewMode
              ? [
                  { name: "code", label: "Mã đơn", type: "text" },
                  { name: "name", label: "Người nhận", type: "text" },
                  { name: "phone", label: "SĐT", type: "text" },
                  { name: "address", label: "Địa chỉ", type: "text" },
                  { name: "total", label: "Tổng tiền", type: "text" },
                  {
                    name: "status",
                    label: "Trạng thái",
                    type: "text",
                    render: (value) => statusLabels[value] || value,
                  },
                ]
              : [
                  {
                    name: "status",
                    label: "Trạng thái đơn hàng",
                    type: "select",
                    options: Object.keys(statusLabels).map((key) => ({
                      label: statusLabels[key],
                      value: key,
                    })),
                    required: true,
                  },
                ]
          }
          initialData={selectedItem}
          onSave={handleSaveStatus}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
