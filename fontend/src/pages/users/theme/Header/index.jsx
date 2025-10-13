import { memo, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Dropdown from "../../../../components/DropDown";
import useGetStores from "../../../../api/stores/queries";
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
  FaBars,
  FaTimes,
} from "react-icons/fa";
import HomeBanner from "@page_user/theme/Header/Banner.jsx";

/* ================= Constants ================= */
const SOCIAL_LINKS = [
  { icon: FaFacebookSquare, url: "https://facebook.com/phonestore" },
  { icon: FaYoutube, url: "https://youtube.com/@phonestore" },
  { icon: FaInstagramSquare, url: "https://instagram.com/phonestore" },
  { icon: FaTwitter, url: "https://twitter.com/phonestore" },
];

const CATEGORIES = [
  { id: "iphone", name: "iPhone", link: "/products/iphone" },
  { id: "samsung", name: "Samsung", link: "/products/samsung" },
  { id: "xiaomi", name: "Xiaomi", link: "/products/xiaomi" },
  { id: "oppo", name: "OPPO", link: "/products/oppo" },
  { id: "accessories", name: "Phụ kiện", link: "/products/accessories" },
];

/* ================= Sub Components ================= */
const ContactLink = ({ href, icon: Icon, value, hideOnMobile = false }) => {
  const isInternal =
    href &&
    !href.startsWith("http") &&
    !href.startsWith("mailto:") &&
    !href.startsWith("tel:");

  const className = `flex items-center space-x-1.5 sm:space-x-2 hover:bg-white/10 px-2 py-1.5 rounded-lg transition text-xs whitespace-nowrap ${
    hideOnMobile ? "hidden lg:flex" : ""
  }`;

  return isInternal ? (
    <Link to={href} className={className}>
      {Icon && <Icon className="text-white text-xs flex-shrink-0" />}
      <span className="font-semibold truncate">{value}</span>
    </Link>
  ) : (
    <a href={href} className={className}>
      {Icon && <Icon className="text-white text-xs flex-shrink-0" />}
      <span className="font-semibold truncate">{value}</span>
    </a>
  );
};

const SocialIcon = ({ icon: Icon, url }) => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    className="p-1.5 bg-white/20 rounded-lg hover:bg-white/30 transition flex-shrink-0"
  >
    {Icon && <Icon className="text-white text-sm" />}
  </a>
);

