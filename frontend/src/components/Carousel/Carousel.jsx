import { memo, useRef } from "react";
import { motion } from "framer-motion";
import ProductCard from "../../product/ProductCard";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Carousel = ({ title = "Sản phẩm đề xuất", products = [] }) => {
  const carouselRef = useRef(null);

  const scroll = (direction) => {
    const container = carouselRef.current;
    if (!container) return;
    const scrollAmount = direction === "left" ? -container.offsetWidth / 1.5 : container.offsetWidth / 1.5;
    container.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <section className="container mx-auto px-4 py-8">
      {/* Title */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{title}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="p-2 bg-gray-200 hover:bg-red-500 hover:text-white rounded-full transition"
          >
            <FaChevronLeft />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-2 bg-gray-200 hover:bg-red-500 hover:text-white rounded-full transition"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

      {/*Product List */}
      <motion.div
        ref={carouselRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
        whileTap={{ cursor: "grabbing" }}
      >
        {products.map((product) => (
          <motion.div
            key={product.id}
            className="min-w-[200px] sm:min-w-[240px] md:min-w-[260px] flex-shrink-0"
            whileHover={{ scale: 1.03 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default memo(Carousel);
