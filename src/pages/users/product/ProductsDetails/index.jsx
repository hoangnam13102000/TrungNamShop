
import BreadCrumb from "../../theme/BreadCrumb";

import { memo } from "react";
import { FaChevronLeft, FaChevronRight, FaShoppingCart } from "react-icons/fa";

const ProductDetail = () => {
  const product = {
    name: "Điện thoại iPhone 13",
    image: "/iphone13.png", // thay bằng ảnh thật của bạn trong public hoặc assets
    options: [
      { ram: "4 GB", storage: "128 GB", color: "Xanh dương" },
      { ram: "4 GB", storage: "256 GB", color: "Đỏ" },
    ],
    oldPrice: 30000000,
    newPrice: 28500000,
    specs: {
      screen: "OLED, 6.1 inch, 60Hz, Super Retina XDR (1170 x 2532 Pixels)",
      os: "iOS 15",
      rearCamera: "12 MP",
      frontCamera: "12 MP",
      chip: "Apple A15 Bionic 6 nhân",
    },
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-3">
        <BreadCrumb name="Danh sách sản phẩm" />
        <h1 className="text-2xl font-bold mt-4">Danh sách sản phẩm</h1>
      </div>

      {/* Product Title */}
      <h1 className="text-2xl md:text-3xl font-semibold mb-4">{product.name}</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left: Image section */}
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full rounded-xl shadow-md"
          />
          {/* Image navigation buttons */}
          <button className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full shadow">
            <FaChevronLeft />
          </button>
          <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full shadow">
            <FaChevronRight />
          </button>

          {/* Thumbnails */}
          <div className="flex justify-center gap-2 mt-3">
            {[...Array(5)].map((_, i) => (
              <img
                key={i}
                src={product.image}
                className="w-14 h-14 border rounded-lg cursor-pointer hover:border-red-500 transition"
                alt="thumbnail"
              />
            ))}
          </div>
        </div>

        {/* Right: Info section */}
        <div>
          {/* Options */}
          <div className="border-b pb-4 mb-4">
            <h2 className="font-semibold mb-2">Lựa chọn phiên bản:</h2>
            {product.options.map((opt, index) => (
              <div
                key={index}
                className="border rounded-lg p-2 mb-2 cursor-pointer hover:border-red-500"
              >
                {opt.ram} / {opt.storage} - {opt.color}
              </div>
            ))}
          </div>

          {/* Price */}
          <div className="mb-4">
            <p className="text-gray-500 line-through">
              Giá cũ: {product.oldPrice.toLocaleString()}₫
            </p>
            <p className="text-red-600 font-bold text-xl">
              Giá giảm: {product.newPrice.toLocaleString()}₫
            </p>
            <p className="text-sm text-gray-500">Trả góp 0%</p>
          </div>

          {/* Add to cart button */}
          <button className="w-full bg-red-600 text-white py-3 rounded-lg flex justify-center items-center gap-2 hover:bg-red-700 transition">
            <FaShoppingCart /> Thêm sản phẩm vào giỏ
          </button>

          {/* Specs */}
          <div className="mt-6">
            <h2 className="font-semibold mb-2">
              Cấu hình {product.name}
            </h2>
            <table className="w-full text-sm border rounded-lg">
              <tbody>
                <tr className="border-b">
                  <td className="p-2 font-medium w-1/3">Màn hình:</td>
                  <td className="p-2">{product.specs.screen}</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-medium">Hệ điều hành:</td>
                  <td className="p-2">{product.specs.os}</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-medium">Camera sau:</td>
                  <td className="p-2">{product.specs.rearCamera}</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-medium">Camera trước:</td>
                  <td className="p-2">{product.specs.frontCamera}</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">Chip:</td>
                  <td className="p-2">{product.specs.chip}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(ProductDetail);
