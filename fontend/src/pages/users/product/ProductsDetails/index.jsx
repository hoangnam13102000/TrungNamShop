import { memo, useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaShoppingCart,
  FaStar,
  FaRegStar,
} from "react-icons/fa";
import BreadCrumb from "../../theme/BreadCrumb";
import Carousel from "../../../../components/product/Carousel";

// Import ảnh mẫu (ví dụ OPPO Reno6)
import oppo6_1 from "@products/oppo_reno6_z_5g_black.jpg";
import oppo6_2 from "@products/oppo-reno6-z-5g-den-1-org.jpg";
import oppo6_3 from "@products/oppo-reno6-z-5g-den-2-org.jpg";
import oppo6_4 from "@products/oppo-reno6-z-5g-den-4-org.jpg";
import oppo6_5 from "@products/oppo-reno6-z-5g-den-5-org.jpg";

const ProductDetail = () => {
  const product = {
    id: 101,
    name: "Điện thoại iPhone 13",
    images: [oppo6_1, oppo6_2, oppo6_3, oppo6_4, oppo6_5],
    options: [
      { ram: "4 GB", storage: "128 GB", color: "Xanh dương" },
      { ram: "4 GB", storage: "256 GB", color: "Đỏ" },
    ],
    oldPrice: 30000000,
    newPrice: 28500000,
    specs: {
      screen: "OLED, 6.1 inch, Super Retina XDR (1170 x 2532 Pixels)",
      os: "iOS 15",
      rearCamera: "12 MP",
      frontCamera: "12 MP",
      chip: "Apple A15 Bionic 6 nhân",
    },
    description: `
iPhone 13 mang đến sự kết hợp hoàn hảo giữa hiệu năng mạnh mẽ và thiết kế tinh tế. 
Máy được trang bị chip Apple A15 Bionic mạnh mẽ, mang đến trải nghiệm mượt mà trong mọi tác vụ, từ chơi game đến quay video 4K.

Màn hình Super Retina XDR 6.1 inch hiển thị hình ảnh sắc nét, rực rỡ, hỗ trợ HDR10 và Dolby Vision. 
Cụm camera kép 12MP được cải tiến cho khả năng chụp ảnh thiếu sáng tốt hơn, cùng chế độ Cinematic Mode giúp quay video chuyên nghiệp.

Với dung lượng pin lớn hơn và tối ưu hệ điều hành iOS 15, iPhone 13 có thể hoạt động suốt cả ngày dài. 
Thiết bị còn hỗ trợ 5G, Face ID, và khả năng chống nước IP68 — giúp bạn yên tâm sử dụng trong mọi tình huống.`,
  };

  const [activeImage, setActiveImage] = useState(product.images[0]);

  // --- Rating & Comments ---
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([
    { id: 1, name: "Nguyễn Văn A", stars: 5, content: "Sản phẩm rất tốt, pin khỏe!", date: "2025-10-02" },
    { id: 2, name: "Trần Thị B", stars: 4, content: "Giao hàng nhanh, dùng mượt.", date: "2025-10-03" },
  ]);

  const handlePrevImage = () => {
    const currentIndex = product.images.indexOf(activeImage);
    const newIndex = (currentIndex - 1 + product.images.length) % product.images.length;
    setActiveImage(product.images[newIndex]);
  };

  const handleNextImage = () => {
    const currentIndex = product.images.indexOf(activeImage);
    const newIndex = (currentIndex + 1) % product.images.length;
    setActiveImage(product.images[newIndex]);
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!comment.trim() || rating === 0) return;

    const newReview = {
      id: Date.now(),
      name: "Khách hàng ẩn danh",
      stars: rating,
      content: comment.trim(),
      date: new Date().toISOString().split("T")[0],
    };

    setReviews([newReview, ...reviews]);
    setComment("");
    setRating(0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <div className="mb-6 text-sm text-gray-500">
        <BreadCrumb name="Danh sách sản phẩm" />
        <h1 className="text-2xl font-bold mt-3 text-gray-800">Chi tiết sản phẩm</h1>
      </div>

      {/* Nội dung chính */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* --- Ảnh sản phẩm --- */}
        <div className="relative flex flex-col items-center">
          <div className="w-full h-[360px] sm:h-[420px] md:h-[480px] bg-gray-50 rounded-xl shadow-md flex items-center justify-center overflow-hidden">
            <img
              src={activeImage}
              alt={product.name}
              className="object-contain w-full h-full"
            />
          </div>

          {/* Nút điều hướng ảnh */}
          <button
            onClick={handlePrevImage}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow hover:bg-red-500 hover:text-white transition"
          >
            <FaChevronLeft />
          </button>
          <button
            onClick={handleNextImage}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow hover:bg-red-500 hover:text-white transition"
          >
            <FaChevronRight />
          </button>

          {/* Thumbnail ảnh */}
          <div className="flex justify-center flex-wrap gap-2 mt-3">
            {product.images.map((img, i) => (
              <img
                key={i}
                src={img}
                onClick={() => setActiveImage(img)}
                className={`w-16 h-16 sm:w-20 sm:h-20 border rounded-lg object-cover cursor-pointer transition ${
                  img === activeImage
                    ? "border-red-500 ring-2 ring-red-500"
                    : "hover:border-red-400"
                }`}
                alt={`thumbnail-${i}`}
              />
            ))}
          </div>
        </div>

        {/* --- Thông tin sản phẩm --- */}
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-900">
            {product.name}
          </h1>

          {/* Lựa chọn phiên bản */}
          <div className="border-b pb-4 mb-4">
            <h2 className="font-semibold mb-2 text-gray-700">Lựa chọn phiên bản:</h2>
            {product.options.map((opt, i) => (
              <div
                key={i}
                className="border rounded-lg p-2 mb-2 cursor-pointer hover:border-red-500 transition"
              >
                {opt.ram} / {opt.storage} - {opt.color}
              </div>
            ))}
          </div>

          {/* Giá */}
          <div className="mb-5">
            <p className="text-gray-500 line-through">
              Giá cũ: {product.oldPrice.toLocaleString()}₫
            </p>
            <p className="text-red-600 font-bold text-2xl">
              Giá giảm: {product.newPrice.toLocaleString()}₫
            </p>
            <p className="text-sm text-gray-500">Trả góp 0%</p>
          </div>

          {/* Nút mua */}
          <button className="w-full bg-red-600 text-white py-3 rounded-lg flex justify-center items-center gap-2 hover:bg-red-700 transition">
            <FaShoppingCart /> Thêm sản phẩm vào giỏ
          </button>

          {/* Cấu hình chi tiết */}
          <div className="mt-6">
            <h2 className="font-semibold mb-2 text-gray-800">
              Cấu hình {product.name}
            </h2>
            <table className="w-full text-sm border rounded-lg overflow-hidden">
              <tbody>
                {Object.entries(product.specs).map(([key, value]) => (
                  <tr key={key} className="border-b">
                    <td className="p-2 font-medium capitalize w-1/3 bg-gray-50">
                      {key.replace(/([A-Z])/g, " $1").trim()}:
                    </td>
                    <td className="p-2">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- Mô tả chi tiết --- */}
      <div className="mt-10 bg-gray-50 rounded-2xl p-6 shadow-inner border border-gray-200">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Chi tiết sản phẩm</h2>
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
          {product.description}
        </p>
      </div>

      {/* --- Đánh giá & Bình luận --- */}
      <div className="mt-10 bg-white rounded-2xl p-6 shadow-md border border-gray-200">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Đánh giá & Bình luận
        </h2>

        {/* Form đánh giá */}
        <form onSubmit={handleSubmitReview} className="mb-6">
          <div className="mb-3 flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) =>
              (hoverRating || rating) >= star ? (
                <FaStar
                  key={star}
                  className="text-yellow-400 text-xl cursor-pointer"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                />
              ) : (
                <FaRegStar
                  key={star}
                  className="text-gray-400 text-xl cursor-pointer"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                />
              )
            )}
            <span className="ml-2 text-sm text-gray-600">
              {rating ? `${rating} sao` : "Chọn số sao đánh giá"}
            </span>
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows="3"
            className="w-full border rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-red-400"
            placeholder="Viết bình luận của bạn..."
          ></textarea>

          <button
            type="submit"
            className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Gửi đánh giá
          </button>
        </form>

        {/* Danh sách bình luận */}
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-gray-500 text-sm italic">Chưa có bình luận nào.</p>
          ) : (
            reviews.map((r) => (
              <div
                key={r.id}
                className="border rounded-lg p-3 bg-gray-50 hover:bg-gray-100 transition"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-gray-800">{r.name}</span>
                  <span className="text-xs text-gray-500">{r.date}</span>
                </div>
                <div className="flex mb-1">
                  {[...Array(5)].map((_, i) =>
                    i < r.stars ? (
                      <FaStar key={i} className="text-yellow-400 text-sm" />
                    ) : (
                      <FaRegStar key={i} className="text-gray-400 text-sm" />
                    )
                  )}
                </div>
                <p className="text-gray-700 text-sm">{r.content}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* --- Carousel sản phẩm tương tự --- */}
      <Carousel
        title="Sản phẩm tương tự"
        products={[
          { id: 1, name: "iPhone 14 Pro Max", image: "/iphone14.png", oldPrice: 35000000, newPrice: 32500000 },
          { id: 2, name: "Samsung Galaxy S23 Ultra", image: "/s23ultra.png", oldPrice: 32000000, newPrice: 29800000 },
          { id: 3, name: "Xiaomi 14", image: "/xiaomi14.png", oldPrice: 18000000, newPrice: 16500000 },
          { id: 4, name: "OPPO Reno10", image: "/reno10.png", oldPrice: 12000000, newPrice: 10900000 },
          { id: 5, name: "iPhone 13 Mini", image: "/iphone13mini.png", oldPrice: 20000000, newPrice: 18500000 },
        ]}
      />
    </div>
  );
};

export default memo(ProductDetail);