/* ================= Main Component ================= */
const Header = () => {
  const [cartCount] = useState(3);
  const [showMenu, setShowMenu] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [dropdownKey, setDropdownKey] = useState(0);

  const { data: stores, isLoading } = useGetStores();
  const location = useLocation();
  const navigate = useNavigate();
  const showBanner = location.pathname === "/";

  // Reset dropdown when navigating
  useEffect(() => {
    setDropdownKey((prev) => prev + 1);
  }, [location.pathname]);

  const dropdownOptions = CATEGORIES.map((cat) => ({
    label: cat.name,
    value: cat.id,
    link: cat.link,
  }));

  const mainStore = stores?.[0];

  return (
    <>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full">
        {/* Top Bar */}
        <div className="bg-red-600 text-white">
          <div className="container mx-auto px-3 sm:px-4">
            <div className="flex justify-between items-center py-2 gap-2">
              <div className="flex items-center gap-1 sm:gap-2 flex-1 min-w-0 overflow-x-auto">
                {/* Info Store */}
                {isLoading ? (
                  <span className="text-xs opacity-80">
                    Đang tải thông tin cửa hàng...
                  </span>
                ) : mainStore ? (
                  <>
                    <ContactLink
                      href={`tel:${mainStore.phone || ""}`}
                      icon={FaPhoneAlt}
                      value={mainStore.phone || "Chưa có SĐT"}
                    />
                    <ContactLink
                      href="/lien-he"
                      icon={FaEnvelope}
                      value={mainStore.email || "Chưa có email"}
                      hideOnMobile={true}
                    />
                    <ContactLink
                      href={mainStore.google_map || "Chưa có liên kết"}
                      icon={FaMapMarkerAlt}
                      value={
                        mainStore.name
                          ? `${mainStore.name} - ${mainStore.address}`
                          : mainStore.address
                      }
                      hideOnMobile={true}
                    />
                  </>
                ) : (
                  <span className="text-xs opacity-80">
                    Không có dữ liệu cửa hàng.
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                <div className="hidden sm:flex items-center gap-1.5">
                  {SOCIAL_LINKS.map((social, i) => (
                    <SocialIcon key={i} {...social} />
                  ))}
                </div>
                <Link
                  to="/dang-nhap"
                  className="hidden lg:flex items-center space-x-2 bg-white text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg font-medium text-xs transition whitespace-nowrap"
                >
                  <FaUser size={12} />
                  <span>Đăng nhập</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="bg-white shadow">
          <div className="container mx-auto px-3 sm:px-4">
            <div className="flex items-center justify-between py-2 sm:py-3 gap-2 sm:gap-4">
              {/* Logo */}
              <Link
                to="/"
                className="flex items-center flex-shrink-0 justify-center"
              >
                <div className="w-24 sm:w-28 md:w-32 lg:w-36 flex justify-center">
                  <img
                    src="/logo.png"
                    alt="TechPhone"
                    className="h-12 sm:h-14 md:h-16 lg:h-20 object-contain"
                  />
                </div>
              </Link>

              {/* Search Desktop + Dropdown */}
              <div className="hidden lg:flex flex-1 max-w-2xl relative">
                <div className="flex items-center border-2 border-red-400 bg-white w-full h-11 rounded-none">
                  <Dropdown
                    key={dropdownKey}
                    label="Danh mục"
                    options={dropdownOptions}
                    onSelect={(option) => navigate(option.link)}
                    className="min-w-[180px] border-r border-red-400"
                  />
                  <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    className="flex-1 px-4 text-sm outline-none h-full min-w-0"
                  />
                  <button className="bg-red-600 hover:bg-red-700 text-white px-5 h-full flex items-center justify-center transition">
                    <FaSearch size={16} />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                <button
                  onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                  className="lg:hidden p-2 text-gray-600 hover:text-red-600 transition"
                >
                  <FaSearch className="text-base sm:text-lg" />
                </button>

                <Link
                  to="/gio-hang"
                  className="relative p-2 text-gray-600 hover:text-red-600 transition"
                >
                  <FaShoppingCart className="text-lg sm:text-xl" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full min-w-[20px] h-5 px-1 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>

                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="lg:hidden p-2 text-gray-600 hover:text-red-600 transition"
                >
                  {showMenu ? (
                    <FaTimes className="text-lg" />
                  ) : (
                    <FaBars className="text-lg" />
                  )}
                </button>
              </div>
            </div>

            {/* Mobile Search */}
            {mobileSearchOpen && (
              <div className="lg:hidden pb-3 animate-in slide-in-from-top">
                <div className="flex border-2 border-red-400 bg-white overflow-hidden rounded-none">
                  <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    className="flex-1 px-3 py-2.5 text-sm outline-none min-w-0"
                    autoFocus
                  />
                  <button className="bg-red-600 hover:bg-red-700 text-white px-4 sm:px-5 flex items-center justify-center transition">
                    <FaSearch size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Mobile Menu */}
            {showMenu && (
              <div className="lg:hidden bg-white border-t shadow-lg pb-3 animate-in slide-in-from-top">
                <nav className="space-y-1 pt-2">
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat.id}
                      to={cat.link}
                      className="flex items-center space-x-3 px-3 py-2.5 hover:bg-red-50 rounded-lg transition"
                      onClick={() => setShowMenu(false)}
                    >
                      <span className="text-sm font-medium">{cat.name}</span>
                    </Link>
                  ))}
                  <div className="pt-2 border-t">
                    <Link
                      to="/dang-nhap"
                      className="flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg font-medium text-sm transition mx-3"
                    >
                      <FaUser size={14} />
                      <span>Đăng nhập</span>
                    </Link>
                  </div>
                </nav>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Spacer avoids covering content */}
      <div className="pt-[120px]"></div>

      {/* Banner */}
      {showBanner && <HomeBanner />}
    </>
  );
};

export default memo(Header);
