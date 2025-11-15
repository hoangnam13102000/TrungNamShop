import { memo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import BreadCrumb from "../theme/BreadCrumb";
import { FaTrashAlt, FaShoppingCart, FaArrowLeft } from "react-icons/fa";
import { getImageUrl } from "../../../utils/helpers/getImageUrl";

// Utils xử lý giỏ hàng
const increaseQuantity = (cart, id) =>
  cart.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item));
const decreaseQuantity = (cart, id) =>
  cart.map((item) =>
    item.id === id ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item
  );
const removeItem = (cart, id) => cart.filter((item) => item.id !== id);
const calculateTotal = (cart) =>
  cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  // Load cart từ localStorage
  const loadCart = () => {
    const stored = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(stored);
  };

  useEffect(() => loadCart(), []);

  // Realtime update khi localStorage thay đổi
  useEffect(() => {
    const handleCartUpdated = () => loadCart();
    window.addEventListener("cartUpdated", handleCartUpdated);
    return () => window.removeEventListener("cartUpdated", handleCartUpdated);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <BreadCrumb paths={breadcrumbPaths} />

      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <FaShoppingCart className="text-red-600" /> Giỏ hàng
      </h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg shadow-inner">
          <p className="text-lg text-gray-500 mb-4">Giỏ hàng của bạn đang trống.</p>
          <Link
            to="/danh-sach-san-pham"
            className="inline-flex items-center gap-2 text-white bg-red-600 px-4 py-2 rounded-md hover:bg-red-700 transition"
          >
            <FaArrowLeft /> Tiếp tục mua sắm
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product list */}
          <div className="lg:col-span-2 bg-white p-4 rounded-xl shadow">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-center justify-between border-b py-4 gap-4"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <img
                    src={getImageUrl(
                      typeof item.image === "string"
                        ? item.image
                        : item.image?.image_path || item.primary_image?.image_path || item.brand?.image || null
                    )}
                    alt={item.name}
                    className="w-20 h-20 object-contain rounded-md border"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-red-600 font-medium">
                      {Number(item.price).toLocaleString()}₫
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleDecrease(item.id)}
                    className="px-2 py-1 border rounded hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => handleIncrease(item.id)}
                    className="px-2 py-1 border rounded hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>

                <div className="text-right">
                  <p className="font-semibold text-gray-700">
                    {(Number(item.price) * item.quantity).toLocaleString()}₫
                  </p>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-red-500 text-sm mt-2 flex items-center gap-1 hover:text-red-700 transition"
                  >
                    <FaTrashAlt /> Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div className="bg-white p-6 rounded-xl shadow h-fit">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Tóm tắt đơn hàng</h2>
            <div className="flex justify-between mb-2 text-gray-700">
              <span>Tạm tính:</span>
              <span>{total.toLocaleString()}₫</span>
            </div>
            <div className="flex justify-between mb-2 text-gray-700">
              <span>Phí vận chuyển:</span>
              <span>Miễn phí</span>
            </div>
            <div className="flex justify-between font-bold text-lg text-red-600 border-t pt-3">
              <span>Tổng cộng:</span>
              <span>{total.toLocaleString()}₫</span>
            </div>
            <button
              className="w-full mt-5 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition"
              onClick={() => navigate("/thanh-toan")}
            >
              Tiến hành thanh toán
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(Cart);
