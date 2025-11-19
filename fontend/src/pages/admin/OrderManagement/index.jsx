import { memo, useState, useCallback, useMemo, useEffect } from "react";
import { FaEdit, FaReceipt } from "react-icons/fa";
import AdminListTable from "../../../components/common/AdminListTable";
import DynamicForm from "../../../components/formAndDialog/DynamicForm";
import DynamicDialog from "../../../components/formAndDialog/DynamicDialog";
import useAdminCrud from "../../../utils/hooks/useAdminCrud1";
import { useCRUDApi } from "../../../api/hooks/useCRUDApi";
import Pagination from "../../../components/common/Pagination";
import InvoiceModal from "../../../components/order/InvoiceModal";

const formatInitialData = (item) => {
  if (!item) return {};
  const toNumber = (val) => (val !== null && val !== undefined ? Number(val) : null);
  const formatDate = (dateStr) => (dateStr ? dateStr.split(" ")[0] : "");
  return {
    ...item,
    customer_id: toNumber(item.customer?.id || item.customer_id),
    employee_id: toNumber(item.employee?.id || item.employee_id),
    discount_id: toNumber(item.discount?.id || item.discount_id),
    store_id: toNumber(item.store?.id || item.store_id),
    delivery_date: formatDate(item.delivery_date),
    order_date: formatDate(item.order_date),
    order_status: item.order_status,
    payment_status: item.payment_status,
    delivery_method: item.delivery_method,
    payment_method: item.payment_method,
  };
};

const mapOptions = (list, labelKey = "name") =>
  list && list.length ? list.map((i) => ({ value: Number(i.id), label: i[labelKey] || "—" })) : [];
const addPlaceholder = (options, placeholder) =>
  options.length ? options : [{ value: null, label: placeholder }];

