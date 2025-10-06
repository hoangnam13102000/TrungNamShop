import { memo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaCreditCard } from "react-icons/fa";
import BreadCrumb from "../theme/BreadCrumb";

const Payment = () => {
  const [cartItems,  setCartItems] = useState([
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

  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));
  };

  const getTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handlePayment = () => {
    // TODO: xử lý thanh toán, gửi data lên server
    alert("Thanh toán thành công!");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <BreadCrumb name="Thanh toán" />

      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <FaCreditCard className="text-red-600" /> Thanh toán
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Thông tin khách hàng */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Thông tin người nhận</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Họ và tên"
              value={customerInfo.name}
              onChange={handleInputChange}
              className="border p-3 rounded-lg w-full"
            />
            <input
              type="text"
              name="phone"
              placeholder="Số điện thoại"
              value={customerInfo.phone}
              onChange={handleInputChange}
              className="border p-3 rounded-lg w-full"
            />
            <input
              type="text"
              name="address"
              placeholder="Địa chỉ nhận hàng"
              value={customerInfo.address}
              onChange={handleInputChange}
              className="border p-3 rounded-lg w-full sm:col-span-2"
            />
          </div>

          {/* Danh sách sản phẩm */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Sản phẩm trong giỏ</h3>
            <div className="space-y-2">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between border-b py-2">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-contain rounded-md border"
                    />
                    <span className="font-medium text-gray-800">{item.name}</span>
                  </div>
                  <span className="text-gray-700">
                    {item.quantity} x {item.price.toLocaleString()}₫
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tóm tắt đơn hàng */}
        <div className="bg-white p-6 rounded-xl shadow h-fit space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Tóm tắt đơn hàng</h2>
          <div className="flex justify-between text-gray-700">
            <span>Tạm tính:</span>
            <span>{getTotal().toLocaleString()}₫</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>Phí vận chuyển:</span>
            <span>Miễn phí</span>
          </div>
          <div className="flex justify-between font-bold text-lg text-red-600 border-t pt-3">
            <span>Tổng cộng:</span>
            <span>{getTotal().toLocaleString()}₫</span>
          </div>

          <button
            onClick={handlePayment}
            className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition"
          >
            Xác nhận thanh toán
          </button>

          <Link
            to="/gio-hang"
            className="inline-flex items-center gap-2 text-gray-700 hover:text-red-600 mt-2 text-sm"
          >
            <FaArrowLeft /> Quay lại giỏ hàng
          </Link>
        </div>
      </div>
    </div>
  );
};

export default memo(Payment);
