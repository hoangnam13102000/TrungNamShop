import { memo, useRef } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../../../components/product/ProductCard";
import { useProducts } from "../../../api/product/products";
import backgroundImage from "@banner/background-4.jpg";

const ProductCarousel = ({ products }) => {
  const scrollRef = useRef();

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const scrollAmount = 320;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  // Lọc sản phẩm đang bán
  const availableProducts = products.filter(product => product.status === true);

  if (availableProducts.length === false) {
    return (
      <div className="text-center py-10 text-gray-500">
        Hiện tại không có sản phẩm nào đang bán.
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-red-500 hover:text-white text-gray-700 rounded-full shadow-md w-10 h-10 flex items-center justify-center z-10"
      >
        ‹
      </button>

      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-4 scroll-smooth scrollbar-hide snap-x snap-mandatory px-10"
      >
        {availableProducts.map((product) => (
          <div key={product.id} className="min-w-[250px] snap-center flex-shrink-0">
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-red-500 hover:text-white text-gray-700 rounded-full shadow-md w-10 h-10 flex items-center justify-center z-10"
      >
        ›
      </button>
    </div>
  );
};

const HomePage = () => {
  const { data: products = [] } = useProducts();

  return (
    <div className="w-full">
      <section
        className="w-full py-16 relative bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border-4 md:border-8 border-red-600">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                Sản Phẩm Bán Chạy
              </h2>
              <p className="text-gray-600 mt-2">Những sản phẩm được ưa chuộng nhất</p>
            </div>

            <ProductCarousel products={products} />

            <div className="text-center mt-10">
              <Link
                to="/danh-sach-san-pham"
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 inline-block shadow-lg hover:shadow-xl"
              >
                Xem Tất Cả Sản Phẩm
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default memo(HomePage);
