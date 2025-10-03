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
  { icon: FaFacebookSquare, url: "https://facebook.com/phonestore" },
  { icon: FaYoutube, url: "https://youtube.com/@phonestore" },
  { icon: FaInstagramSquare, url: "https://instagram.com/phonestore" },
  { icon: FaTwitter, url: "https://twitter.com/phonestore" }
];

const CATEGORIES = [
  { id: "iphone", name: "iPhone", icon: FaApple, link: "/products/iphone" },
  { id: "samsung", name: "Samsung", icon: FaMobileAlt, link: "/products/samsung" },
  { id: "xiaomi", name: "Xiaomi", icon: FaFire, link: "/products/xiaomi" },
  { id: "oppo", name: "OPPO", icon: FaMobileAlt, link: "/products/oppo" },
  { id: "accessories", name: "Phụ kiện", icon: FaHeadphones, link: "/products/accessories" }
];

/* ================= Sub Components ================= */
const ContactLink = ({ href, icon: Icon, value }) => (
  <a href={href} className="flex items-center space-x-2 hover:bg-white/10 px-3 py-1.5 rounded-lg transition">
    <Icon className="text-white text-xs" />
    <span className="text-sm font-semibold">{value}</span>
  </a>
);

const SocialIcon = ({ icon: Icon, url }) => (
  <a href={url} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-white/20 rounded-lg hover:bg-white/30 transition">
    <Icon size={16} className="text-white" />
  </a>
);

const CategoryMenuItem = ({ category, isSelected, onClick }) => {
  const Icon = category.icon;
  return (
    <button
      onClick={() => onClick(category)}
      className={`w-full flex items-center space-x-3 px-4 py-2 hover:bg-red-50 transition text-left ${
        isSelected ? "bg-red-50 border-l-4 border-red-600" : "border-l-4 border-transparent"
      }`}
    >
      <Icon className="text-red-600 text-lg" />
      <span className="font-medium text-sm text-gray-700">{category.name}</span>
    </button>
  );
};

const CategoryDropdown = ({ categories, selectedCategory, onCategoryClick }) => (
  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border py-2 z-50">
    <div className="px-4 py-2 border-b">
      <h3 className="text-xs font-semibold text-gray-500 uppercase">Danh mục</h3>
    </div>
    {categories.map((cat) => (
      <CategoryMenuItem key={cat.id} category={cat} isSelected={selectedCategory === cat.id} onClick={onCategoryClick} />
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
        className="w-full px-3 py-2 border rounded-lg text-sm mb-2 outline-none focus:border-red-600"
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
          className="flex-1 px-3 py-3 border rounded-l-lg text-sm outline-none focus:border-red-600"
        />
        <button className="bg-red-600 hover:bg-red-700 text-white px-5 rounded-r-lg flex items-center justify-center">
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
      <div className="bg-red-600 text-white text-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-2">
            <div className="flex space-x-4 items-center flex-1">
              <ContactLink href={CONTACT_INFO.phoneLink} icon={FaPhoneAlt} value={CONTACT_INFO.phone} />
              <ContactLink href={`mailto:${CONTACT_INFO.email}`} icon={FaEnvelope} value={CONTACT_INFO.email} />
              <ContactLink href="/stores" icon={FaMapMarkerAlt} value={CONTACT_INFO.address} />
            </div>
            <div className="flex items-center space-x-3">
              {SOCIAL_LINKS.map((social, i) => <SocialIcon key={i} {...social} />)}
              <a
                href="/login"
                className="flex items-center space-x-2 bg-white text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg font-medium text-sm transition"
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
          <div className="flex items-center justify-between py-3">
            {/* Logo */}
            <a href="/" className="flex items-center space-x-2">
              <div className="bg-red-600 p-2.5 rounded-lg shadow">
                <FaPhoneAlt className="text-white text-xl" />
              </div>
              <h1 className="text-lg font-bold text-gray-800">PhoneStore</h1>
            </a>

            {/* Search */}
            <div className="flex-1 max-w-2xl mx-6">
              <div className="hidden md:flex relative w-full" ref={categoryMenuRef}>
                <div className="flex items-center border-2 border-red-400 rounded-full bg-white w-full h-12 overflow-hidden">
                  <button
                    onClick={() => setShowCategoryMenu(!showCategoryMenu)}
                    className="flex items-center space-x-2 px-4 bg-red-50 hover:bg-red-100 border-r border-red-200 h-full"
                  >
                    <FaThList className="text-red-600 text-sm" />
                    <span className="text-sm font-medium text-gray-700">Danh mục</span>
                  </button>
                  <input type="text" placeholder="Tìm kiếm sản phẩm..." className="flex-1 px-4 text-sm outline-none h-full" />
                  <button className="bg-red-600 hover:bg-red-700 text-white px-6 h-full flex items-center justify-center">
                    <FaSearch size={18} />
                  </button>
                </div>
                {showCategoryMenu && (
                  <CategoryDropdown categories={CATEGORIES} selectedCategory={selectedCategory} onCategoryClick={handleCategoryClick} />
                )}
              </div>
              <div className="flex md:hidden relative">
                <button onClick={() => setMobileSearchOpen(!mobileSearchOpen)} className="p-2 text-gray-600 hover:text-red-600">
                  <FaSearch size={16} />
                </button>
                <MobileSearch categories={CATEGORIES} selectedCategory={selectedCategory} onCategoryClick={handleCategoryClick} isOpen={mobileSearchOpen} />
              </div>
            </div>

            {/* Cart */}
            <a href="/cart" className="relative p-2 text-gray-600 hover:text-red-600">
              <FaShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default memo(Header);
