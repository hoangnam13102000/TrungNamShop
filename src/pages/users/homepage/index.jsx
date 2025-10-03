import { memo } from "react";
import backgroundImage from "../../../assets/users/images/banner/background-4.jpg";

const HomePage = () => {
  const brands = [
    { id: 1, name: "Samsung", logo: "/src/assets/users/images/categories/logo-samsung.png", link: "/products/samsung" },
    { id: 2, name: "iPhone", logo: "/src/assets/users/images/categories/logo-iphone.png", link: "/products/iphone" },
    { id: 3, name: "Itel", logo: "/src/assets/users/images/categories/logo-itel.jpg", link: "/products/itel" },
    { id: 4, name: "Masstel", logo: "/src/assets/users/images/categories/logo-masstel.png", link: "/products/masstel" },
    { id: 5, name: "Mobell", logo: "/src/assets/users/images/categories/logo-mobell.jpg", link: "/products/mobell" },
    { id: 6, name: "Nokia", logo: "/src/assets/users/images/categories/logo-nokia.jpg", link: "/products/nokia" },
    { id: 7, name: "Oppo", logo: "/src/assets/users/images/categories/logo-oppo.jpg", link: "/products/oppo" },
    { id: 8, name: "Realme", logo: "/src/assets/users/images/categories/logo-realme.png", link: "/products/realme" },
    { id: 9, name: "Vivo", logo: "/src/assets/users/images/categories/logo-vivo.jpg", link: "/products/vivo" },
    { id: 10, name: "Xiaomi", logo: "/src/assets/users/images/categories/logo-xiaomi.png", link: "/products/xiaomi" },
  ];

  const products = [
    {
      id: 1,
      name: "iPhone 15 Pro Max",
      price: "29.990.000đ",
      originalPrice: "34.990.000đ",
      image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop",
      discount: "-14%",
      badge: "Trả góp 0%"
    },
    {
      id: 2,
      name: "Samsung Galaxy S24 Ultra",
      price: "26.990.000đ",
      originalPrice: "31.990.000đ",
      image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop",
      discount: "-16%",
      badge: "Giảm sốc"
    },
    {
      id: 3,
      name: "Xiaomi 14 Pro",
      price: "18.990.000đ",
      originalPrice: "22.990.000đ",
      image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop",
      discount: "-17%",
      badge: "Mới về"
    },
    {
      id: 4,
      name: "OPPO Find X7 Pro",
      price: "19.990.000đ",
      originalPrice: "24.990.000đ",
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop",
      discount: "-20%",
      badge: "Hot"
    },
    {
      id: 5,
      name: "Vivo V30 Pro",
      price: "12.990.000đ",
      originalPrice: "14.990.000đ",
      image: "https://images.unsplash.com/photo-1592286927505-67dff98e03c6?w=400&h=400&fit=crop",
      discount: "-13%",
      badge: "Trả góp 0%"
    },
    {
      id: 6,
      name: "Realme GT 5 Pro",
      price: "11.990.000đ",
      originalPrice: "13.990.000đ",
      image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400&h=400&fit=crop",
      discount: "-14%",
      badge: "Giảm giá"
    }
  ];

  const handleBrandClick = (link) => {
    console.log(`Chuyển đến: ${link}`);
  };

  const handleProductClick = (product) => {
    console.log(`Xem sản phẩm: ${product.name}`);
  };

  return (
    <div className="w-full">
      {/* Brand Categories Section */}
      <div className="w-full bg-gray-50 py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
              Thương Hiệu Nổi Bật
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              Khám phá các thương hiệu điện thoại hàng đầu
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {brands.map((brand) => (
              <button
                key={brand.id}
                onClick={() => handleBrandClick(brand.link)}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 flex items-center justify-center overflow-hidden group border border-gray-200 hover:border-blue-400 transform hover:scale-105 h-12"
              >
                <div className="w-full h-full px-4 flex items-center justify-center">
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="max-h-8 object-contain group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Section with Background */}
      <div 
        className="w-full py-12 sm:py-16 relative bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${backgroundImage})`
        }}
      >
        <div className="container mx-auto px-4">
          {/* Background Container */}
          <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 border-8 border-red-600">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                Sản Phẩm Bán Chạy
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">
                Những sản phẩm được ưa chuộng nhất
              </p>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleProductClick(product)}
                  className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer group border border-gray-100 hover:border-blue-400 transform hover:scale-105"
                >
                  {/* Image Container */}
                  <div className="relative aspect-square overflow-hidden bg-gray-50">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md">
                        {product.discount}
                      </span>
                      <span className="bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-md">
                        {product.badge}
                      </span>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-3">
                    <h3 className="text-sm font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors min-h-[40px]">
                      {product.name}
                    </h3>
                    <div className="space-y-1">
                      <div className="text-red-600 text-lg font-bold">
                        {product.price}
                      </div>
                      <div className="text-gray-400 text-xs line-through">
                        {product.originalPrice}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* View All Button */}
            <div className="text-center mt-8">
              <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-semibold text-sm sm:text-base transition-all duration-200 hover:shadow-lg transform hover:scale-105">
                Xem Tất Cả Sản Phẩm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(HomePage);