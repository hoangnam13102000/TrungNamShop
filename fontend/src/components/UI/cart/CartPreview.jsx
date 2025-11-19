import { memo } from "react";
import { Link } from "react-router-dom";
import { FaTrash, FaShoppingBag, FaCheck, FaTruck } from "react-icons/fa";
import { getImageUrl } from "../../../utils/helpers/getImageUrl";
import { removeItem, getCart } from "../../../utils/cart/cartUtils";

const CartPreview = ({ items = [], onCartChange }) => {
  const totalPrice = items.reduce(
    (sum, item) => sum + (Number(item.final_price ?? item.price ?? 0) * (item.quantity || 1)),
    0
  );

  if (items.length === 0) {
    return (
      <div className="w-96 bg-white rounded-2xl shadow-2xl overflow-hidden z-50 border border-gray-100">
        <div className="flex flex-col items-center justify-center py-16 px-6">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FaShoppingBag className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-600 font-semibold text-lg">Giỏ hàng trống</p>
          <p className="text-gray-500 text-sm mt-2">Hãy thêm sản phẩm để tiếp tục</p>
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
    <div className="w-96 bg-white rounded-2xl shadow-2xl overflow-hidden z-50 flex flex-col border border-gray-100">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
            <FaShoppingBag className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-base font-bold text-gray-900">Giỏ hàng của bạn</p>
            <p className="text-xs text-gray-600">{items.length} sản phẩm</p>
          </div>
        </div>
      </div>

      {/* Items List */}
      <div className="max-h-96 overflow-y-auto flex-1">
        {items.map((item, idx) => {
          // Sửa ở đây: primary_image là string, không cần .image_path
          const imageUrl = getImageUrl(item.primary_image || item.brand?.image);
          const finalPrice = Number(item.final_price ?? item.price ?? 0);
          const originalPrice = Number(item.price ?? 0);
          const isDiscounted = originalPrice > finalPrice;
          const itemTotal = finalPrice * (item.quantity || 1);
          const discountPercent = isDiscounted
            ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100)
            : 0;

          return (
            <div
              key={idx}
              className="px-4 py-4 border-b border-gray-100 hover:bg-gradient-to-r hover:from-red-50 hover:to-transparent transition-all duration-200 group last:border-b-0"
            >
              <div className="flex gap-3">
                {/* Product Image */}
                <div className="relative flex-shrink-0">
                  <img
                    src={imageUrl}
                    alt={item.name || "Sản phẩm"}
                    className="w-16 h-16 object-contain rounded-lg bg-gray-50 border border-gray-200 group-hover:shadow-md transition"
                  />
                  {isDiscounted && (
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white px-1.5 py-0.5 rounded-full text-xs font-bold">
                      -{discountPercent}%
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-red-600 transition">
                    {item.name || "-"}
                  </p>
                  
                  {/* Quantity & Price */}
                  <p className="text-xs text-gray-600 mt-1.5 mb-2">
                    <span className="font-semibold">{item.quantity || 1}</span> ×{" "}
                    {isDiscounted ? (
                      <span className="ml-1">
                        <span className="text-red-600 font-bold">{finalPrice.toLocaleString()}</span>{" "}
                        <span className="line-through text-gray-400">{originalPrice.toLocaleString()}</span>
                      </span>
                    ) : (
                      <span className="ml-1 font-semibold">{finalPrice.toLocaleString()}</span>
                    )} VNĐ
                  </p>

                  {/* Total */}
                  <p className="text-sm font-bold text-red-600">
                    {itemTotal.toLocaleString()} VNĐ
                  </p>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => handleRemove(item.id)}
                  className="flex-shrink-0 p-2 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                  aria-label="Xóa sản phẩm"
                >
                  <FaTrash className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Summary */}
      <div className="px-6 py-5 border-t border-gray-100 bg-gradient-to-t from-slate-50 to-white space-y-4">
        <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-4 border border-red-100">
          <p className="text-xs text-gray-600 mb-1">Tổng tiền</p>
          <p className="text-2xl font-black text-transparent bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text">
            {totalPrice.toLocaleString()} VNĐ
          </p>
        </div>

        <div className="flex gap-2 text-xs text-gray-600">
          <div className="flex items-center gap-1.5">
            <FaCheck className="w-3 h-3 text-green-500" />
            <span>Miễn phí ship</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FaTruck className="w-3 h-3 text-blue-500" />
            <span>Giao nhanh</span>
          </div>
        </div>

        <Link
          to="/gio-hang"
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-xl hover:from-red-600 hover:to-red-700 active:scale-95 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
        >
          <FaShoppingBag className="w-4 h-4" />
          Xem giỏ hàng
        </Link>
      </div>
    </div>
  );
};

export default memo(CartPreview);
