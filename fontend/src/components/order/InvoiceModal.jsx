import { memo } from "react";
import {
  FaUser,
  FaPhone,
  FaMapPin,
  FaStore,
  FaTag,
  FaCalendar,
  FaBox,
  FaStickyNote,
  FaTimes,
  FaList,
} from "react-icons/fa";
import OrderDetailsTable from "./OrderDetailsTable";

const InvoiceModal = ({ open, order, orderDetails = [], onClose }) => {
  if (!open || !order) return null;

  const formatDate = (date) => date?.split("T")[0] || "—";
  const formatCurrency = (amount) => amount?.toLocaleString("vi-VN") || "—";

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  const statusLabels = {
    pending: "Đang chờ",
    processing: "Đang xử lý",
    shipped: "Đang giao",
    delivered: "Đã giao",
    completed: "Hoàn thành",
    cancelled: "Đã hủy",
  };

  const paymentColors = {
    unpaid: "bg-orange-100 text-orange-800",
    paid: "bg-green-100 text-green-800",
    refunded: "bg-blue-100 text-blue-800",
  };

  const paymentLabels = {
    unpaid: "Chưa thanh toán",
    paid: "Đã thanh toán",
    refunded: "Đã hoàn tiền",
  };

  const deliveryMethodLabels = {
    pickup: "Nhận tại cửa hàng",
    delivery: "Giao tận nơi",
  };

  const paymentMethodLabels = {
    cash: "Tiền mặt",
    paypal: "Paypal",
    bank_transfer: "Chuyển khoản",
    momo: "Ví Momo",
    vnpay: "VNPay",
  };

  const orderStatusClass =
    statusColors[order.order_status?.toLowerCase()] || "bg-gray-100 text-gray-800";
  const paymentStatusClass =
    paymentColors[order.payment_status?.toLowerCase()] || "bg-gray-100 text-gray-800";

  const subtotal = Array.isArray(orderDetails)
    ? orderDetails.reduce((sum, detail) => {
        const price = Number(detail.price_at_order) || 0;
        const quantity = detail.quantity || 0;
        return sum + price * quantity;
      }, 0)
    : 0;

  const discountAmount = order.discount?.value || 0;
  const finalAmount = order.final_amount || subtotal - discountAmount;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-start pt-4 sm:pt-8 z-50 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl my-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 sm:px-8 py-6 flex justify-between items-center">
          <div>
            <p className="text-blue-100 text-sm font-medium">Hóa đơn</p>
            <h2 className="text-3xl font-bold text-white mt-1">{order.order_code}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-blue-500/30 rounded-full transition-colors"
          >
            <FaTimes className="text-white text-xl" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Customer & Order info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FaUser className="text-blue-600" /> Thông tin khách hàng
              </h3>
              <div className="space-y-3 pl-7">
                <div>
                  <p className="text-gray-600 text-sm">Tên khách hàng</p>
                  <p className="text-gray-900 font-medium">{order.customer?.full_name || "—"}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm flex items-center gap-1">
                    <FaPhone className="text-blue-600" /> Số điện thoại
                  </p>
                  <p className="text-gray-900 font-medium">
                    {order.customer?.phone_number || order.recipient_phone || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm flex items-center gap-1">
                    <FaMapPin className="text-blue-600" /> Địa chỉ giao hàng
                  </p>
                  <p className="text-gray-900 font-medium">{order.recipient_address || "—"}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FaStore className="text-blue-600" /> Thông tin đơn hàng
              </h3>
              <div className="space-y-3 pl-7">
                <div>
                  <p className="text-gray-600 text-sm">Nhân viên phụ trách</p>
                  <p className="text-gray-900 font-medium">{order.employee?.full_name || "—"}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Cửa hàng</p>
                  <p className="text-gray-900 font-medium">{order.store?.name || "—"}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm flex items-center gap-1">
                    <FaTag className="text-blue-600" /> Mã giảm giá
                  </p>
                  <p className="text-gray-900 font-medium">{order.discount?.code || "—"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order summary */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-gray-600 text-sm flex items-center gap-2 mb-2">
                  <FaCalendar className="text-blue-600" /> Ngày đặt
                </p>
                <p className="text-gray-900 font-semibold">{formatDate(order.order_date)}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm flex items-center gap-2 mb-2">
                  <FaBox className="text-blue-600" /> Ngày giao
                </p>
                <p className="text-gray-900 font-semibold">{formatDate(order.delivery_date)}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm mb-2">Trạng thái đơn</p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${orderStatusClass}`}
                >
                  {statusLabels[order.order_status?.toLowerCase()] || order.order_status || "—"}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm mb-2">Thanh toán</p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${paymentStatusClass}`}
                >
                  {paymentLabels[order.payment_status?.toLowerCase()] || order.payment_status || "—"}
                </span>
              </div>
            </div>
          </div>

          {/* Delivery & Payment */}
          <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-2xl p-4">
            <div>
              <p className="text-gray-600 text-sm">Vận chuyển</p>
              <p className="text-gray-900 font-medium">
                {deliveryMethodLabels[order.delivery_method] || order.delivery_method || "—"}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Phương thức thanh toán</p>
              <p className="text-gray-900 font-medium">
                {paymentMethodLabels[order.payment_method] || order.payment_method || "—"}
              </p>
            </div>
          </div>

          {/* Order Details */}
          <OrderDetailsTable orderDetails={orderDetails} formatCurrency={formatCurrency} />

          {/* Totals */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200 space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-3 border-b border-blue-200">
                <span className="text-gray-700 font-medium">Tạm tính:</span>
                <span className="text-lg font-semibold text-gray-900">
                  {formatCurrency(subtotal)} VNĐ
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between items-center pb-3 border-b border-blue-200">
                  <span className="text-gray-700 font-medium flex items-center gap-2">
                    <FaTag className="text-red-500 text-sm" /> Giảm giá:
                  </span>
                  <span className="text-lg font-semibold text-red-600">
                    -{formatCurrency(discountAmount)} VNĐ
                  </span>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-3 border-t-2 border-blue-300">
              <span className="text-gray-900 font-bold text-lg">Tổng cộng:</span>
              <span className="text-3xl font-bold text-blue-600">
                {Math.round(finalAmount)?.toLocaleString("vi-VN")} VNĐ
              </span>
            </div>
          </div>

          {/* Note */}
          {order.note && (
            <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
              <p className="text-gray-600 text-sm mb-2 flex items-center gap-2">
                <FaStickyNote className="text-blue-600" /> Ghi chú:
              </p>
              <p className="text-gray-900 text-sm leading-6">{order.note}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 sm:px-8 py-4 flex justify-end border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg duration-200"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(InvoiceModal);
