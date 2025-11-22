import React, { memo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaCreditCard,
  FaBox,
  FaTruck,
  FaWallet,
  FaTag,
  FaTimes,
  FaCheck,
  FaLock,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";
import BreadCrumb from "../theme/BreadCrumb";
import { getImageUrl } from "../../../utils/helpers/getImageUrl";
import { validateGeneral } from "../../../utils/forms/validate";
import { useCRUDApi } from "../../../api/hooks/useCRUDApi";
import { useCustomerInfo } from "../../../utils/hooks/useCustomerInfo";
import DynamicDialog from "../../../components/formAndDialog/DynamicDialog";
import ChatWidget from "../../../components/Chats/ChatWidget";

const Payment = () => {
  const [cartItems, setCartItems] = useState(
    JSON.parse(localStorage.getItem("cart")) || []
  );
  const { customerInfo, setCustomerInfo, customerId, userType } =
    useCustomerInfo();
  const [errors, setErrors] = useState({});
  const [dialog, setDialog] = useState({
    open: false,
    mode: "alert",
    title: "",
    message: "",
    onConfirm: null,
  });

  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);

  const { useCreate } = useCRUDApi("orders");
  const createOrder = useCreate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const getCartItemImage = (item) => {
    if (!item) return null;

    if (item.image) {
      if (typeof item.image === "string") return item.image;
      if (Array.isArray(item.image)) return item.image[0]?.image_path || null;
      return item.image.image_path || item.image.url || item.image.path || null;
    }

    if (item.primary_image) {
      if (typeof item.primary_image === "string") return item.primary_image;
      return item.primary_image.image_path || item.primary_image.url || null;
    }

    if (item.brand?.image) return item.brand.image;

    return null;
  };

  const getSubtotal = () =>
    cartItems.reduce(
      (sum, item) =>
        sum +
        Number(item.final_price ?? item.price ?? 0) * (item.quantity || 1),
      0
    );

  const getDiscountAmount = () => {
    if (!appliedDiscount) return 0;
    const subtotal = getSubtotal();
    return (subtotal * appliedDiscount.percentage) / 100;
  };

  const getTotal = () => getSubtotal() - getDiscountAmount();

  const closeDialog = () => {
    setDialog((prev) => ({ ...prev, open: false }));
  };

  const applyDiscount = async () => {
    if (!discountCode.trim()) {
      setDialog({
        open: true,
        mode: "error",
        title: "Lỗi",
        message: "Vui lòng nhập mã giảm giá",
      });
      return;
    }

    setIsApplyingDiscount(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/discounts/validate?code=${discountCode}`
      );
      const discountData = await response.json();

      if (response.ok && discountData.valid) {
        setAppliedDiscount({
          id: discountData.discount.id,
          code: discountData.discount.code,
          percentage: discountData.discount.percentage,
        });
        setDialog({
          open: true,
          mode: "success",
          title: "Thành công",
          message: `Áp dụng mã giảm giá thành công! Giảm ${discountData.discount.percentage}%`,
        });
      } else {
        setDialog({
          open: true,
          mode: "error",
          title: "Lỗi",
          message: discountData.message || "Mã giảm giá không hợp lệ",
        });
      }
    } catch (error) {
      console.error("Lỗi khi áp dụng mã giảm giá:", error);
      setDialog({
        open: true,
        mode: "error",
        title: "Lỗi",
        message: "Có lỗi xảy ra khi áp dụng mã giảm giá",
      });
    } finally {
      setIsApplyingDiscount(false);
    }
  };

  const removeDiscount = () => {
    setAppliedDiscount(null);
    setDiscountCode("");
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
        mode: "error",
        title: "Lỗi",
        message: "Bạn chưa đăng nhập. Vui lòng đăng nhập để thanh toán.",
      });
      return;
    }

    try {
      const orderPayload = {
        order_code: `ORDER-${Date.now()}`,
        customer_id: customerId,
        store_id: 1,
        discount_id: appliedDiscount?.id || null,
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
          price_at_order: Number(item.final_price ?? item.price ?? 0),
          subtotal: Number(item.final_price ?? item.price ?? 0) * item.quantity,
        })),
      };

      const orderRes = await createOrder.mutateAsync(orderPayload);
      const orderId = orderRes?.order?.id;
      console.log("orderRes", orderRes);
      if (!orderId) {
        setDialog({
          open: true,
          mode: "error",
          title: "Lỗi",
          message: "Không thể lấy ID đơn hàng từ server.",
        });
        return;
      }

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
            mode: "error",
            title: "Lỗi",
            message: "MoMo phản hồi không hợp lệ.",
          });
        }
      }

      if (customerInfo.payment_method === "cash") {
        setDialog({
          open: true,
          mode: "success",
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
        mode: "error",
        title: "Lỗi",
        message: "Có lỗi xảy ra khi tạo đơn hàng.",
      });
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4 sm:px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <BreadCrumb name="Thanh toán" />
          <div className="bg-white rounded-3xl shadow-xl p-16 text-center border border-gray-100">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaBox className="text-5xl text-gray-400" />
            </div>
            <p className="text-gray-600 text-xl font-semibold mb-2">
              Giỏ hàng của bạn trống
            </p>
            <p className="text-gray-500 mb-8">
              Hãy thêm sản phẩm để tiếp tục thanh toán
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-300 font-semibold"
            >
              <FaArrowLeft /> Quay lại mua sắm
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

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4 sm:px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <BreadCrumb name="Thanh toán" />

          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 p-3 rounded-xl shadow-lg flex items-center justify-center">
                <FaCreditCard className="text-white text-lg" />
              </div>
              Hoàn tất đơn hàng
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Info Card */}
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
                        ⚠ {errors.name}
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
                        ⚠ {errors.phone}
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
                        ⚠ {errors.address}
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
                          <option value="cash">Thanh toán khi nhận</option>
                        </select>
                        {errors.payment_method && (
                          <p className="text-red-600 text-sm mt-2">
                            ⚠ {errors.payment_method}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Products Card */}
              <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <FaBox className="text-blue-600" />
                  Sản phẩm đặt hàng ({cartItems.length})
                </h3>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {cartItems.map((item) => {
                    const finalPrice = Number(
                      item.final_price ?? item.price ?? 0
                    );
                    return (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl hover:from-blue-50 hover:to-blue-100 transition-all duration-200"
                      >
                        <img
                          src={getImageUrl(getCartItemImage(item))}
                          alt={item.name}
                          className="w-20 h-20 object-contain rounded-lg bg-white border border-gray-200 p-1"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 truncate">
                            {item.name}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            <span className="font-bold">{item.quantity}</span> ×{" "}
                            {finalPrice.toLocaleString()} VNĐ
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-bold text-lg text-gray-900">
                            {(finalPrice * item.quantity).toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">VNĐ</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Link
                  to="/gio-hang"
                  className="inline-flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mt-6 py-3 rounded-xl hover:bg-blue-50 transition-all duration-200 w-full"
                >
                  <FaArrowLeft className="text-sm" />
                  Quay lại giỏ hàng
                </Link>
              </div>
            </div>

            {/* Order Summary Sidebar */}
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
                      <span className="text-gray-900 font-bold text-lg">
                        Tổng cộng
                      </span>
                      <span className="text-3xl font-black bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                        {getTotal().toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm mt-1">VNĐ</p>
                  </div>
                </div>

                {/* Discount Code */}
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-gray-900">
                    Mã giảm giá
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Nhập mã"
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
                        Áp dụng
                      </button>
                    )}
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="bg-blue-50 rounded-2xl p-4 space-y-2 border border-blue-200">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <FaLock className="w-4 h-4 text-blue-600" />
                    <span>Thanh toán an toàn</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <FaTruck className="w-4 h-4 text-green-600" />
                    <span>Giao hàng miễn phí</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handlePayment}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 text-lg flex items-center justify-center gap-2"
                >
                  <FaLock className="w-4 h-4" />
                  Thanh toán ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Chat Widget */}
      <ChatWidget />
    </>
  );
};

export default memo(Payment);
