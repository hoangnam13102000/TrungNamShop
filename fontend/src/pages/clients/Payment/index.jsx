import React, { memo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaCreditCard,
  FaBox,
  FaTruck,
  FaWallet,
} from "react-icons/fa";
import BreadCrumb from "../theme/BreadCrumb";
import { getImageUrl } from "../../../utils/helpers/getImageUrl";
import { validateGeneral } from "../../../utils/forms/validate";
import { useCRUDApi } from "../../../api/hooks/useCRUDApi";
import { useCustomerInfo } from "../../../utils/hooks/useCustomerInfo";
import DynamicDialog from "../../../components/formAndDialog/DynamicDialog";

const Payment = () => {
  const [cartItems,setCartItems] = useState(JSON.parse(localStorage.getItem("cart")) || []);
  const {
    customerInfo,
    setCustomerInfo,
    customerId,
    loading: customerLoading,
  } = useCustomerInfo();
  const [errors, setErrors] = useState({});
  const [dialog, setDialog] = useState({
    open: false,
    mode: "alert",
    title: "",
    message: "",
    onConfirm: null,
  });

  const { useCreate } = useCRUDApi("orders");
  const createOrder = useCreate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const getTotal = () =>
    cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const getCartItemImage = (item) => {
    if (!item) return null;
    if (item.image) {
      if (typeof item.image === "string") return item.image;
      if (typeof item.image === "object") {
        if (Array.isArray(item.image)) return item.image[0]?.image_path || null;
        return (
          item.image.image_path || item.image.url || item.image.path || null
        );
      }
    }
    if (item.primary_image)
      return item.primary_image.image_path || item.primary_image.url || null;
    return null;
  };

  const closeDialog = () => {
    setDialog((prev) => ({ ...prev, open: false }));
  };

  const handlePayment = async () => {
    const rules = {
      name: { required: true, message: "Vui lòng nhập họ và tên" },
      phone: {
        required: true,
        type: "phone",
        message: "Số điện thoại không hợp lệ",
      },
      address: { required: true, message: "Vui lòng nhập địa chỉ nhận hàng" },
      delivery_method: {
        required: true,
        message: "Vui lòng chọn phương thức giao hàng",
      },
      payment_method: {
        required: true,
        message: "Vui lòng chọn phương thức thanh toán",
      },
    };

    const validationErrors = validateGeneral(customerInfo, rules);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (!customerId) {
      setDialog({
        open: true,
        mode: "alert",
        title: "Lỗi",
        message: "Không tìm thấy thông tin khách hàng. Vui lòng đăng nhập lại.",
      });
      return;
    }

    try {
      const orderPayload = {
        order_code: `ORDER-${Date.now()}`,
        customer_id: customerId,
        store_id: 1,
        discount_id: null,
        recipient_name: customerInfo.name,
        recipient_phone: customerInfo.phone,
        recipient_address: customerInfo.address,
        note: customerInfo.note || "",
        delivery_method: customerInfo.delivery_method,
        payment_method: customerInfo.payment_method,
        payment_status: "unpaid",
        order_status: "pending",
        final_amount: getTotal(),
        items: cartItems.map((item) => ({
          product_detail_id: item.id,
          product_name: item.name,
          detail_info: item.detail_info || null,
          quantity: item.quantity,
          price_at_order: item.price,
          subtotal: item.price * item.quantity,
        })),
      };

      const orderRes = await createOrder.mutateAsync(orderPayload);
      const orderId = orderRes?.order?.id;

      if (!orderId) {
        setDialog({
          open: true,
          mode: "alert",
          title: "Lỗi",
          message: "Không thể lấy ID đơn hàng từ server.",
        });
        return;
      }

      // MoMo
      if (customerInfo.payment_method === "momo") {
        const payRes = await fetch("http://127.0.0.1:8000/api/momo/payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order_id: orderId }),
        });
        const payData = await payRes.json();
        if (payData.payUrl || payData.payment_url) {
          window.location.href = payData.payUrl || payData.payment_url;
        } else {
          setDialog({
            open: true,
            mode: "alert",
            title: "Lỗi",
            message: "MoMo phản hồi không hợp lệ.",
          });
        }
      }


      // Cash
      if (customerInfo.payment_method === "cash") {
        setDialog({
          open: true,
          mode: "confirm",
          title: "Thành công",
          message: "Đặt hàng thành công!",
          onConfirm: () => {
            localStorage.removeItem("cart");
            setCartItems([]);
            window.location.href = "/gio-hang";
          },
        });
      }
    } catch (error) {
      console.error("Lỗi khi tạo đơn:", error);
      setDialog({
        open: true,
        mode: "alert",
        title: "Lỗi",
        message: "Có lỗi xảy ra khi tạo đơn hàng.",
      });
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4 sm:px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <BreadCrumb name="Thanh toán" />
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <FaBox className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-6">Giỏ hàng trống</p>
            <Link
              to="/products"
              className="inline-block bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-3 rounded-lg hover:shadow-xl transition-all duration-300"
            >
              Quay lại mua sắm
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <DynamicDialog
        open={dialog.open}
        mode={dialog.mode}
        title={dialog.title}
        message={dialog.message}
        onClose={closeDialog}
        onConfirm={dialog.onConfirm}
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4 sm:px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <BreadCrumb name="Thanh toán" />

          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 flex items-center gap-3">
              <div className="bg-gradient-to-br from-red-500 to-red-600 p-3 rounded-lg shadow-lg">
                <FaCreditCard className="text-white text-xl" />
              </div>
              Thanh toán
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Customer Info & Cart */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Info */}
              <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Họ và tên
                    </label>
                    <input
                      name="name"
                      placeholder="Nhập họ và tên"
                      value={customerInfo.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                        errors.name
                          ? "border-red-400 bg-red-50 focus:border-red-500"
                          : "border-gray-200 focus:border-blue-500"
                      }`}
                    />
                    {errors.name && (
                      <p className="text-red-600 text-sm mt-1">
                         {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Số điện thoại
                    </label>
                    <input
                      name="phone"
                      placeholder="0912345678"
                      value={customerInfo.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                        errors.phone
                          ? "border-red-400 bg-red-50 focus:border-red-500"
                          : "border-gray-200 focus:border-blue-500"
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-red-600 text-sm mt-1">
                        ⚠ {errors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Địa chỉ nhận hàng
                    </label>
                    <input
                      name="address"
                      placeholder="Nhập địa chỉ"
                      value={customerInfo.address}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                        errors.address
                          ? "border-red-400 bg-red-50 focus:border-red-500"
                          : "border-gray-200 focus:border-blue-500"
                      }`}
                    />
                    {errors.address && (
                      <p className="text-red-600 text-sm mt-1">
                        ⚠ {errors.address}
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Ghi chú (tuỳ chọn)
                    </label>
                    <input
                      name="note"
                      placeholder="Nhập ghi chú"
                      value={customerInfo.note}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>

                  {/* Phương thức giao hàng & thanh toán */}
                  <div className="sm:col-span-2 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <FaTruck className="text-green-600 text-lg" />
                          Phương thức giao hàng
                        </label>
                        <select
                          name="delivery_method"
                          value={customerInfo.delivery_method || ""}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors cursor-pointer ${
                            errors.delivery_method
                              ? "border-red-400 bg-red-50 focus:border-red-500"
                              : "border-gray-200 focus:border-blue-500"
                          }`}
                        >
                          <option value="">Phương thức giao hàng</option>
                          <option value="delivery">Giao hàng tận nơi</option>
                          <option value="pickup">Nhận tại cửa hàng</option>
                        </select>
                        {errors.delivery_method && (
                          <p className="text-red-600 text-sm mt-1">
                             {errors.delivery_method}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <FaWallet className="text-purple-600 text-lg" />
                          Thanh toán
                        </label>
                        <select
                          name="payment_method"
                          value={customerInfo.payment_method || ""}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors cursor-pointer ${
                            errors.payment_method
                              ? "border-red-400 bg-red-50 focus:border-red-500"
                              : "border-gray-200 focus:border-blue-500"
                          }`}
                        >
                          <option value="">Phương thức thanh toán</option>
                          <option value="momo">MoMo</option>
                          <option value="cash">Thanh toán khi nhận hàng</option>
                        </select>
                        {errors.payment_method && (
                          <p className="text-red-600 text-sm mt-1">
                             {errors.payment_method}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cart Items */}
              <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <FaBox className="text-blue-600" />
                  Danh sách sản phẩm
                </h3>
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:shadow-md transition-all duration-300"
                    >
                      <img
                        src={getImageUrl(getCartItemImage(item))}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">
                          {item.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {item.quantity} ×{" "}
                          {Number(item.price).toLocaleString()}₫
                        </p>
                      </div>
                      <span className="font-bold text-red-600 text-lg">
                        {(item.price * item.quantity).toLocaleString()}₫
                      </span>
                    </div>
                  ))}
                </div>

                {/* Link quay lại giỏ hàng */}
                <Link
                  to="/gio-hang"
                  className="flex items-center justify-center gap-2 text-gray-700 hover:text-red-600 font-semibold mt-4 py-3 rounded-lg hover:bg-gray-100 transition-all duration-300"
                >
                  <FaArrowLeft className="text-sm" />
                  Quay lại giỏ hàng
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 p-8 sticky top-8 h-fit">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Tóm tắt đơn hàng
                </h2>
                <div className="space-y-3 mb-6 pb-6 border-b-2 border-gray-200">
                  <div className="flex justify-between text-gray-700">
                    <span>Tạm tính:</span>
                    <span className="font-semibold">
                      {getTotal().toLocaleString()}₫
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Phí vận chuyển:</span>
                    <span className="font-semibold text-green-600">
                      Miễn phí
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Giảm giá:</span>
                    <span className="font-semibold text-green-600">0₫</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-xl mb-6 border-2 border-red-100">
                  <div className="flex justify-between items-center gap-2">
                    <span className="font-bold text-gray-900">Tổng cộng:</span>
                    <span className="text-2xl sm:text-3xl font-bold text-red-600">
                      {getTotal().toLocaleString()}₫
                    </span>
                  </div>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={customerLoading}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white font-bold py-4 px-6 rounded-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Thanh toán ngay
                </button>

                <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200 text-center text-xs text-gray-600">
                   Giao dịch được bảo mật 100%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(Payment);
