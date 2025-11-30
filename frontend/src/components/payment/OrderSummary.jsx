import React, { memo } from "react";
import { FaTag, FaTimes, FaSpinner, FaLock } from "react-icons/fa";
import PayPalButton from "./PayPalButton";

const OrderSummary = ({
  getSubtotal,
  discountCode,
  setDiscountCode,
  appliedDiscount,
  getDiscountAmount,
  getTotal,
  applyDiscount,
  removeDiscount,
  isApplyingDiscount,
  handlePayment,
  cartItemsLength,
  customerInfo = {},
  orderId,
}) => {
  const paymentMethod = customerInfo?.payment_method || "";

  return (
    <div className="lg:col-span-1">
      <div className="sticky top-6 bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-xl border border-gray-100 p-8 space-y-6">
        
        {/* Header */}
        <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FaTag className="text-yellow-600" />
          Tóm tắt đơn
        </h3>

        {/* Summary Details */}
        <div className="bg-white rounded-2xl p-5 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">Tạm tính</span>
            <span className="font-bold text-gray-900">
              {getSubtotal().toLocaleString()} VNĐ
            </span>
          </div>

          {appliedDiscount && (
            <div className="flex justify-between items-center bg-green-50 p-3 rounded-lg border border-green-200">
              <span className="text-green-700 font-medium">
                Giảm giá ({appliedDiscount.percentage}%)
              </span>
              <span className="font-bold text-green-600">
                -{getDiscountAmount().toLocaleString()} VNĐ
              </span>
            </div>
          )}

          <div className="border-t-2 border-gray-100 pt-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-900 font-bold text-lg">Tổng cộng</span>
              <span className="text-3xl font-black bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                {getTotal().toLocaleString()}
              </span>
            </div>
            <p className="text-gray-500 text-sm mt-1">VNĐ</p>
          </div>
        </div>

        {/* Discount Code Input */}
        <div className="space-y-3">
          <label className="block text-sm font-bold text-gray-900">Mã giảm giá</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Nhập mã..."
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              disabled={appliedDiscount}
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all disabled:bg-gray-100"
            />

            {appliedDiscount ? (
              <button
                onClick={removeDiscount}
                className="px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all font-bold"
              >
                <FaTimes />
              </button>
            ) : (
              <button
                onClick={applyDiscount}
                disabled={isApplyingDiscount}
                className="px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all font-bold disabled:opacity-50"
              >
                {isApplyingDiscount ? <FaSpinner className="animate-spin" /> : "Áp dụng"}
              </button>
            )}
          </div>
        </div>

        {/* Checkout Button */}
        {paymentMethod === "paypal" ? (
          <PayPalButton orderId={orderId} totalAmount={getTotal()} />
        ) : (
          <button
            onClick={handlePayment}
            disabled={isApplyingDiscount || cartItemsLength === 0}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 text-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isApplyingDiscount ? <FaSpinner className="animate-spin" /> : <FaLock className="w-4 h-4" />}
            {isApplyingDiscount ? "Đang xử lý..." : "Thanh toán ngay"}
          </button>
        )}

        <a
          href="/huong-dan-thanh-toan"
          className="block text-center w-full mt-2 py-3 font-semibold rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 transition-all duration-300 border border-blue-200"
        >
          Hướng dẫn thanh toán
        </a>
      </div>
    </div>
  );
};

export default memo(OrderSummary);
