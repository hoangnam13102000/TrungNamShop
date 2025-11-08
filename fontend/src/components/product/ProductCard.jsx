import { memo } from "react";
import { Link } from "react-router-dom";
import { getImageUrl } from "../../utils/helpers/getImageUrl";

const formatPrice = (price) => {
  if (!price) return "0 VNĐ";
  return parseFloat(price).toLocaleString("vi-VN") + " VNĐ";
};

const ProductCard = ({ product }) => {
  const newPrice = product.newPrice ?? product.price ?? 0;
  const oldPrice = product.oldPrice ?? null;
  const imageUrl = getImageUrl(product.primary_image?.image_path);
  const discountPercent = oldPrice && newPrice ? Math.round(((oldPrice - newPrice) / oldPrice) * 100) : null;
  
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden hover:border-red-400 hover:shadow-2xl transition-all duration-300 bg-white flex flex-col h-full group">
      {/* Discount Badge */}
      {discountPercent && (
        <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold z-10">
          -{discountPercent}%
        </div>
      )}

      <Link to={`/chi-tiet-san-pham/${product.id}`} className="flex flex-col flex-1 relative">
        {/* Image Container */}
        <div className="relative w-full bg-gray-50 overflow-hidden" style={{ paddingTop: "100%" }}>
          <img
            src={imageUrl}
            alt={product.name}
            className="absolute top-0 left-0 w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Text Content */}
        <div className="p-4 flex-1 flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 min-h-7 group-hover:text-red-600 transition-colors duration-200">
            {product.name}
          </h3>
          
          <div className="mt-auto flex flex-col gap-1">
            <div className="flex items-baseline gap-2">
              <p className="text-base font-bold text-red-600">
                {formatPrice(newPrice)}
              </p>
              {oldPrice && (
                <p className="text-xs text-gray-400 line-through">
                  {formatPrice(oldPrice)}
                </p>
              )}
            </div>
          </div>
        </div>
      </Link>

      {/* Add to Cart Button */}
      <div className="px-4 pb-4">
        <button className="w-full py-2.5 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 active:bg-red-800 transition-all duration-200 hover:shadow-lg active:scale-95 active:shadow-md">
          Thêm vào giỏ
        </button>
      </div>
    </div>
  );
};

export default memo(ProductCard);