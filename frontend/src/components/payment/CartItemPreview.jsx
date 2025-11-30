
import React, { memo } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaBox } from "react-icons/fa";


const CartItemPreview = ({ cartItems, getCartItemImage }) => {
  if (!cartItems || cartItems.length === 0) {
    return null; 
  }

  return (
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
                src={getCartItemImage(item)}
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
  );
};

export default memo(CartItemPreview);