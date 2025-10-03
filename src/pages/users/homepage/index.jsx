import { memo } from "react";
import logoIphone from "../../../assets/users/images/categories/logo-iphone.png";
import logoItel from "../../../assets/users/images/categories/logo-itel.jpg";
import logoMasstel from "../../../assets/users/images/categories/logo-masstel.png";
import logoMobell from "../../../assets/users/images/categories/logo-mobell.jpg";
import logoNokia from "../../../assets/users/images/categories/logo-nokia.jpg";
import logoOppo from "../../../assets/users/images/categories/logo-oppo.jpg";
import logoRealme from "../../../assets/users/images/categories/logo-realme.png";
import logoSamsung from "../../../assets/users/images/categories/logo-samsung.png";
import logoVivo from "../../../assets/users/images/categories/logo-vivo.jpg";
import logoXiaomi from "../../../assets/users/images/categories/logo-xiaomi.png";

const HomePage = () => {
  const brands = [
    { id: 1, name: "Samsung", logo: logoSamsung, link: "/products/samsung" },
    { id: 2, name: "iPhone", logo: logoIphone, link: "/products/iphone" },
    { id: 3, name: "Itel", logo: logoItel, link: "/products/itel" },
    { id: 4, name: "Masstel", logo: logoMasstel, link: "/products/masstel" },
    { id: 5, name: "Mobell", logo: logoMobell, link: "/products/mobell" },
    { id: 6, name: "Nokia", logo: logoNokia, link: "/products/nokia" },
    { id: 7, name: "Oppo", logo: logoOppo, link: "/products/oppo" },
    { id: 8, name: "Realme", logo: logoRealme, link: "/products/realme" },
    { id: 9, name: "Vivo", logo: logoVivo, link: "/products/Vivo" },
    { id: 10, name: "XiaoMi", logo: logoXiaomi, link: "/products/realme" },
  ];

  const handleBrandClick = (link) => {
    console.log(`Chuyển đến: ${link}`);
    // nếu dùng react-router-dom thì dùng navigate(link)
    // window.location.href = link;
  };

  return (
    <div className="w-full bg-gray-50 py-8 sm:py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            Thương Hiệu Nổi Bật
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Khám phá các thương hiệu điện thoại hàng đầu
          </p>
        </div>

        {/* Brand Grid */}
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
  );
};

export default memo(HomePage);
