import { memo, useState, useRef, useEffect } from "react";
import {
  FaFacebookSquare,
  FaYoutube,
  FaInstagramSquare,
  FaTwitter,
  FaPhoneAlt,
  FaEnvelope,
  FaUser,
  FaMapMarkerAlt,
  FaShoppingCart,
  FaSearch,
  FaMobileAlt,
  FaApple,
  FaFire,
  FaHeadphones,
  FaThList
} from "react-icons/fa";

/* ================= Constants ================= */
const CONTACT_INFO = {
  phone: "1800 1234",
  phoneLink: "tel:18001234",
  email: "support@phonestore.com",
  address: "Đường số 7, Hiệp Bình Phước, Q.Thủ Đức, TP.HCM"
};

const SOCIAL_LINKS = [
  { icon: FaFacebookSquare, url: "https://facebook.com/phonestore", hoverColor: "hover:bg-blue-500", visible: "flex" },
  { icon: FaYoutube, url: "https://youtube.com/@phonestore", hoverColor: "hover:bg-red-500", visible: "flex" },
  { icon: FaInstagramSquare, url: "https://instagram.com/phonestore", hoverColor: "hover:bg-pink-500", visible: "hidden lg:flex" },
  { icon: FaTwitter, url: "https://twitter.com/phonestore", hoverColor: "hover:bg-sky-400", visible: "hidden lg:flex" }
];

const CATEGORIES = [
  { id: "iphone", name: "iPhone", icon: FaApple, iconColor: "text-gray-800", link: "/products/iphone" },
  { id: "samsung", name: "Samsung", icon: FaMobileAlt, iconColor: "text-indigo-600", link: "/products/samsung" },
  { id: "xiaomi", name: "Xiaomi", icon: FaFire, iconColor: "text-red-500", link: "/products/xiaomi" },
  { id: "oppo", name: "OPPO", icon: FaMobileAlt, iconColor: "text-green-600", link: "/products/oppo" },
  { id: "accessories", name: "Phụ kiện", icon: FaHeadphones, iconColor: "text-purple-600", link: "/products/accessories" }
];

/* ================= Sub Components ================= */
const ContactLink = ({ href, icon: Icon, label, value, className = "" }) => (
  <a href={href} className={`flex items-center space-x-2 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-all group ${className}`}>
    <div className="bg-white/20 p-1.5 rounded-full group-hover:bg-white/30 flex-shrink-0">
      <Icon className="text-white text-xs" />
    </div>
    <div className="block leading-tight">
      {label && <div className="text-[11px] opacity-90 hidden sm:block">{label}</div>}
      <div className="text-sm font-semibold whitespace-nowrap">{value}</div>
    </div>
  </a>
);

const SocialIcon = ({ icon: Icon, url, hoverColor, visible }) => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    className={`bg-white/15 ${hoverColor} p-1.5 rounded-lg transition-all hover:scale-110 ${visible}`}
  >
    <Icon size={16} />
  </a>
);

const CategoryMenuItem = ({ category, isSelected, onClick }) => {
  const Icon = category.icon;
  return (
    <button
      onClick={() => onClick(category)}
      className={`w-full flex items-center space-x-3 px-4 py-2 hover:bg-blue-50 transition text-left group ${
        isSelected ? "bg-blue-50 border-l-4 border-blue-600" : "border-l-4 border-transparent"
      }`}
    >
      <Icon className={`text-xl ${category.iconColor}`} />
      <span className="font-medium text-sm text-gray-700 group-hover:text-blue-600 flex-1">
        {category.name}
      </span>
    </button>
  );
};

const CategoryDropdown = ({ categories, selectedCategory, onCategoryClick }) => (
  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
    <div className="px-4 py-2 border-b border-gray-100">
      <h3 className="text-xs font-semibold text-gray-500 uppercase">Danh mục</h3>
    </div>
    {categories.map((cat) => (
      <CategoryMenuItem
        key={cat.id}
        category={cat}
        isSelected={selectedCategory === cat.id}
        onClick={onCategoryClick}
      />
    ))}
  </div>
);

