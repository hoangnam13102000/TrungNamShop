import { memo, useState } from "react";
import { Link } from "react-router-dom";
import { getImageUrl } from "../../utils/helpers/getImageUrl";
import DynamicDialog from "../../components/formAndDialog/DynamicDialog";

const formatPrice = (price) => {
  if (!price) return "0 VNĐ";
  return parseFloat(price).toLocaleString("vi-VN") + " VNĐ";
};

const ProductCard = ({ product }) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const oldPrice = Number(product.price ?? 0);
  const newPrice = Number(product.final_price ?? oldPrice);
  const imageUrl = getImageUrl(product.primary_image?.image_path); 
  const discountPercent = oldPrice > newPrice
    ? Math.round(((oldPrice - newPrice) / oldPrice) * 100)
    : null;

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find(item => item.id === product.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      // Lưu primary_image là string, không phải object
      const itemToAdd = {
        id: product.id,
        name: product.name,
        price: product.price,
        final_price: product.final_price,
        quantity: 1,
        primary_image: product.primary_image?.image_path || null,
        brand: product.brand || null,
      };
      cart.push(itemToAdd);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    setDialogOpen(true);
  };

  return (
    <>
      <div className="border border-gray-200 rounded-xl overflow-hidden hover:border-red-400 hover:shadow-2xl transition-all duration-300 bg-white flex flex-col h-full group relative">
        {discountPercent && (
          <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold z-10 shadow-lg">
            -{discountPercent}%
          </div>
        )}

        <Link to={`/chi-tiet-san-pham/${product.id}`} className="flex flex-col flex-1 relative">
          <div className="relative w-full bg-gray-50 overflow-hidden" style={{ paddingTop: "100%" }}>
            <img
              src={imageUrl}
              alt={product.name}
              className="absolute top-0 left-0 w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          <div className="p-4 flex-1 flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 min-h-7 group-hover:text-red-600 transition-colors duration-200">
              {product.name}
            </h3>

            <div className="mt-auto flex flex-col gap-2">
              {/* Giá mới nổi bật */}
              <div className="flex items-baseline gap-2">
                <p className="text-lg font-bold text-red-600">{formatPrice(newPrice)}</p>
                {discountPercent && (
                  <span className="inline-flex items-center gap-1 text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-semibold">
                    {discountPercent}%
                  </span>
                )}
              </div>

              {/* Giá cũ và tiết kiệm */}
              {discountPercent && (
                <div className="flex items-center gap-2">
                  <p className="text-xs text-gray-400 line-through">{formatPrice(oldPrice)}</p>
                  <p className="text-xs text-green-600 font-semibold">
                    Tiết kiệm: {formatPrice(oldPrice - newPrice)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </Link>

        <div className="px-4 pb-4">
          <button
            onClick={handleAddToCart}
            className="w-full py-2.5 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 active:bg-red-800 transition-all duration-200 hover:shadow-lg active:scale-95 active:shadow-md"
          >
            Thêm vào giỏ
          </button>
        </div>
      </div>

      <DynamicDialog
        open={dialogOpen}
        mode="success"
        title="Thành công!"
        message="Sản phẩm đã được thêm vào giỏ hàng."
        onClose={() => setDialogOpen(false)}
        closeText="Đóng"
      />
    </>
  );
};

export default memo(ProductCard);
