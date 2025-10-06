import { memo, useRef } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../../../components/ProductCard";
import backgroundImage from "@banner/background-4.jpg";

const PRODUCTS = [
  {
    id: 1,
    name: "iPhone 15 Pro Max",
    newPrice: 29990000,
    oldPrice: 34990000,
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop",
  },
  {
    id: 2,
    name: "Samsung Galaxy S24 Ultra",
    newPrice: 26990000,
    oldPrice: 31990000,
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop",
  },
  {
    id: 3,
    name: "Xiaomi 14 Pro",
    newPrice: 18990000,
    oldPrice: 22990000,
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop",
  },
  {
    id: 4,
    name: "OPPO Find X7 Pro",
    newPrice: 19990000,
    oldPrice: 24990000,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop",
  },
  {
    id: 5,
    name: "Vivo V30 Pro",
    newPrice: 12990000,
    oldPrice: 14990000,
    image: "https://images.unsplash.com/photo-1592286927505-67dff98e03c6?w=400&h=400&fit=crop",
  },
  {
    id: 6,
    name: "Realme GT 5 Pro",
    newPrice: 11990000,
    oldPrice: 13990000,
    image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400&h=400&fit=crop",
  },
];

/* ================== Carousel Component ================== */
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

  return (
    <div className="relative">
      {/* Nút điều hướng */}
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
        {products.map((product) => (
          <div
            key={product.id}
            className="min-w-[250px] snap-center flex-shrink-0"
          >
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

/* ================== HomePage ================== */
const HomePage = () => {
  return (
    <div className="w-full">
      {/* ======= Sản phẩm bán chạy ======= */}
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
              <p className="text-gray-600 mt-2">
                Những sản phẩm được ưa chuộng nhất
              </p>
            </div>

            <ProductCarousel products={PRODUCTS} />

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
