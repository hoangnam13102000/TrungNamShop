// src/components/payment/CustomerInfoForm.jsx
import React, { memo } from "react";
import {
  FaTruck,
  FaWallet,
  FaCheck,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";

const CustomerInfoForm = ({
  customerInfo,
  errors,
  handleInputChange,
  userType,
}) => {
  return (
    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FaMapMarkerAlt className="text-blue-600" />
          Thông tin giao hàng
        </h3>
        {userType && (
          <span
            className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-1 ${
              userType === "employee"
                ? "bg-blue-100 text-blue-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            <FaCheck className="w-3 h-3" />
            {userType === "employee" ? "Nhân viên" : "Khách hàng"}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Name */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-bold text-gray-900 mb-2.5">
            Họ và tên *
          </label>
          <input
            name="name"
            placeholder="Nhập họ và tên"
            value={customerInfo.name}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
              errors.name
                ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                : "border-gray-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            }`}
          />
          {errors.name && (
            <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
              {errors.name}
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2.5 flex items-center gap-1">
            <FaPhone className="text-red-600 w-3 h-3" />
            Số điện thoại *
          </label>
          <input
            name="phone"
            placeholder="0912345678"
            value={customerInfo.phone}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
              errors.phone
                ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                : "border-gray-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            }`}
          />
          {errors.phone && (
            <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
              {errors.phone}
            </p>
          )}
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2.5">
            Địa chỉ nhận hàng *
          </label>
          <input
            name="address"
            placeholder="Số nhà, tên đường"
            value={customerInfo.address}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
              errors.address
                ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                : "border-gray-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            }`}
          />
          {errors.address && (
            <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
               {errors.address}
            </p>
          )}
        </div>

        {/* Note */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-bold text-gray-900 mb-2.5">
            Ghi chú (tuỳ chọn)
          </label>
          <input
            name="note"
            placeholder="Ví dụ: Giao hàng tầng 2"
            value={customerInfo.note}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
          />
        </div>

        {/* Delivery & Payment Methods */}
        <div className="sm:col-span-2 pt-6 border-t-2 border-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Delivery */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2.5 flex items-center gap-2">
                <FaTruck className="text-green-600" />
                Giao hàng *
              </label>
              <select
                name="delivery_method"
                value={customerInfo.delivery_method || ""}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all cursor-pointer appearance-none bg-right bg-no-repeat ${
                  errors.delivery_method
                    ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                    : "border-gray-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                }`}
              >
                <option value="">-- Chọn phương thức --</option>
                <option value="delivery"> Giao tận nơi</option>
                <option value="pickup"> Nhận tại cửa hàng</option>
              </select>
              {errors.delivery_method && (
                <p className="text-red-600 text-sm mt-2">
                  ⚠ {errors.delivery_method}
                </p>
              )}
            </div>

            {/* Payment */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2.5 flex items-center gap-2">
                <FaWallet className="text-purple-600" />
                Thanh toán *
              </label>
              <select
                name="payment_method"
                value={customerInfo.payment_method || ""}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all cursor-pointer appearance-none bg-right bg-no-repeat ${
                  errors.payment_method
                    ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                    : "border-gray-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                }`}
              >
                <option value="">-- Chọn phương thức --</option>
                <option value="momo"> MoMo</option>
                <option value="paypal"> Paypal</option>
                <option value="cash">Thanh toán khi nhận</option>
              </select>
              {errors.payment_method && (
                <p className="text-red-600 text-sm mt-2">
                  {errors.payment_method}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(CustomerInfoForm);