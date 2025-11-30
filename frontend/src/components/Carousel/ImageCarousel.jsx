import { memo, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { getImageUrl } from "../../utils/helpers/getImageUrl";

/**
 * Carousel hiển thị ảnh sản phẩm chi tiết.
 * @param {Array} images - Mảng đường dẫn hoặc object có image_path
 */
const ImageCarousel = ({ images = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const handlePrev = () =>
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const handleNext = () =>
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  const currentImage =
    typeof images[currentIndex] === "string"
      ? images[currentIndex]
      : getImageUrl(images[currentIndex].image_path);

  return (
    <div className="relative flex justify-center items-center w-full">
      <button
        onClick={handlePrev}
        className="absolute left-2 bg-white p-2 rounded-full shadow hover:bg-gray-100 transition"
      >
        <FaChevronLeft />
      </button>

      <img
        src={currentImage}
        alt="Ảnh sản phẩm"
        className="w-[400px] h-[400px] object-contain rounded-2xl shadow"
      />

      <button
        onClick={handleNext}
        className="absolute right-2 bg-white p-2 rounded-full shadow hover:bg-gray-100 transition"
      >
        <FaChevronRight />
      </button>

      {/* Nhỏ thumbnails */}
      <div className="flex justify-center gap-2 mt-3 flex-wrap">
        {images.map((img, i) => {
          const src = typeof img === "string" ? img : getImageUrl(img.image_path);
          return (
            <img
              key={i}
              src={src}
              onClick={() => setCurrentIndex(i)}
              className={`w-16 h-16 object-cover rounded-lg cursor-pointer border-2 transition ${
                i === currentIndex ? "border-blue-500" : "border-transparent"
              }`}
              alt={`Ảnh ${i + 1}`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default memo(ImageCarousel);
