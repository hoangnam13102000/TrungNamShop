import { memo, useState } from "react";
import { FaStar, FaFire, FaShoppingCart, FaCheck, FaTruck } from "react-icons/fa";
import DynamicDialog from "../../components/formAndDialog/DynamicDialog";
// import { getImageUrl } from "../../utils/helpers/getImageUrl";

const ProductInfo = ({ product, specs = [], showAddToCart, onShowSpecs }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const previewSpecs = specs.slice(0, 4);

  const finalPrice = product?.final_price
    ? Number(product.final_price)
    : null;

  const originalPrice = product?.price
    ? Number(product.price)
    : null;

  const discountPercent = originalPrice && finalPrice
    ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100)
    : null;

  // Thêm sản phẩm vào giỏ hàng
  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find(item => item.id === product.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      const itemToAdd = {
        id: product.id,
        name: product.name,
        price: product.price,
        final_price: product.final_price,
        quantity: 1,
        primary_image: product.primary_image?.image_path || null, // chỉ lấy đường dẫn
        brand: product.brand || null,
      };
      cart.push(itemToAdd);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    setDialogOpen(true); // mở dialog thành công
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-3">
          {product.name}
        </h1>
        <p className="text-gray-500">
          Mã SP: <span className="font-mono text-gray-700">{product.id}</span>
        </p>
      </div>

      {product.description && (
        <p className="text-gray-700 leading-relaxed text-base">{product.description}</p>
      )}

      {/* Pricing Section */}
      {finalPrice && (
        <div className="relative">
          {/* Discount Badge */}
          {discountPercent && (
            <div className="absolute -top-4 -right-2 z-10">
              <div className="relative inline-flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-full blur-lg opacity-75"></div>
                <div className="relative bg-gradient-to-r from-red-500 to-orange-500 text-white px-5 py-2 rounded-full font-bold text-lg shadow-lg flex items-center gap-2">
                  <FaFire className="w-4 h-4" />
                  -{discountPercent}%
                </div>
              </div>
            </div>
          )}

          {/* Price Card */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 text-white border border-slate-700 shadow-2xl">
            <p className="text-slate-400 text-sm font-medium mb-3 uppercase tracking-widest">Giá bán</p>
            
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-6xl font-black bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                {finalPrice.toLocaleString()}
              </span>
              <span className="text-2xl font-bold text-slate-300">VNĐ</span>
            </div>

            {originalPrice && originalPrice !== finalPrice && (
              <p className="text-slate-400 line-through text-lg">
                {originalPrice.toLocaleString()} VNĐ
              </p>
            )}

            {/* Info Row */}
            <div className="flex gap-4 mt-6 pt-6 border-t border-slate-700">
              <div className="flex items-center gap-2 text-slate-300">
                <FaTruck className="w-4 h-4 text-blue-400" />
                <span className="text-xs">Giao hàng miễn phí</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <FaCheck className="w-4 h-4 text-green-400" />
                <span className="text-xs">Đã kiểm chứng</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Featured Specs */}
      {previewSpecs.length > 0 && (
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <FaStar className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Thông số nổi bật</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {previewSpecs.map((spec, idx) => {
              const firstValid = spec.details.find(
                (d) => d.value && d.value !== "-"
              );
              return (
                <div
                  key={idx}
                  className="group relative overflow-hidden rounded-xl bg-white border-2 border-gray-100 p-4 transition-all duration-300 hover:border-blue-400 hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-blue-50 to-transparent transition-opacity duration-300"></div>
                  <div className="relative">
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">
                      {spec.category}
                    </p>
                    <p className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {firstValid
                        ? String(firstValid.value).substring(0, 25) +
                          (String(firstValid.value).length > 25 ? "..." : "")
                        : "-"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        {/* Add to Cart Button */}
        {showAddToCart && (
          <button
            onClick={handleAddToCart}
            className="w-full group relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 font-bold text-white shadow-lg transition-all duration-300 hover:shadow-2xl active:scale-95"
          >
            <div className="relative flex items-center justify-center gap-3">
              <FaShoppingCart className="w-5 h-5" />
              Thêm vào giỏ hàng
            </div>
          </button>
        )}

        {/* View Specs Button */}
        {specs.length > 0 && (
          <button
            onClick={onShowSpecs}
            className="w-full group relative overflow-hidden rounded-xl border-2 border-gray-300 bg-white px-6 py-4 font-bold text-gray-900 transition-all duration-300 hover:border-blue-500 hover:shadow-lg active:scale-95"
          >
            <div className="relative flex items-center justify-center gap-2">
              Xem toàn bộ thông số kỹ thuật
            </div>
          </button>
        )}
      </div>

      {/* Dialog Thành Công */}
      <DynamicDialog
        open={dialogOpen}
        mode="success"
        title="Thành công!"
        message="Sản phẩm đã được thêm vào giỏ hàng."
        onClose={() => setDialogOpen(false)}
        closeText="Đóng"
      />
    </div>
  );
};

export default memo(ProductInfo);
