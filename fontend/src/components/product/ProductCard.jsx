import { memo } from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-lg transition bg-white flex flex-col h-full">
      <Link to={`/product/${product.id}`} className="flex flex-col flex-1">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-56 object-cover"
        />
        <div className="p-3 flex-1 flex flex-col">
          <h3 className="text-base font-semibold line-clamp-2 mb-2 min-h-[3rem]">
            {product.name}
          </h3>
          <div className="mt-auto">
            <p className="text-gray-500 text-sm line-through">
              {product.oldPrice.toLocaleString()}₫
            </p>
            <p className="text-red-600 font-bold text-lg">
              {product.newPrice.toLocaleString()}₫
            </p>
          </div>
        </div>
      </Link>
      <div className="px-3 pb-3">
        <button className="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
          Thêm vào giỏ
        </button>
      </div>
    </div>
  );
};

export default memo(ProductCard);