import { memo, useState, useCallback, useMemo } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import AdminListTable from "../../../components/common/AdminListTable";
import DynamicForm from "../../../components/formAndDialog/DynamicForm";
import DynamicDialog from "../../../components/formAndDialog/DynamicDialog";
import useAdminCrud from "../../../utils/hooks/useAdminCrud1";
import { useCRUDApi } from "../../../api/hooks/useCRUDApi";
import Pagination from "../../../components/common/Pagination";

const OrderManagement = () => {
  /** ==========================
   * 1. CRUDApi
   * ========================== */
  const orderAPI = useCRUDApi("orders");
  const { data: orders = [], isLoading, refetch } = orderAPI.useGetAll();
  const createMutation = orderAPI.useCreate();
  const updateMutation = orderAPI.useUpdate();
  const deleteMutation = orderAPI.useDelete();

  const crud = useAdminCrud(
    {
      create: createMutation.mutateAsync,
      update: async (id, data) => updateMutation.mutateAsync({ id, data }),
      delete: async (id) => deleteMutation.mutateAsync(id),
    },
    "orders"
  );

  /** ==========================
   * 2. Search & Dialog
   * ========================== */
  const [search, setSearch] = useState("");
  const [dialog, setDialog] = useState({
    open: false,
    mode: "alert",
    title: "",
    message: "",
    onConfirm: null,
  });

  const showDialog = useCallback((mode, title, message, onConfirm = null) => {
    setDialog({ open: true, mode, title, message, onConfirm });
  }, []);

  const closeDialog = useCallback(() => {
    setDialog((prev) => ({ ...prev, open: false }));
  }, []);

  /** ==========================
   * 3. Filter data
   * ========================== */
  const filteredItems = useMemo(() => {
    const term = search.toLowerCase().trim();
    return orders.filter(
      (o) =>
        o.order_code?.toLowerCase().includes(term) ||
        o.recipient_name?.toLowerCase().includes(term) ||
        o.recipient_phone?.includes(term) ||
        o.payment_status?.toLowerCase().includes(term) ||
        o.order_status?.toLowerCase().includes(term)
    );
  }, [orders, search]);

  /** ==========================
   * 4. Pagination
   * ========================== */
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [currentPage, filteredItems]);

  /** ==========================
   * 5. Handlers
   * ========================== */
  const handleSave = async (formData) => {
    showDialog(
      "confirm",
      crud.selectedItem ? "Xác nhận cập nhật" : "Xác nhận thêm mới",
      crud.selectedItem
        ? `Bạn có chắc chắn muốn cập nhật đơn "${formData.order_code}" không?`
        : `Bạn có chắc chắn muốn thêm đơn "${formData.order_code}" không?`,
      async () => {
        try {
          await crud.handleSave(formData);
          await refetch();
          crud.handleCloseForm();
          showDialog(
            "success",
            "Thành công",
            crud.selectedItem
              ? "Đơn hàng đã được cập nhật thành công!"
              : "Đơn hàng đã được thêm thành công!"
          );
        } catch (err) {
          console.error(err);
          showDialog("error", "Lỗi", "Không thể lưu đơn hàng!");
        }
      }
    );
  };

  const handleDelete = (item) => {
    showDialog(
      "confirm",
      "Xác nhận xoá",
      `Bạn có chắc chắn muốn xóa đơn "${item.order_code}" không?`,
      async () => {
        try {
          await crud.handleDelete(item.id);
          await refetch();
          showDialog("success", "Thành công", "Đơn hàng đã được xóa thành công!");
        } catch (err) {
          console.error(err);
          showDialog("error", "Lỗi", "Không thể xóa đơn hàng!");
        }
      }
    );
  };

  /** ==========================
   * 6. UI
   * ========================== */
  if (isLoading) return <div className="p-6 text-center text-gray-600">Đang tải...</div>;

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Quản lý đơn hàng</h1>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <button
          onClick={crud.handleAdd}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 w-full sm:w-auto"
        >
          <FaPlus /> Thêm đơn hàng
        </button>

        <input
          type="text"
          placeholder="Tìm kiếm đơn hàng..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-3 py-2 w-full sm:w-72"
        />
      </div>

      <AdminListTable
        columns={[
          { field: "order_code", label: "Mã đơn" },
          { field: "recipient_name", label: "Người nhận" },
          { field: "recipient_phone", label: "SĐT" },
          { field: "recipient_address", label: "Địa chỉ" },
          { field: "delivery_method", label: "Phương thức nhận" },
          { field: "payment_method", label: "Thanh toán" },
          {
            field: "payment_status",
            label: "Trạng thái thanh toán",
            render: (val) => (
              <span
                className={`px-2 py-1 rounded-full text-sm ${
                  val === "paid"
                    ? "bg-green-100 text-green-700"
                    : val === "unpaid"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {val === "paid"
                  ? "Đã thanh toán"
                  : val === "unpaid"
                  ? "Chưa thanh toán"
                  : "Hoàn tiền"}
              </span>
            ),
          },
          {
            field: "order_status",
            label: "Trạng thái đơn",
            render: (val) => (
              <span
                className={`px-2 py-1 rounded-full text-sm ${
                  val === "completed"
                    ? "bg-green-100 text-green-700"
                    : val === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : val === "cancelled"
                    ? "bg-red-100 text-red-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {val === "pending"
                  ? "Đang chờ"
                  : val === "processing"
                  ? "Đang xử lý"
                  : val === "shipping"
                  ? "Đang giao"
                  : val === "completed"
                  ? "Hoàn thành"
                  : "Đã hủy"}
              </span>
            ),
          },
        ]}
        data={currentItems}
        actions={[
          { icon: <FaEdit />, label: "Sửa", onClick: crud.handleEdit },
          { icon: <FaTrash />, label: "Xóa", onClick: handleDelete },
        ]}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          maxVisible={5}
        />
      )}

      {crud.openForm && (
        <DynamicForm
          title={crud.mode === "edit" ? `Sửa đơn: ${crud.selectedItem?.order_code}` : "Thêm đơn hàng"}
          fields={[
            { name: "order_code", label: "Mã đơn", type: "text", required: true },
            { name: "customer_id", label: "Khách hàng", type: "number", required: true },
            { name: "employee_id", label: "Nhân viên", type: "number" },
            { name: "discount_id", label: "Mã giảm giá", type: "number" },
            { name: "store_id", label: "Cửa hàng", type: "number" },
            { name: "recipient_name", label: "Người nhận", type: "text", required: true },
            { name: "recipient_phone", label: "SĐT", type: "text", required: true },
            { name: "recipient_address", label: "Địa chỉ", type: "text", required: true },
            {
              name: "delivery_method",
              label: "Phương thức nhận",
              type: "select",
              options: [
                { value: "pickup", label: "Nhận tại cửa hàng" },
                { value: "delivery", label: "Giao tận nơi" },
              ],
            },
            {
              name: "payment_method",
              label: "Thanh toán",
              type: "select",
              options: [
                { value: "cash", label: "Tiền mặt" },
                { value: "paypal", label: "Paypal" },
                { value: "bank_transfer", label: "Chuyển khoản" },
                { value: "momo", label: "Momo" },
              ],
            },
            {
              name: "payment_status",
              label: "Trạng thái thanh toán",
              type: "select",
              options: [
                { value: "unpaid", label: "Chưa thanh toán" },
                { value: "paid", label: "Đã thanh toán" },
                { value: "refunded", label: "Hoàn tiền" },
              ],
            },
            {
              name: "order_status",
              label: "Trạng thái đơn",
              type: "select",
              options: [
                { value: "pending", label: "Đang chờ" },
                { value: "processing", label: "Đang xử lý" },
                { value: "shipping", label: "Đang giao" },
                { value: "completed", label: "Hoàn thành" },
                { value: "cancelled", label: "Đã hủy" },
              ],
            },
            { name: "note", label: "Ghi chú", type: "textarea" },
            { name: "delivery_date", label: "Ngày giao", type: "date" },
            { name: "order_date", label: "Ngày đặt", type: "date" },
          ]}
          initialData={crud.selectedItem}
          onSave={handleSave}
          onClose={crud.handleCloseForm}
        />
      )}

      <DynamicDialog
        open={dialog.open}
        mode={dialog.mode}
        title={dialog.title}
        message={dialog.message}
        onClose={closeDialog}
        onConfirm={async () => {
          setDialog((prev) => ({ ...prev, open: false }));
          if (dialog.onConfirm) await dialog.onConfirm();
        }}
      />
    </div>
  );
};

export default memo(OrderManagement);
