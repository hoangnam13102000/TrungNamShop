import { useEffect, useState } from "react";
import useAdminCrud from "../../../../utils/useAdminCrud";
import { FaTrash, FaEdit } from "react-icons/fa";
import AdminListTable from "../../../../components/common/AdminListTable";
import DynamicForm from "../../../../components/formAndDialog/DynamicForm";
import {
  getCustomersAPI,
  deleteCustomerAPI,
} from "../../../../api/customer/request";

export default function CustomerManagement() {
  const [initialCustomers, setInitialCustomers] = useState([]);

  const {
    filteredItems: customers,
    editingItem,
    showForm,
    search,
    setSearch,
    handleEdit,
    handleCloseModal,
    setItems,
  } = useAdminCrud(initialCustomers);

  // Fetch customers
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await getCustomersAPI();

        // Lọc bỏ khách hàng nếu cần
        const filtered = res.filter(
          (customer) =>
            customer?.account?.account_type?.account_type_name !== "Khách hàng"
        );

        setInitialCustomers(filtered);
        setItems(filtered);
      } catch (error) {
        console.error("Fetch customers failed:", error);
      }
    };
    fetchCustomers();
  }, [setItems]);

  // Delete customer
  const handleDeleteWithAPI = async (item) => {
    if (!confirm(`Bạn có chắc muốn xóa ${item.full_name}?`)) return;
    try {
      await deleteCustomerAPI(item.id);
      setItems(customers.filter((c) => c.id !== item.id));
    } catch (error) {
      console.error("Delete customer failed:", error);
    }
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Quản lý nhân viên</h1>

      {/* Thanh tìm kiếm */}
      <div className="flex justify-end mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm người dùng..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-72 focus:ring-2 focus:ring-red-500"
        />
      </div>

      {/* Bảng dữ liệu */}
      <AdminListTable
        columns={[
          { field: "account.username", label: "Username" },
          { field: "full_name", label: "Họ tên" },
          { field: "phone_number", label: "SĐT" },
          { field: "email", label: "Email" },
          { field: "address", label: "Địa chỉ" },
          {
            field: "gender",
            label: "Giới tính",
            render: (value) => {
              if (value === "male") return "Nam";
              if (value === "female") return "Nữ";
              return "Không xác định";
            },
          },
          {
            field: "account.account_type",
            label: "Loại tài khoản",
            render: (type) => type || "Không có thông tin",
          },
        ]}
        data={customers}
        actions={[
          { icon: <FaEdit />, label: "Sửa", onClick: handleEdit },
          { icon: <FaTrash />, label: "Xoá", onClick: handleDeleteWithAPI },
        ]}
      />

      {/* Form chỉnh sửa */}
      {showForm && editingItem && (
        <DynamicForm
          mode="edit"
          title={`Chỉnh sửa người dùng - ${editingItem.full_name}`}
          fields={[
            {
              name: "username",
              label: "Username",
              type: "text",
              disabled: true, // ❌ Không cho sửa username
              displayValue: editingItem.account?.username || "Không có",
            },
            { name: "full_name", label: "Họ tên", type: "text", required: true },
            { name: "phone_number", label: "SĐT", type: "text", required: true },
            { name: "email", label: "Email", type: "email", required: true },
            { name: "address", label: "Địa chỉ", type: "text" },
            {
              name: "gender",
              label: "Giới tính",
              type: "select",
              options: [
                { label: "Nam", value: "male" },
                { label: "Nữ", value: "female" },
                { label: "Không xác định", value: null },
              ],
              value: editingItem.gender || null,
              required: true,
            },
          ]}
          initialData={{
            ...editingItem,
            username: editingItem.account?.username || "",
          }}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