const MobileSearch = ({ categories, selectedCategory, onCategoryClick, isOpen }) => {
  if (!isOpen) return null;
  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white shadow-lg rounded-xl border p-3 z-50">
      <select
        value={selectedCategory || ""}
        onChange={(e) => {
          const category = categories.find(cat => cat.id === e.target.value);
          if (category) onCategoryClick(category);
        }}
        className="w-full px-3 py-2 border rounded-lg text-sm mb-2 outline-none focus:border-blue-500"
      >
        <option value="">Chọn danh mục</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>
      <div className="flex">
        <input
          type="text"
          placeholder="Tìm kiếm..."
          className="flex-1 px-3 py-3 border rounded-l-lg text-sm outline-none focus:border-blue-500"
        />
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 rounded-r-lg flex items-center justify-center">
          <FaSearch size={16} />
        </button>
      </div>
    </div>
  );
};

/* ================= Main Component ================= */
const Header = () => {
  const [cartCount] = useState(3);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const categoryMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(e.target)) {
        setShowCategoryMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category.id);
    setShowCategoryMenu(false);
    console.log(`Chuyển đến: ${category.link}`);
  };

  return (
    <header className="w-full">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white shadow-md text-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-2">
            {/* Contact Info */}
            <div className="flex space-x-3 lg:space-x-6 items-center flex-1">
              <ContactLink href={CONTACT_INFO.phoneLink} icon={FaPhoneAlt} label="Hotline 24/7" value={CONTACT_INFO.phone} />
              <ContactLink href={`mailto:${CONTACT_INFO.email}`} icon={FaEnvelope} value={CONTACT_INFO.email} className="hidden lg:flex" />
              <ContactLink href="/stores" icon={FaMapMarkerAlt} value={CONTACT_INFO.address} className="hidden xl:flex max-w-md" />
            </div>

            {/* Social & Login */}
            <div className="flex items-center space-x-3 lg:space-x-4 flex-shrink-0">
              <div className="hidden sm:flex items-center space-x-2 border-r border-white/30 pr-4">
                <span className="opacity-90">Theo dõi:</span>
                {SOCIAL_LINKS.map((social, index) => (
                  <SocialIcon key={index} {...social} />
                ))}
              </div>
              <a
                href="/login"
                className="flex items-center space-x-2 bg-white text-blue-700 
                          hover:bg-yellow-400 hover:text-blue-900 
                          px-4 py-2 rounded-lg font-medium 
                          text-sm transition-all hover:shadow-md"
              >
                <FaUser size={14} />
                <span>Đăng nhập</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white shadow sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3 sm:py-4">
            {/* Logo */}
            <a href="/" className="flex items-center space-x-2 flex-shrink-0">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2.5 rounded-lg shadow-md">
                <FaPhoneAlt className="text-white text-xl" />
              </div>
              <div className="hidden sm:block leading-tight">
                <h1 className="text-lg sm:text-xl font-bold text-gray-800">PhoneStore</h1>
                <p className="text-xs text-gray-500">Uy tín - Chất lượng</p>
              </div>
            </a>

            {/* Search */}
            <div className="flex-1 max-w-2xl mx-4 lg:mx-8">
              {/* Desktop Search */}
              <div className="hidden md:flex relative w-full" ref={categoryMenuRef}>
                <div className="flex items-center border-2 border-gray-300 rounded-full focus-within:border-blue-500 bg-white w-full h-12 overflow-hidden">
                  {/* Category Button */}
                  <button
                    onClick={() => setShowCategoryMenu(!showCategoryMenu)}
                    className="flex items-center space-x-2 px-4 bg-gray-50 hover:bg-gray-100 transition-colors border-r border-gray-200 h-full"
                  >
                    <FaThList className="text-blue-600 text-sm" />
                    <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Danh mục</span>
                    <svg className={`w-4 h-4 text-gray-500 transition-transform ${showCategoryMenu ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Input */}
                  <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    className="flex-1 px-4 text-sm outline-none h-full"
                  />

                  {/* Search Button */}
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 h-full flex items-center justify-center transition-colors">
                    <FaSearch size={18} />
                  </button>
                </div>
                {showCategoryMenu && (
                  <CategoryDropdown categories={CATEGORIES} selectedCategory={selectedCategory} onCategoryClick={handleCategoryClick} />
                )}
              </div>

              {/* Mobile Search */}
              <div className="flex md:hidden relative">
                <button
                  onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                  className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <FaSearch size={16} />
                </button>
                <MobileSearch
                  categories={CATEGORIES}
                  selectedCategory={selectedCategory}
                  onCategoryClick={handleCategoryClick}
                  isOpen={mobileSearchOpen}
                />
              </div>
            </div>

            {/* Cart */}
            <div className="flex items-center space-x-3">
              <a href="/cart" className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors">
                <FaShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default memo(Header);