const OrderManagement = () => {
  const orderAPI = useCRUDApi("orders");
  const orderDetailAPI = useCRUDApi("order-details");
  const { data: orders = [], isLoading, refetch } = orderAPI.useGetAll();
  const createMutation = orderAPI.useCreate();
  const updateMutation = orderAPI.useUpdate();
  const deleteMutation = orderAPI.useDelete();
  const { data: allOrderDetails = [], refetch: refetchAllOrderDetails } = orderDetailAPI.useGetAll();

  const crud = useAdminCrud(
    {
      create: createMutation.mutateAsync,
      update: async (id, data) => updateMutation.mutateAsync({ id, data }),
      delete: async (id) => deleteMutation.mutateAsync(id),
    },
    "orders"
  );

  const customers = useCRUDApi("customers").useGetAll().data || [];
  const employees = useCRUDApi("employees").useGetAll().data || [];
  const discounts = useCRUDApi("discounts").useGetAll().data || [];
  const stores = useCRUDApi("stores").useGetAll().data || [];

  const customerOptions = addPlaceholder(mapOptions(customers, "full_name"), "Chưa có khách hàng nào");
  const employeeOptions = addPlaceholder(mapOptions(employees, "full_name"), "Chưa có nhân viên nào");
  const discountOptions = addPlaceholder(mapOptions(discounts, "code"), "Chưa có mã giảm giá");
  const storeOptions = addPlaceholder(mapOptions(stores, "name"), "Chưa có cửa hàng nào");

  const [invoiceModal, setInvoiceModal] = useState({ open: false, order: null });
  const [invoiceOrderDetails, setInvoiceOrderDetails] = useState([]);
  const [loadingInvoiceDetails, setLoadingInvoiceDetails] = useState(false);

  const fetchInvoiceOrderDetails = useCallback(
    async (orderId) => {
      if (!orderId) return;
      try {
        setLoadingInvoiceDetails(true);
        let filteredDetails = [];
        if (allOrderDetails && Array.isArray(allOrderDetails)) {
          filteredDetails = allOrderDetails.filter((detail) => detail.order_id === orderId);
        } else {
          const response = await fetch(`/api/order-details?order_id=${orderId}`);
          if (response.ok) filteredDetails = await response.json();
        }

        const detailsWithProducts = await Promise.all(
          filteredDetails.map(async (detail) => {
            if (!detail.product_id) return detail;
            try {
              const res = await fetch(`/api/products/${detail.product_id}`);
              if (!res.ok) return detail;
              const product = await res.json();
              return { ...detail, product };
            } catch (err) {
              console.error("Fetch product error:", err);
              return detail;
            }
          })
        );

        // console.log("Invoice details with product:", detailsWithProducts);
        setInvoiceOrderDetails(detailsWithProducts);
      } catch (err) {
        console.error("Lỗi load chi tiết đơn hóa đơn:", err);
        setInvoiceOrderDetails([]);
      } finally {
        setLoadingInvoiceDetails(false);
      }
    },
    [allOrderDetails]
  );

  const closeInvoiceModal = useCallback(() => {
    setInvoiceModal({ open: false, order: null });
    setInvoiceOrderDetails([]);
  }, []);

  const [search, setSearch] = useState("");
  const [dialog, setDialog] = useState({ open: false, mode: "alert", title: "", message: "", onConfirm: null });

  const showDialog = useCallback((mode, title, message, onConfirm = null) => {
    setDialog({ open: true, mode, title, message, onConfirm });
  }, []);
  const closeDialog = useCallback(() => setDialog((prev) => ({ ...prev, open: false })), []);

  const filteredItems = useMemo(() => {
    const term = search.toLowerCase().trim();
    return orders.filter(
      (o) =>
        o.order_code?.toLowerCase().includes(term) ||
        o.recipient_name?.toLowerCase().includes(term) ||
        o.recipient_phone?.includes(term)
    );
  }, [orders, search]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [currentPage, filteredItems]);

  const handleSave = useCallback(
    async (formData) => {
      showDialog(
        "confirm",
        crud.selectedItem ? "Xác nhận cập nhật" : "Xác nhận thêm mới",
        crud.selectedItem
          ? `Bạn có chắc muốn cập nhật đơn "${formData.order_code}" không?`
          : `Bạn có chắc muốn thêm đơn "${formData.order_code}" không?`,
        async () => {
          try {
            await crud.handleSave(formData);
            await refetch();
            crud.handleCloseForm();
            showDialog(
              "success",
              "Thành công",
              crud.selectedItem ? "Đơn hàng đã được cập nhật!" : "Đơn hàng đã được thêm!"
            );
          } catch (err) {
            console.error(err);
            showDialog("error", "Lỗi", "Không thể lưu đơn hàng!");
          }
        }
      );
    },
    [crud, refetch, showDialog]
  );

  useEffect(() => {
    refetchAllOrderDetails();
  }, [refetchAllOrderDetails]);

  if (isLoading) return <div className="p-4 md:p-8 text-center text-gray-600">Đang tải...</div>;

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="mb-4 md:mb-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Quản lý đơn hàng</h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">Quản lý và theo dõi các đơn hàng</p>
      </div>

      <div className="mb-4 md:mb-6 bg-white p-3 sm:p-4 rounded-lg shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <input
            type="text"
            placeholder="Tìm kiếm đơn hàng..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-3 sm:px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
          <button
            onClick={crud.handleOpenForm}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold text-sm hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm whitespace-nowrap"
          >
            + Thêm đơn
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {currentItems.length === 0 ? (
          <div className="p-6 sm:p-8 text-center text-gray-500">
            <p className="text-sm sm:text-base">Không có dữ liệu đơn hàng</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <AdminListTable
                columns={[
                  { field: "order_code", label: "Mã đơn" },
                  { field: "recipient_name", label: "Người nhận" },
                  { field: "recipient_phone", label: "SĐT" },
                  { field: "recipient_address", label: "Địa chỉ" },
                  { field: "order_status_label", label: "Trạng thái đơn" },
                  { field: "payment_status_label", label: "Thanh toán" },
                  { field: "delivery_method_label", label: "Vận chuyển" },
                  { field: "payment_method_label", label: "PP thanh toán" },
                ]}
                data={currentItems}
                actions={[
                  { icon: <FaEdit />, label: "Sửa", onClick: crud.handleEdit },
                  {
                    icon: <FaReceipt />,
                    label: "Xem hóa đơn",
                    onClick: (order) => {
                      setInvoiceModal({ open: true, order });
                      fetchInvoiceOrderDetails(order.id);
                    },
                  },
                ]}
              />
            </div>

            {totalPages > 1 && (
              <div className="px-3 sm:px-4 md:px-6 py-4 border-t border-gray-200 bg-gray-50">
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} maxVisible={5} />
              </div>
            )}
          </>
        )}
      </div>

      {crud.openForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-start pt-4 sm:pt-8 md:pt-10 z-50 overflow-y-auto p-3 sm:p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 w-full max-w-2xl sm:max-w-3xl my-4">
            <DynamicForm
              title={crud.mode === "edit" ? `Sửa đơn: ${crud.selectedItem?.order_code}` : "Thêm đơn hàng mới"}
              fields={[
                { name: "order_code", label: "Mã đơn", type: "text", required: true },
                { name: "customer_id", label: "Khách hàng", type: "select", required: true, options: customerOptions },
                { name: "employee_id", label: "Nhân viên", type: "select", options: employeeOptions },
                { name: "discount_id", label: "Mã giảm giá", type: "select", options: discountOptions },
                { name: "store_id", label: "Cửa hàng", type: "select", options: storeOptions },
                { name: "recipient_name", label: "Người nhận", type: "text", required: true },
                { name: "recipient_phone", label: "SĐT", type: "text", required: true },
                { name: "recipient_address", label: "Địa chỉ", type: "text", required: true },
                {
                  name: "delivery_method",
                  label: "Phương thức vận chuyển",
                  type: "select",
                  options: [
                    { value: "pickup", label: "Nhận tại cửa hàng" },
                    { value: "delivery", label: "Giao tận nơi" },
                  ],
                },
                {
                  name: "payment_method",
                  label: "Phương thức thanh toán",
                  type: "select",
                  options: [
                    { value: "cash", label: "Tiền mặt" },
                    { value: "paypal", label: "Paypal" },
                    { value: "bank_transfer", label: "Chuyển khoản" },
                    { value: "momo", label: "Ví Momo" },
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
              initialData={crud.mode === "edit" ? formatInitialData(crud.selectedItem) : {}}
              onSave={handleSave}
              onClose={crud.handleCloseForm}
            />
          </div>
        </div>
      )}

      <DynamicDialog
        open={dialog.open}
        mode={dialog.mode}
        title={dialog.title}
        message={dialog.message}
        onClose={closeDialog}
        onConfirm={dialog.onConfirm}
      />

      <InvoiceModal
        open={invoiceModal.open}
        order={invoiceModal.order}
        orderDetails={invoiceOrderDetails}
        onClose={closeInvoiceModal}
      />
    </div>
  );
};

export default memo(OrderManagement);
