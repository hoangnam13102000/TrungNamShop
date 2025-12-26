import { memo, useState, useEffect, useCallback, useMemo } from "react";
import {
  FaReceipt,
  FaBox,
  FaTruck,
  FaCheckCircle,
  FaClock,
  FaPhone,
  FaMapMarkerAlt,
  FaChevronRight,
  FaSearch,
} from "react-icons/fa";
import Pagination from "../../../components/common/Pagination";
import InvoiceModal from "../../../components/order/InvoiceModal";
import DynamicDialog from "../../../components/formAndDialog/DynamicDialog";
import { useCRUDApi } from "../../../api/hooks/useCRUDApi";
import { useCustomerInfo } from "../../../utils/hooks/useCustomerInfo";
import { useQueryClient } from "@tanstack/react-query";

const MyOrders = () => {
  const { customerId, loading: customerLoading } = useCustomerInfo();
  const queryClient = useQueryClient();

  // API
  const orderAPI = useCRUDApi("orders");
  const { data: orders = [], isLoading: ordersLoading, refetch: refetchOrders } =
    orderAPI.useGetAll();
  const orderUpdate = orderAPI.useUpdate();

  const orderDetailAPI = useCRUDApi("order-details");
  const { data: allOrderDetails = [], refetch: refetchAllOrderDetails } =
    orderDetailAPI.useGetAll();

  const [invoiceModal, setInvoiceModal] = useState({ open: false, order: null });
  const [invoiceOrderDetails, setInvoiceOrderDetails] = useState([]);
  const [loadingInvoiceDetails, setLoadingInvoiceDetails] = useState(false);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Dialog state
  const [dialog, setDialog] = useState({ open: false, mode: "alert", title: "", message: "", onConfirm: null });

  const formatCurrency = (amount) =>
    typeof amount === "number" ? amount.toLocaleString("vi-VN") : "0";

  const fetchInvoiceOrderDetails = useCallback(
    async (orderId) => {
      if (!orderId) return;
      setLoadingInvoiceDetails(true);
      try {
        const filteredDetails = allOrderDetails.filter((d) => d.order_id === orderId);
        const detailsWithProducts = await Promise.all(
          filteredDetails.map(async (d) => {
            if (!d.product_id) return d;
            try {
              const res = await fetch(`/api/products/${d.product_id}`);
              if (!res.ok) return d;
              const product = await res.json();
              return { ...d, product };
            } catch {
              return d;
            }
          })
        );
        setInvoiceOrderDetails(detailsWithProducts);
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

  const closeDialog = useCallback(() => {
    setDialog({ open: false, mode: "alert", title: "", message: "", onConfirm: null });
  }, []);

  useEffect(() => {
    refetchAllOrderDetails();
  }, [refetchAllOrderDetails]);

  const customerOrders = useMemo(() => {
    if (!customerId) return [];
    return orders.filter((o) => Number(o.customer?.id) === Number(customerId));
  }, [orders, customerId]);

  const filteredItems = useMemo(() => {
    const term = search.toLowerCase().trim();
    return customerOrders.filter(
      (o) =>
        o.order_code?.toLowerCase().includes(term) ||
        o.recipient_name?.toLowerCase().includes(term) ||
        o.recipient_phone?.includes(term)
    );
  }, [customerOrders, search]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [currentPage, filteredItems]);

  // ====== STATUS HELPERS ======
  const normalizeStatus = (status) => {
    const statusMap = {
      pending: "pending",
      processing: "processing",
      shipping: "shipped",
      completed: "delivered",
      cancelled: "cancelled",
    };
    return statusMap[status?.toLowerCase()] || "pending";
  };

  const getStatusColor = (status) => {
    const normalizedStatus = normalizeStatus(status);
    const statusMap = {
      pending: { bg: "bg-amber-50", border: "border-amber-300", text: "text-amber-700", icon: "text-amber-600", dot: "bg-amber-400", label: "Đang chờ" },
      processing: { bg: "bg-blue-50", border: "border-blue-300", text: "text-blue-700", icon: "text-blue-600", dot: "bg-blue-400", label: "Đang xử lý" },
      shipped: { bg: "bg-purple-50", border: "border-purple-300", text: "text-purple-700", icon: "text-purple-600", dot: "bg-purple-400", label: "Đang giao" },
      delivered: { bg: "bg-green-50", border: "border-green-300", text: "text-green-700", icon: "text-green-600", dot: "bg-green-400", label: "Hoàn thành" },
      cancelled: { bg: "bg-red-50", border: "border-red-300", text: "text-red-700", icon: "text-red-600", dot: "bg-red-400", label: "Đã hủy" },
    };
    return statusMap[normalizedStatus] || statusMap.pending;
  };

  const getPaymentStatusColor = (status) => {
    const normalizedStatus = status?.toLowerCase();
    const statusMap = {
      paid: { bg: "bg-green-100", text: "text-green-700", label: "Đã thanh toán" },
      unpaid: { bg: "bg-orange-100", text: "text-orange-700", label: "Chưa thanh toán" },
      refunded: { bg: "bg-gray-100", text: "text-gray-700", label: "Đã hoàn tiền" },
    };
    return statusMap[normalizedStatus] || statusMap.unpaid;
  };

  const getStatusIcon = (status) => {
    const normalizedStatus = normalizeStatus(status);
    switch (normalizedStatus) {
      case "delivered":
        return <FaCheckCircle />;
      case "shipped":
        return <FaTruck />;
      case "processing":
        return <FaBox />;
      default:
        return <FaClock />;
    }
  };

  // ====== HANDLE CANCEL ORDER ======
  const handleCancelOrder = useCallback(
    (order) => {
      setDialog({
        open: true,
        mode: "confirm",
        title: "Xác nhận hủy đơn hàng",
        message: "Bạn có chắc chắn muốn hủy đơn hàng này?",
        onConfirm: async () => {
          try {
            const updateData = {
              order_code: order.order_code,
              customer_id: order.customer?.id || order.customer_id,
              recipient_name: order.recipient_name,
              recipient_address: order.recipient_address,
              recipient_phone: order.recipient_phone,
              discount_id: order.discount?.id || null,
              store_id: order.store?.id || null,
              payment_method: order.payment_method,
              delivery_method: order.delivery_method,
              payment_status: order.payment_status,
              order_status: "cancelled",
              note: order.note || "",
              order_date: order.order_date,
              delivery_date: order.delivery_date,
            };

            await orderUpdate.mutateAsync({ id: order.id, data: updateData });

            await refetchOrders();
            await refetchAllOrderDetails();
            queryClient.invalidateQueries(["orders"]);
            
            closeDialog();
            
            const isPaid = order.payment_status?.toLowerCase() === "paid";
            setDialog({
              open: true,
              mode: "success",
              title: "Thành công",
              message: isPaid 
                ? "Đơn hàng đã được hủy thành công. Chúng tôi sẽ liên lạc và hoàn tiền cho bạn sau."
                : "Đơn hàng đã được hủy thành công",
              onConfirm: closeDialog,
            });
          } catch (err) {
            console.error(err);
            closeDialog();
            
            setDialog({
              open: true,
              mode: "alert",
              title: "Lỗi",
              message: "Đã xảy ra lỗi khi hủy đơn hàng",
              onConfirm: closeDialog,
            });
          }
        },
      });
    },
    [orderUpdate, refetchOrders, refetchAllOrderDetails, queryClient]
  );

  if (customerLoading || ordersLoading)
    return (
      <div className="p-4 text-center text-gray-600 min-h-screen flex items-center justify-center">
        <div className="inline-block">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mb-3"></div>
          <p>Đang tải đơn hàng của bạn...</p>
        </div>
      </div>
    );

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 min-h-screen">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="p-2.5 bg-red-500 rounded-lg shadow-lg">
          <FaBox className="text-white text-2xl" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Đơn hàng của tôi
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            <span className="text-red-600">•</span> Theo dõi trạng thái và chi tiết đơn hàng của bạn
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6 relative">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Tìm kiếm theo mã đơn, tên người nhận hoặc số điện thoại..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
        />
      </div>

      {/* Orders */}
      {currentItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-200">
          <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
            <FaBox className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-gray-700 font-bold text-lg">Chưa có đơn hàng nào</p>
          <p className="text-gray-500 text-sm mt-1">Bắt đầu mua sắm để tạo đơn hàng đầu tiên của bạn</p>
        </div>
      ) : (
        <div className="space-y-4">
          {currentItems.map((order) => {
            const statusColor = getStatusColor(order.order_status);
            const paymentColor = getPaymentStatusColor(order.payment_status);

            const orderDetails = allOrderDetails.filter((d) => d.order_id === order.id);
            const totalItems =
              orderDetails.reduce((sum, d) => sum + (d.quantity || 0), 0) || order.items_count || 0;

            const finalAmount =
              typeof order.final_amount === "number"
                ? order.final_amount
                : orderDetails.reduce(
                    (sum, d) => sum + (Number(d.price_at_order) || 0) * (Number(d.quantity) || 0),
                    0
                  ) - (Number(order.discount_amount) || 0);

            const normalizedStatus = normalizeStatus(order.order_status);

            return (
              <div
                key={order.id}
                className={`${statusColor.bg} border-4 ${statusColor.border} rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg`}
              >
                <div className={`h-1.5 ${statusColor.dot}`}></div>

                <div className="p-5 md:p-6">
                  {/* Top Row */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className={`${statusColor.icon} text-2xl p-2.5 bg-white/80 rounded-lg`}>
                        {getStatusIcon(order.order_status_label)}
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Mã đơn hàng</p>
                        <p className="text-lg md:text-xl font-bold text-gray-900">{order.order_code}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 md:justify-end">
                      <span className={`${statusColor.bg} ${statusColor.text} px-4 py-2 rounded-full text-xs font-bold border-2 ${statusColor.border}`}>
                        {statusColor.label}
                      </span>
                      <span className={`${paymentColor.bg} ${paymentColor.text} px-4 py-2 rounded-full text-xs font-bold`}>
                        {paymentColor.label}
                      </span>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide mb-3">Người nhận</p>
                      <p className="font-bold text-gray-900 mb-3">{order.recipient_name}</p>
                      <div className="space-y-2.5 text-sm">
                        <div className="flex items-center gap-3 text-gray-700">
                          <FaPhone className="w-4 h-4 text-red-600 flex-shrink-0" />
                          <span className="font-medium">{order.recipient_phone}</span>
                        </div>
                        <div className="flex items-start gap-3 text-gray-700">
                          <FaMapMarkerAlt className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                          <span className="font-medium break-words">{order.recipient_address}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between">
                      <div>
                        <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide mb-3">Tóm tắt đơn hàng</p>
                        <p className="text-3xl font-bold text-red-600 mb-3">{formatCurrency(finalAmount)} VNĐ</p>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>Số mặt hàng: <span className="font-bold text-gray-900">{totalItems}</span></p>
                        <p>Thanh toán: <span className="font-bold text-gray-900">{order.payment_method?.toUpperCase() || 'N/A'}</span></p>
                      </div>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setInvoiceModal({ open: true, order });
                        fetchInvoiceOrderDetails(order.id);
                      }}
                      className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-lg transition-all duration-200"
                    >
                      <FaReceipt className="w-4 h-4" /> Xem hóa đơn <FaChevronRight className="w-3.5 h-3.5" />
                    </button>

                    {!["delivered", "cancelled"].includes(normalizedStatus) && (
                      <button
                        onClick={() => handleCancelOrder(order)}
                        className="w-full flex items-center justify-center gap-2 bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-3 rounded-lg transition-all duration-200"
                      >
                        Hủy đơn hàng
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} maxVisible={5} />
        </div>
      )}

      <InvoiceModal open={invoiceModal.open} order={invoiceModal.order} orderDetails={invoiceOrderDetails} onClose={closeInvoiceModal} />
      
      <DynamicDialog
        open={dialog.open}
        mode={dialog.mode}
        title={dialog.title}
        message={dialog.message}
        onConfirm={dialog.onConfirm}
        onClose={closeDialog}
      />
    </div>
  );
};

export default memo(MyOrders);