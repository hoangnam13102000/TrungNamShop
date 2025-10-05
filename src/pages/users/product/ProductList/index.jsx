import { memo } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../../components/ProductCard";

const PRODUCTS = [
  {
    id: 1,
    brand: "iphone",
    name: "iPhone 13 128GB - Xanh dương",
    image: "/iphone13.png",
    oldPrice: 30000000,
    newPrice: 28500000,
  },
  {
    id: 2,
    brand: "iphone",
    name: "iPhone 14 Pro 256GB - Đen",
    image: "/iphone13.png",
    oldPrice: 35000000,
    newPrice: 32000000,
  },
  {
    id: 3,
    brand: "samsung",
    name: "Samsung Galaxy S23 Ultra 256GB",
    image: "/samsung.png",
    oldPrice: 28000000,
    newPrice: 25000000,
  },
  {
    id: 4,
    brand: "xiaomi",
    name: "Xiaomi 13T Pro 12GB/512GB",
    image: "/xiaomi.png",
    oldPrice: 18000000,
    newPrice: 16000000,
  },
];

const BRANDS = {
  iphone: "iPhone",
  samsung: "Samsung",
  xiaomi: "Xiaomi",
};

const ProductList = () => {
  const { brand } = useParams(); // lấy brand từ URL
  const filteredProducts = PRODUCTS.filter(
    (item) => item.brand === brand.toLowerCase()
  );
  const brandName = BRANDS[brand] || "Sản phẩm";

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-4">
        <span className="hover:text-red-600 cursor-pointer">Trang chủ</span> &gt;{" "}
        <span className="text-red-600">{brandName}</span>
      </div>

      {/* Title */}
      <h1 className="text-2xl md:text-3xl font-bold mb-6">
        Danh sách sản phẩm {brandName}
      </h1>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-10">
          Không có sản phẩm nào thuộc thương hiệu này.
        </div>
      )}
    </div>
  );
};

export default memo(ProductList);
