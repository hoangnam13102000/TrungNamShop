import { memo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import BreadCrumb from "../theme/BreadCrumb";
import { FaTrashAlt, FaShoppingCart, FaArrowLeft, FaCheck, FaTruck, FaLock } from "react-icons/fa";
import { getImageUrl } from "../../../utils/helpers/getImageUrl";

// Utils xử lý giỏ hàng
const increaseQuantity = (cart, id) =>
  cart.map((item) =>
    item.id === id ? { ...item, quantity: item.quantity + 1 } : item
  );

const decreaseQuantity = (cart, id) =>
  cart.map((item) =>
    item.id === id
      ? { ...item, quantity: Math.max(1, item.quantity - 1) }
      : item
  );

const removeItem = (cart, id) => cart.filter((item) => item.id !== id);

//  Tính tổng dựa trên final_price
const calculateTotal = (cart) =>
  cart.reduce(
    (sum, item) =>
      sum +
      (Number(item.final_price ?? item.price ?? 0) * (item.quantity || 1)),
    0
  );

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  // Load cart
  const loadCart = () => {
    const stored = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(stored);
  };

  useEffect(() => loadCart(), []);

  useEffect(() => {
    const handleCartUpdated = () => loadCart();
    window.addEventListener("cartUpdated", handleCartUpdated);
    return () =>
      window.removeEventListener("cartUpdated", handleCartUpdated);
  }, []);

  const handleIncrease = (id) => {
    const updated = increaseQuantity(cartItems, id);
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handleDecrease = (id) => {
    const updated = decreaseQuantity(cartItems, id);
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handleRemove = (id) => {
    const updated = removeItem(cartItems, id);
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const total = calculateTotal(cartItems);

  const breadcrumbPaths = [
    { name: "Trang chủ", to: "/" },
    { name: "Giỏ hàng" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <BreadCrumb paths={breadcrumbPaths} />

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg">
              <FaShoppingCart className="text-white text-lg" />
            </div>
            Giỏ hàng của bạn
          </h1>
          <p className="text-sm text-gray-600 ml-12">{cartItems.length} sản phẩm</p>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-lg border border-gray-100">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaShoppingCart className="w-12 h-12 text-gray-400" />
            </div>
            <p className="text-xl text-gray-600 mb-2">Giỏ hàng của bạn đang trống</p>
            <p className="text-gray-500 mb-8">Hãy khám phá những sản phẩm tuyệt vời</p>
            <Link
              to="/danh-sach-san-pham"
              className="inline-flex items-center gap-2 text-white bg-gradient-to-r from-red-500 to-red-600 px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-300 font-semibold"
            >
              <FaArrowLeft /> Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Product List */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => {
                const finalPrice = Number(item.final_price ?? item.price ?? 0);
                const originalPrice = Number(item.price ?? 0);
                const isDiscounted = originalPrice > finalPrice;
                const discountPercent = isDiscounted
                  ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100)
                  : 0;

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
                  >
                    <div className="p-5 sm:p-6 flex flex-col sm:flex-row gap-5">
                      {/* Product Image */}
                      <div className="relative flex-shrink-0">
                        <img
                          src={getImageUrl(
                            typeof item.image === "string"
                              ? item.image
                              : item.image?.image_path ||
                                item.primary_image?.image_path ||
                                item.brand?.image ||
                                null
                          )}
                          alt={item.name}
                          className="w-24 h-24 sm:w-28 sm:h-28 object-contain rounded-xl bg-gray-50 border border-gray-200"
                        />
                        {isDiscounted && (
                          <div className="absolute -top-2 -right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                            -{discountPercent}%
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg text-gray-900 mb-3 line-clamp-2">
                          {item.name}
                        </h3>

                        {/* Price */}
                        <div className="mb-4">
                          {isDiscounted ? (
                            <div className="flex items-baseline gap-2">
                              <p className="text-2xl font-bold text-red-600">
                                {finalPrice.toLocaleString()} VNĐ
                              </p>
                              <p className="text-gray-500 line-through text-sm">
                                {originalPrice.toLocaleString()} VNĐ
                              </p>
                            </div>
                          ) : (
                            <p className="text-2xl font-bold text-gray-900">
                              {originalPrice.toLocaleString()} VNĐ
                            </p>
                          )}
                        </div>

                        {/* Quantity Control */}
                        <div className="flex items-center gap-3 bg-gray-100 w-fit rounded-lg p-2">
                          <button
                            onClick={() => handleDecrease(item.id)}
                            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-200 transition font-bold text-gray-700"
                          >
                            −
                          </button>
                          <span className="w-8 text-center font-semibold text-gray-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleIncrease(item.id)}
                            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-200 transition font-bold text-gray-700"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Total & Remove */}
                      <div className="flex flex-col items-end justify-between">
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Thành tiền</p>
                          <p className="text-xl font-bold text-gray-900">
                            {(finalPrice * item.quantity).toLocaleString()}
                          </p>
                          <p className="text-gray-500 text-xs">VNĐ</p>
                        </div>
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition flex items-center gap-1 font-medium text-sm"
                        >
                          <FaTrashAlt /> Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary Card */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-xl border border-gray-100 p-8 sticky top-6">
                {/* Header */}
                <h2 className="text-2xl font-bold text-gray-900 mb-8">
                  Tóm tắt đơn hàng
                </h2>

                {/* Summary Details */}
                <div className="space-y-4 mb-8 pb-8 border-b border-gray-200">
                  <div className="flex justify-between text-gray-700">
                    <span>Tạm tính</span>
                    <span className="font-semibold">{total.toLocaleString()} VNĐ</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Phí vận chuyển</span>
                    <span className="font-semibold text-green-600 flex items-center gap-1">
                      <FaCheck className="w-3 h-3" /> Miễn phí
                    </span>
                  </div>
                </div>

                {/* Total */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700">Tổng cộng</span>
                    <span className="text-4xl font-black bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                      {total.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm">VNĐ</p>
                </div>

                {/* Trust Badges */}
                <div className="space-y-3 mb-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <FaLock className="w-4 h-4 text-blue-600" />
                    <span>Thanh toán an toàn</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <FaTruck className="w-4 h-4 text-blue-600" />
                    <span>Giao hàng miễn phí</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={() => navigate("/thanh-toan")}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-4 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl active:scale-95"
                >
                  Tiến hành thanh toán
                </button>

                {/* Continue Shopping */}
                <Link
                  to="/danh-sach-san-pham"
                  className="w-full mt-4 bg-white border-2 border-gray-300 text-gray-900 py-3 rounded-xl hover:border-gray-400 transition-all duration-300 font-semibold text-center block"
                >
                  Tiếp tục mua sắm
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(Cart);