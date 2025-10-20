import { useEffect, useState } from "react";
import useAdminCrud from "../../../../utils/useAdminCrud";
import { FaTrash, FaEdit } from "react-icons/fa";
import AdminListTable from "../../../../components/common/AdminListTable";
import DynamicForm from "../../../../components/formAndDialog/DynamicForm";
import DynamicDialog from "../../../../components/formAndDialog/DynamicDialog";
import {
  getCustomersAPI,
  deleteCustomerAPI,
  updateCustomerAPI,
} from "../../../../api/customer/request";

export default function CustomerManagement() {
  const [initialCustomers, setInitialCustomers] = useState([]);
  const [dialog, setDialog] = useState({
    open: false,
    mode: "alert", // alert | confirm | success | error
    title: "",
    message: "",
    onConfirm: null,
  });

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

  // --- Tải danh sách khách hàng ---
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await getCustomersAPI();
        const customersWithUsername = res.map((c) => ({
          ...c,
          username: c?.account?.username || "Không có username",
        }));
        setInitialCustomers(customersWithUsername);
        setItems(customersWithUsername);
      } catch (error) {
        console.error("Fetch customers failed:", error);
        showDialog("error", "Lỗi", "Không thể tải danh sách khách hàng.");
      }
    };
    fetchCustomers();
  }, [setItems]);

  // --- Hàm mở dialog ---
  const showDialog = (mode, title, message, onConfirm = null) => {
    setDialog({ open: true, mode, title, message, onConfirm });
  };

  // --- Đóng dialog ---
  const closeDialog = () => setDialog((prev) => ({ ...prev, open: false }));

  // --- Xoá khách hàng ---
  const handleDeleteWithAPI = (item) => {
    showDialog(
      "confirm",
      "Xác nhận xoá",
      `Bạn có chắc muốn xoá khách hàng "${item.full_name}" không?`,
      async () => {
        try {
          await deleteCustomerAPI(item.id);
          setItems((prev) => prev.filter((c) => c.id !== item.id));
          showDialog("success", "Thành công", "Xoá khách hàng thành công!");
        } catch (error) {
          console.error("Delete customer failed:", error);
          showDialog("error", "Lỗi", "Xoá khách hàng thất bại. Vui lòng thử lại.");
        }
      }
    );
  };

  // --- Sửa khách hàng ---
  const handleEditWithUsername = (item) => {
    const itemWithUsername = {
      ...item,
      username: item?.username || item?.account?.username || "",
    };
    handleEdit(itemWithUsername);
  };

  // --- Lưu khách hàng ---
  const handleSaveCustomer = (updatedData) => {
    showDialog(
      "confirm",
      "Xác nhận lưu",
      "Bạn có chắc chắn muốn lưu thông tin thay đổi này?",
      async () => {
        try {
          await updateCustomerAPI(updatedData.id, {
            full_name: updatedData.full_name,
            phone_number: updatedData.phone_number,
            email: updatedData.email,
            address: updatedData.address,
            gender: updatedData.gender,
          });

          setItems((prev) =>
            prev.map((c) =>
              c.id === updatedData.id ? { ...c, ...updatedData } : c
            )
          );

          handleCloseModal();
          showDialog("success", "Thành công", "Cập nhật khách hàng thành công!");
        } catch (error) {
          console.error("Save customer failed:", error);
          showDialog("error", "Lỗi", "Cập nhật thất bại. Vui lòng thử lại.");
        }
      }
    );
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Quản lý khách hàng</h1>

      {/* --- Thanh tìm kiếm --- */}
      <div className="flex justify-end mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm khách hàng..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-72 focus:ring-2 focus:ring-red-500"
        />
      </div>

      {/* --- Bảng danh sách khách hàng --- */}
      <AdminListTable
        columns={[
          { field: "username", label: "Username" },
          { field: "full_name", label: "Họ tên" },
          { field: "phone_number", label: "SĐT" },
          { field: "email", label: "Email" },
          { field: "address", label: "Địa chỉ" },
          {
            field: "gender",
            label: "Giới tính",
            render: (value) =>
              value === "male"
                ? "Nam"
                : value === "female"
                ? "Nữ"
                : "Không xác định",
          },
        ]}
        data={customers}
        actions={[
          { icon: <FaEdit />, label: "Sửa", onClick: handleEditWithUsername },
          { icon: <FaTrash />, label: "Xoá", onClick: handleDeleteWithAPI },
        ]}
      />

      {/* --- Form chỉnh sửa khách hàng --- */}
      {showForm && editingItem && (
        <DynamicForm
          mode="edit"
          title={`Chỉnh sửa khách hàng - ${editingItem.full_name}`}
          fields={[
            { name: "username", label: "Username", type: "text", disabled: true },
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
          initialData={editingItem}
          onSave={handleSaveCustomer}
          onClose={handleCloseModal}
        />
      )}

      {/* --- Dynamic Dialog --- */}
      <DynamicDialog
        open={dialog.open}
        mode={dialog.mode}
        title={dialog.title}
        message={dialog.message}
        onClose={closeDialog}
        onConfirm={dialog.onConfirm}
      />
    </div>
  );
}
