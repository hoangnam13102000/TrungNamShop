import { useRef, useMemo, useEffect, useState } from "react";
import ProductCard from "../product/ProductCard";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const ProductCarousel = ({ products }) => {
  const scrollRef = useRef();
  const [autoScroll, setAutoScroll] = useState(true);
  const autoScrollIntervalRef = useRef(null);

  const availableProducts = useMemo(
    () =>
      products.filter(
        (product) =>
          product &&
          (Number(product.is_active ?? product.status) === 1 ||
            product.status === true)
      ),
    [products]
  );

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const scrollAmount = window.innerWidth < 640 ? 180 : window.innerWidth < 1024 ? 240 : 320;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const startAutoScroll = () => {
    if (autoScrollIntervalRef.current) clearInterval(autoScrollIntervalRef.current);
    
    autoScrollIntervalRef.current = setInterval(() => {
      scroll("right");
    }, 4000);
  };

  useEffect(() => {
    if (autoScroll && availableProducts.length > 0) {
      startAutoScroll();
    }

    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
      }
    };
  }, [autoScroll, availableProducts.length]);

  const handleMouseEnter = () => {
    setAutoScroll(false);
    if (autoScrollIntervalRef.current) clearInterval(autoScrollIntervalRef.current);
  };

  const handleMouseLeave = () => {
    setAutoScroll(true);
  };

  if (!availableProducts.length) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-lg font-light">Hiện tại không có sản phẩm nào đang bán.</p>
      </div>
    );
  }

  return (
    <div 
      className="relative group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Left Button */}
      <button
        onClick={() => {
          scroll("left");
          setAutoScroll(false);
        }}
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-gradient-to-r from-black/60 to-black/0 hover:from-black/80 hover:to-black/10 text-white rounded-r-lg shadow-xl w-10 h-12 sm:w-12 sm:h-14 lg:w-14 lg:h-16 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95"
      >
        <FaChevronLeft size={16} className="sm:text-xl lg:text-2xl" />
      </button>

      {/* Main Carousel Container */}
      <div className="relative overflow-hidden rounded-lg sm:rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 p-1 sm:p-2">
        {/* Scrollable Content */}
        <div
          ref={scrollRef}
          className="flex gap-2 sm:gap-3 md:gap-4 overflow-x-auto scroll-smooth scrollbar-hide snap-x snap-mandatory px-2"
        >
          {availableProducts.map((product) => (
            <div
              key={product.id}
              className="min-w-[140px] sm:min-w-[180px] md:min-w-[200px] lg:min-w-[240px] snap-center flex-shrink-0 transition-transform duration-300 hover:scale-105"
            >
              <div className="rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-shadow duration-300 bg-white h-full">
                <ProductCard product={product} />
              </div>
            </div>
          ))}
        </div>

        {/* Fade Overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-4 sm:w-6 md:w-8 bg-gradient-to-r from-gray-100 to-transparent pointer-events-none rounded-l-lg sm:rounded-l-xl z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-4 sm:w-6 md:w-8 bg-gradient-to-l from-gray-100 to-transparent pointer-events-none rounded-r-lg sm:rounded-r-xl z-10" />
      </div>

      {/* Right Button */}
      <button
        onClick={() => {
          scroll("right");
          setAutoScroll(false);
        }}
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-gradient-to-l from-black/60 to-black/0 hover:from-black/80 hover:to-black/10 text-white rounded-l-lg shadow-xl w-10 h-12 sm:w-12 sm:h-14 lg:w-14 lg:h-16 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95"
      >
        <FaChevronRight size={16} className="sm:text-xl lg:text-2xl" />
      </button>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default ProductCarousel;