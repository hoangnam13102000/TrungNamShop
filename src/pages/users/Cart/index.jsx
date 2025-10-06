import { memo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaTrashAlt, FaShoppingCart, FaArrowLeft } from "react-icons/fa";
import BreadCrumb from "../theme/BreadCrumb";

import {
  increaseQuantity,
  decreaseQuantity,
  removeItem,
  calculateTotal,
} from "../../../utils/cartUtils";

const Cart = () => {
  // Mock data giỏ hàng ban đầu
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "iPhone 13 128GB - Xanh dương",
      image: "/iphone13.png",
      price: 28500000,
      quantity: 1,
    },
    {
      id: 2,
      name: "Samsung Galaxy S23 Ultra 256GB",
      image: "/s23ultra.png",
      price: 29800000,
      quantity: 1,
    },
  ]);

  // Increase / Decrease / Delete item use functions from utils
  const handleIncrease = (id) => {
    setCartItems((prev) => increaseQuantity(prev, id));
  };

  const handleDecrease = (id) => {
    setCartItems((prev) => decreaseQuantity(prev, id));
  };

  const handleRemove = (id) => {
    setCartItems((prev) => removeItem(prev, id));
  };

  const total = calculateTotal(cartItems);

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <BreadCrumb name="Giỏ hàng của bạn" />

      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <FaShoppingCart className="text-red-600" /> Giỏ hàng
      </h1>

      {/* Isnull Cart */}
      {cartItems.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg shadow-inner">
          <p className="text-lg text-gray-500 mb-4">
            Giỏ hàng của bạn đang trống.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-white bg-red-600 px-4 py-2 rounded-md hover:bg-red-700 transition"
          >
            <FaArrowLeft /> Tiếp tục mua sắm
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product list in Cart */}
          <div className="lg:col-span-2 bg-white p-4 rounded-xl shadow">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-center justify-between border-b py-4 gap-4"
              >
                {/* Product Details */}
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-contain rounded-md border"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {item.name}
                    </h3>
                    <p className="text-red-600 font-medium">
                      {item.price.toLocaleString()}₫
                    </p>
                  </div>
                </div>

                {/* Quantity */}
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

                {/* Total Price Of Each Product */}
                <div className="text-right">
                  <p className="font-semibold text-gray-700">
                    {(item.price * item.quantity).toLocaleString()}₫
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

          {/* Order Summary */}
          <div className="bg-white p-6 rounded-xl shadow h-fit">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Tóm tắt đơn hàng
            </h2>
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

      {/* Recommend System */}
      <div className="mt-10 bg-gray-50 p-6 rounded-xl shadow-inner border border-gray-200">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Có thể bạn sẽ thích
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[
            {
              id: 1,
              name: "iPhone 14 Pro",
              image: "/iphone14.png",
              price: 32900000,
            },
            {
              id: 2,
              name: "OPPO Reno10",
              image: "/reno10.png",
              price: 10900000,
            },
            {
              id: 3,
              name: "Xiaomi 14",
              image: "/xiaomi14.png",
              price: 16500000,
            },
            {
              id: 4,
              name: "Samsung Z Flip5",
              image: "/zflip5.png",
              price: 23900000,
            },
          ].map((prod) => (
            <Link
              to={`/product/${prod.id}`}
              key={prod.id}
              className="bg-white rounded-lg p-3 shadow hover:shadow-lg transition"
            >
              <img
                src={prod.image}
                alt={prod.name}
                className="w-full h-40 object-contain mb-2"
              />
              <h3 className="font-medium text-gray-800 truncate">{prod.name}</h3>
              <p className="text-red-600 font-semibold text-sm">
                {prod.price.toLocaleString()}₫
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default memo(Cart);
