import { memo } from "react";

const ProductInfo = ({ product, specs = [], showAddToCart, onShowSpecs, onAddToCart }) => {
  const previewSpecs = specs.slice(0, 4);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
          {product.name}
        </h1>
        <p className="text-gray-500 mt-2">Mã sản phẩm: {product.id}</p>
      </div>

      {product.description && (
        <p className="text-gray-700 leading-relaxed">{product.description}</p>
      )}

      {/* Giá bán */}
      {product.price && (
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6">
          <p className="text-gray-600 text-sm mb-2">Giá bán</p>
          <p className="text-4xl font-bold text-blue-600">
            {Number(product.price).toLocaleString()}{" "}
            <span className="text-lg ml-2">VNĐ</span>
          </p>
        </div>
      )}

      {/* Thông số nổi bật */}
      {previewSpecs.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900 text-sm">
            Thông số nổi bật:
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {previewSpecs.map((spec, idx) => {
              const firstValid = spec.details.find(
                (d) => d.value && d.value !== "-"
              );
              return (
                <div
                  key={idx}
                  className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-lg border border-blue-200"
                >
                  <p className="text-xs text-blue-700 font-medium">
                    {spec.category}
                  </p>
                  <p className="text-sm text-gray-900 font-semibold mt-1">
                    {firstValid
                      ? String(firstValid.value).substring(0, 20) +
                        (String(firstValid.value).length > 20 ? "..." : "")
                      : "-"}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/*  Into Cart */}
      {showAddToCart && (
        <button
          onClick={onAddToCart} 
          className="w-full mt-4 bg-gradient-to-r from-blue-600 to-blue-700 
                     text-white px-6 py-3 rounded-xl hover:shadow-lg 
                     transition-all font-semibold"
        >
          Thêm vào giỏ hàng
        </button>
      )}

      {/* View Productdetail */}
      {specs.length > 0 && (
        <button
          onClick={onShowSpecs}
          className="w-full mt-2 bg-gradient-to-r from-indigo-600 to-indigo-700 
                     text-white px-6 py-3 rounded-xl hover:shadow-lg 
                     transition-all font-semibold"
        >
          Xem toàn bộ thông số kỹ thuật
        </button>
      )}
    </div>
  );
};

export default memo(ProductInfo);
