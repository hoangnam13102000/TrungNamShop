import { memo } from "react";


// import banner images
import backgroundImage from "@banner/background-4.jpg";


// import categories brand images

import logoSamsung from "@categories/logo-samsung.png";
import logoIphone from "@categories/logo-iphone.png";
import logoItel from "@categories/logo-itel.jpg";
import logoMasstel from "@categories/logo-masstel.png";
import logoMobell from "@categories/logo-mobell.jpg";
import logoNokia from "@categories/logo-nokia.jpg";
import logoOppo from "@categories/logo-oppo.jpg";
import logoRealme from "@categories/logo-realme.png";
import logoVivo from "@categories/logo-vivo.jpg";
import logoXiaomi from "@categories/logo-xiaomi.png";


/* ================== Constants ================== */
const BRANDS = [
  { id: 1, name: "Samsung", logo: logoSamsung, link: "/products/samsung" },
  { id: 2, name: "iPhone", logo: logoIphone, link: "/products/iphone" },
  { id: 3, name: "Itel", logo: logoItel, link: "/products/itel" },
  { id: 4, name: "Masstel", logo: logoMasstel, link: "/products/masstel" },
  { id: 5, name: "Mobell", logo: logoMobell, link: "/products/mobell" },
  { id: 6, name: "Nokia", logo: logoNokia, link: "/products/nokia" },
  { id: 7, name: "Oppo", logo: logoOppo, link: "/products/oppo" },
  { id: 8, name: "Realme", logo: logoRealme, link: "/products/realme" },
  { id: 9, name: "Vivo", logo: logoVivo, link: "/products/vivo" },
  { id: 10, name: "Xiaomi", logo: logoXiaomi, link: "/products/xiaomi" },
];

const PRODUCTS = [
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



/* ================== Component ================== */
const HomePage = () => {
  const handleBrandClick = (link) => console.log(`Chuyển đến: ${link}`);
  const handleProductClick = (product) => console.log(`Xem sản phẩm: ${product.name}`);

  return (
    <div className="w-full">
      {/* ======= Brands Section ======= */}
      <section className="w-full bg-gray-50 py-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Thương Hiệu Nổi Bật</h2>
            <p className="text-gray-600">Khám phá các thương hiệu điện thoại hàng đầu</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {BRANDS.map((brand) => (
              <button
                key={brand.id}
                onClick={() => handleBrandClick(brand.link)}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition duration-300 flex items-center justify-center border border-gray-200 hover:border-blue-400 transform hover:scale-105 h-14"
              >
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="max-h-8 object-contain group-hover:scale-110 transition-transform"
                />
              </button>
            ))}
          </div>
        </div>
      </section>
      {/* ======= Products Section ======= */}
      <section
        className="w-full py-16 relative bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 border-8 border-red-600">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Sản Phẩm Bán Chạy</h2>
              <p className="text-gray-600">Những sản phẩm được ưa chuộng nhất</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {PRODUCTS.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleProductClick(product)}
                  className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition duration-300 cursor-pointer border hover:border-blue-400 transform hover:scale-105 overflow-hidden"
                >
                  <div className="relative aspect-square bg-gray-50">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">{product.discount}</span>
                      <span className="bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded">{product.badge}</span>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-2 min-h-[40px] group-hover:text-blue-600 transition">
                      {product.name}
                    </h3>
                    <div>
                      <div className="text-red-600 text-lg font-bold">{product.price}</div>
                      <div className="text-gray-400 text-xs line-through">{product.originalPrice}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-semibold transition transform hover:scale-105">
                Xem Tất Cả Sản Phẩm
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default memo(HomePage);
