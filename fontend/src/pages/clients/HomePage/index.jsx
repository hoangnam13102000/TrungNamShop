import { memo, useRef, useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../../../components/product/ProductCard";
import { useCRUDApi } from "../../../api/hooks/useCRUDApi";
import backgroundImage from "@banner/background-4.jpg";
import ChatWidget from "../../../components/Chats/ChatWidget"; 

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

  const availableProducts = useMemo(
    () => products.filter((product) => Number(product.status) === 1 || product.status === true),
    [products]
  );

  if (!availableProducts.length) {
    return (
      <div className="text-center py-10 text-gray-500">
        Hiện tại không có sản phẩm nào đang bán.
      </div>
    );
  }

  return (
    <div className="relative group">
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-gray-800 hover:text-white text-gray-700 rounded-full shadow-md w-10 h-10 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-all duration-200"
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
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-gray-800 hover:text-white text-gray-700 rounded-full shadow-md w-10 h-10 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-all duration-200"
      >
        ›
      </button>
    </div>
  );
};

const HomePage = () => {
  const { useGetAll } = useCRUDApi("products");
  const { data: products = [], isLoading } = useGetAll();

  const [topBrands, setTopBrands] = useState([]);

  useEffect(() => {
    if (products && products.length > 0) {
      const brandMap = {};
      products.forEach((product) => {
        const brand = product.brand || { id: 0, name: "Khác", image: null };
        const brandId = brand.id;
        if (!brandMap[brandId]) {
          brandMap[brandId] = { brand, products: [] };
        }
        brandMap[brandId].products.push(product);
      });

      const sortedBrands = Object.values(brandMap)
        .sort((a, b) => b.products.length - a.products.length)
        .slice(0, 2);

      setTopBrands(sortedBrands);
    }
  }, [products]);

  return (
    <div className="w-full relative">
      {/* Banner Section */}
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

            {!isLoading && <ProductCarousel products={products} />}

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

      {/* Brand Carousels */}
      {!isLoading && topBrands.length > 0 && (
        <div className="w-full bg-gradient-to-b from-gray-50 to-white py-12">
          <div className="container mx-auto px-4 space-y-12">
            {topBrands.map(({ brand, products }) => (
              <section key={brand.id} className="relative">
                <div className="mb-8 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {brand.image && (
                      <img
                        src={brand.image}
                        alt={brand.name}
                        className="h-12 object-contain"
                      />
                    )}
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900">{brand.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{products.length} sản phẩm</p>
                    </div>
                  </div>
                  <div className="hidden md:block flex-1 ml-6 h-0.5 bg-gradient-to-r from-gray-300 to-transparent"></div>
                </div>

                <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                  <ProductCarousel products={products} />
                </div>

                <div className="text-right mt-4">
                  <Link
                    to={`/danh-sach-san-pham?brands=${brand.id}`}
                    className="text-gray-600 hover:text-red-600 font-semibold text-sm transition-colors duration-200 inline-flex items-center gap-2"
                  >
                    Xem tất cả {brand.name}
                    <span>→</span>
                  </Link>
                </div>
              </section>
            ))}
          </div>
        </div>
      )}

      {/* Chat Widget */}
      <ChatWidget /> {/* tích hợp ChatWidget ở cuối homepage */}
    </div>
  );
};

export default memo(HomePage);
