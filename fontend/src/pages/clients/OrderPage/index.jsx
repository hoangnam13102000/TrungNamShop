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
} from "react-icons/fa";
import Pagination from "../../../components/common/Pagination";
import InvoiceModal from "../../../components/order/InvoiceModal";
import { useCRUDApi } from "../../../api/hooks/useCRUDApi";
import { useCustomerInfo } from "../../../utils/hooks/useCustomerInfo";

const MyOrders = () => {
  const { customerId, loading: customerLoading } = useCustomerInfo();

  const orderAPI = useCRUDApi("orders");
  const { data: orders = [], isLoading: ordersLoading } = orderAPI.useGetAll();

  const orderDetailAPI = useCRUDApi("order-details");
  const { data: allOrderDetails = [], refetch: refetchAllOrderDetails } = orderDetailAPI.useGetAll();

  const [invoiceModal, setInvoiceModal] = useState({ open: false, order: null });
  const [invoiceOrderDetails, setInvoiceOrderDetails] = useState([]);
  const [loadingInvoiceDetails, setLoadingInvoiceDetails] = useState(false);

  // Lấy chi tiết hóa đơn khi mở modal
  const fetchInvoiceOrderDetails = useCallback(
    async (orderId) => {
      if (!orderId) return;
      try {
        setLoadingInvoiceDetails(true);
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

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Lọc đơn hàng của khách hàng
  const customerOrders = useMemo(() => {
    if (!customerId) return [];
    return orders.filter((o) => Number(o.customer?.id) === Number(customerId));
  }, [orders, customerId]);

  // Lọc theo search
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

  useEffect(() => {
    refetchAllOrderDetails();
  }, [refetchAllOrderDetails]);

  const getStatusColor = (status) => {
    const statusMap = {
      pending: { bg: "bg-gradient-to-br from-amber-50 to-yellow-50", border: "border-amber-200", text: "text-amber-700", icon: "text-amber-600", dot: "bg-amber-500" },
      processing: { bg: "bg-gradient-to-br from-blue-50 to-sky-50", border: "border-blue-200", text: "text-blue-700", icon: "text-blue-600", dot: "bg-blue-500" },
      shipped: { bg: "bg-gradient-to-br from-purple-50 to-violet-50", border: "border-purple-200", text: "text-purple-700", icon: "text-purple-600", dot: "bg-purple-500" },
      delivered: { bg: "bg-gradient-to-br from-green-50 to-emerald-50", border: "border-green-200", text: "text-green-700", icon: "text-green-600", dot: "bg-green-500" },
      cancelled: { bg: "bg-gradient-to-br from-red-50 to-rose-50", border: "border-red-200", text: "text-red-700", icon: "text-red-600", dot: "bg-red-500" },
    };
    return statusMap[status?.toLowerCase()] || statusMap.pending;
  };

  const getPaymentStatusColor = (status) => {
    return status?.toLowerCase() === "paid"
      ? { bg: "bg-green-100", text: "text-green-700" }
      : { bg: "bg-orange-100", text: "text-orange-700" };
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
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
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-lg">
            <FaBox className="text-white text-2xl" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-red-600 bg-clip-text text-transparent">
              Đơn hàng của tôi
            </h1>
            <p className="text-gray-600 text-sm mt-1 flex items-center gap-2">
              <span className="text-red-600">•</span>
              Theo dõi trạng thái và chi tiết đơn hàng của bạn
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-600 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
          <div className="relative bg-white rounded-xl border-2 border-gray-200 group-focus-within:border-red-500 transition-all duration-300 shadow-sm p-1">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500 group-focus-within:text-red-600">🔍</div>
            <input
              type="text"
              placeholder="Tìm kiếm theo mã đơn, tên người nhận hoặc số điện thoại..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none font-medium text-sm"
            />
          </div>
        </div>
      </div>

      {/* Orders */}
      {currentItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200 shadow-sm">
          <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4 animate-bounce">
            <FaBox className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-gray-700 font-bold text-lg">Chưa có đơn hàng nào</p>
          <p className="text-gray-500 text-sm mt-1">Bắt đầu mua sắm để tạo đơn hàng đầu tiên của bạn</p>
        </div>
      ) : (
        <div className="space-y-4">
          {currentItems.map((order) => {
            const statusColor = getStatusColor(order.order_status_label);
            const paymentColor = getPaymentStatusColor(order.payment_status_label);

            // Tính tổng số lượng và tổng tiền từ chi tiết order
            const orderDetails = allOrderDetails.filter((d) => d.order_id === order.id);
            const totalItems = orderDetails.reduce((sum, d) => sum + (d.quantity || 0), 0) || order.items_count || 0;
            const totalAmount = orderDetails.reduce((sum, d) => sum + ((d.price_at_order || 0) * (d.quantity || 0)), 0) || order.total_amount || 0;

            return (
              <div
                key={order.id}
                className={`${statusColor.bg} border-l-4 ${statusColor.border} border-2 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group cursor-pointer`}
              >
                <div className={`h-1 ${statusColor.dot}`}></div>

                <div className="p-5 md:p-6">
                  {/* Top Row */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
                    <div className="flex items-center gap-3">
                      <div className={`${statusColor.icon} text-3xl p-2.5 bg-white/60 rounded-lg`}>
                        {getStatusIcon(order.order_status_label)}
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Mã đơn hàng</p>
                        <p className="text-lg md:text-xl font-bold text-gray-900 group-hover:text-red-600 transition">
                          {order.order_code}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 md:justify-end">
                      <span className={`${statusColor.bg} ${statusColor.text} px-4 py-2 rounded-full text-xs font-bold border-2 ${statusColor.border} whitespace-nowrap`}>
                        {order.order_status_label || "Chưa xác định"}
                      </span>
                      <span className={`${paymentColor.bg} ${paymentColor.text} px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap`}>
                        {order.payment_status_label || "Chưa thanh toán"}
                      </span>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                    <div className="bg-white/70 rounded-xl p-4 border border-white/80 hover:shadow-md transition-all">
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

                    <div className="bg-white/70 rounded-xl p-4 border border-white/80 hover:shadow-md transition-all flex flex-col justify-between">
                      <div>
                        <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide mb-3">Tóm tắt đơn hàng</p>
                        <p className="text-2xl font-bold text-transparent bg-gradient-to-r from-red-600 to-red-500 bg-clip-text mb-3">
                          {totalAmount.toLocaleString()} VNĐ
                        </p>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>
                          Số mặt hàng:{" "}
                          <span className="font-bold text-gray-900">{totalItems}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Button */}
                  <button
                    onClick={() => {
                      setInvoiceModal({ open: true, order });
                      fetchInvoiceOrderDetails(order.id);
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 rounded-xl transition-all duration-200 hover:shadow-lg active:scale-95 group"
                  >
                    <FaReceipt className="w-4 h-4" />
                    Xem hóa đơn
                    <FaChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
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
    </div>
  );
};

export default memo(MyOrders);