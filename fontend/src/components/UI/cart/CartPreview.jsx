import { memo } from "react";
import { Link } from "react-router-dom";
import { FaTrash, FaShoppingBag } from "react-icons/fa";
import { getImageUrl } from "../../../utils/helpers/getImageUrl";
import { removeItem, getCart } from "../../../utils/cart/cartUtils";

const CartPreview = ({ items = [], onCartChange }) => {
  const totalPrice = items.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );

  if (items.length === 0) {
    return (
      <div className="w-80 bg-white shadow-xl rounded-xl overflow-hidden z-50">
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <FaShoppingBag className="w-12 h-12 text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">Giỏ hàng trống</p>
        </div>
      </div>
    );
  }

  const handleRemove = (id) => {
    const updatedCart = removeItem(getCart(), id);
    onCartChange && onCartChange(updatedCart);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  return (
    <div className="w-80 bg-white shadow-xl rounded-xl overflow-hidden z-50 flex flex-col">
      <div className="px-4 py-3 border-b bg-gradient-to-r from-gray-50 to-white">
        <p className="text-sm font-semibold text-gray-800">Giỏ hàng của bạn</p>
      </div>

      <div className="max-h-96 overflow-y-auto flex-1">
        {items.map((item, idx) => {
          const imageUrl = getImageUrl(item.primary_image?.image_path || item.brand?.image);
          const itemTotal = (item.price || 0) * (item.quantity || 1);
          
          return (
            <div
              key={idx}
              className="flex gap-3 items-center px-4 py-3 border-b last:border-b-0 hover:bg-gradient-to-r hover:from-red-50 hover:to-transparent transition group"
            >
              <img
                src={imageUrl}
                alt={item.name || "Sản phẩm"}
                className="w-16 h-16 object-cover rounded-lg shadow-sm flex-shrink-0"
              />
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {item.name || "-"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {item.quantity || 1} × {(item.price || 0).toLocaleString()} VNĐ
                </p>
                <p className="text-sm font-semibold text-red-600 mt-1">
                  {itemTotal.toLocaleString()} VNĐ
                </p>
              </div>
              
              <button
                onClick={() => handleRemove(item.id)}
                className="flex-shrink-0 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                aria-label="Xóa sản phẩm"
              >
                <FaTrash className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      <div className="px-4 py-4 border-t bg-gradient-to-t from-gray-50 to-white space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-medium">Tổng cộng:</span>
          <span className="text-lg font-bold text-red-600">
            {totalPrice.toLocaleString()} VNĐ
          </span>
        </div>
        
        <Link
          to="/gio-hang"
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white py-2.5 rounded-lg hover:from-red-700 hover:to-red-800 active:scale-95 transition font-semibold shadow-lg hover:shadow-xl"
        >
          <FaShoppingBag className="w-4 h-4" />
          Xem giỏ hàng
        </Link>
      </div>
    </div>
  );
};

export default memo(CartPreview);