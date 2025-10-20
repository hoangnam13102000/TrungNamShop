import { memo, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthDropdown from "../../../../components/dropdown/AuthDropdown";
import Dropdown from "../../../../components/dropdown/DropDown";
import useGetStores from "../../../../api/stores/queries";
import HomeBanner from "@page_user/theme/Header/Banner.jsx";
import defaultAvatar from "../../../../assets/users/images/user/user.png";
import {
  FaFacebookSquare,
  FaYoutube,
  FaInstagramSquare,
  FaTwitter,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaShoppingCart,
  FaSearch,
  FaBars,
  FaTimes,
} from "react-icons/fa";

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
  const isInternal = href && !href.startsWith("http") && !href.startsWith("mailto:") && !href.startsWith("tel:");
  const className = `flex items-center space-x-1.5 sm:space-x-2 hover:bg-white/10 px-2 py-1.5 rounded-lg transition text-xs whitespace-nowrap ${hideOnMobile ? "hidden lg:flex" : ""}`;

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

/* ================= Main Header Component ================= */
const Header = () => {
  const [cartCount] = useState(3);
  const [showMenu, setShowMenu] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const showBanner = location.pathname === "/";

  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [username, setUsername] = useState(localStorage.getItem("username") || "User");
  const [avatar, setAvatar] = useState(localStorage.getItem("avatar") || defaultAvatar);

  const { data: stores, isLoading } = useGetStores();
  const mainStore = stores?.[0];

  useEffect(() => setSelectedCategory(null), [location.pathname]);

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
      setUsername(localStorage.getItem("username") || "User");
      setAvatar(localStorage.getItem("avatar") || defaultAvatar);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("avatar");
    window.dispatchEvent(new Event("storage"));
    navigate("/");
  };

  const dropdownOptions = CATEGORIES.map((cat) => ({
    label: cat.name,
    value: cat.id,
    link: cat.link,
  }));

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 w-full">
        {/* Top Bar */}
        <div className="bg-red-600 text-white">
          <div className="container mx-auto px-3 sm:px-4">
            <div className="flex justify-between items-center py-2 gap-2">
              <div className="flex items-center gap-1 sm:gap-2 flex-1 min-w-0 overflow-x-auto">
                {isLoading ? (
                  <span className="text-xs opacity-80">Đang tải thông tin cửa hàng...</span>
                ) : mainStore ? (
                  <>
                    <ContactLink href={`tel:${mainStore.phone || ""}`} icon={FaPhoneAlt} value={mainStore.phone || "Chưa có SĐT"} />
                    <ContactLink href="/lien-he" icon={FaEnvelope} value={mainStore.email || "Chưa có email"} hideOnMobile />
                    <ContactLink
                      href={mainStore.google_map || "#"}
                      icon={FaMapMarkerAlt}
                      value={mainStore.name ? `${mainStore.name} - ${mainStore.address}` : mainStore.address}
                      hideOnMobile
                    />
                  </>
                ) : (
                  <span className="text-xs opacity-80">Không có dữ liệu cửa hàng.</span>
                )}
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                <div className="hidden sm:flex items-center gap-1.5">
                  {SOCIAL_LINKS.map((social, i) => (
                    <SocialIcon key={i} {...social} />
                  ))}
                </div>

                <AuthDropdown
                  isLoggedIn={isLoggedIn}
                  username={username}
                  avatar={avatar}
                  onLogout={handleLogout}
                  onNavigate={navigate}
                  menuItems={[
                    { label: "Thông tin cá nhân", link: "/thong-tin-ca-nhan" },
                    { label: "Đơn hàng của tôi", link: "/don-hang" },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="bg-white shadow">
          <div className="container mx-auto px-3 sm:px-4">
            <div className="flex items-center justify-between py-2 sm:py-3 gap-2 sm:gap-4">
              {/* Logo */}
              <Link to="/" className="flex items-center flex-shrink-0 justify-center">
                <div className="w-24 sm:w-28 md:w-32 lg:w-36 flex justify-center">
                  <img src="/logo.png" alt="TechPhone" className="h-12 sm:h-14 md:h-16 lg:h-20 object-contain" />
                </div>
              </Link>

              {/* Desktop Search + Category */}
              <div className="hidden lg:flex flex-1 max-w-2xl relative">
                <div className="flex items-center border-2 border-red-400 bg-white w-full h-11 rounded-none">
                  <Dropdown
                    label="Danh mục"
                    options={dropdownOptions}
                    selected={selectedCategory}
                    onSelect={(option) => {
                      setSelectedCategory(option);
                      navigate(option.link);
                    }}
                    className="min-w-[180px] border-r border-red-400"
                  />
                  <input type="text" placeholder="Tìm kiếm sản phẩm..." className="flex-1 px-4 text-sm outline-none h-full min-w-0" />
                  <button className="bg-red-600 hover:bg-red-700 text-white px-5 h-full flex items-center justify-center transition">
                    <FaSearch size={16} />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                <button onClick={() => setMobileSearchOpen(!mobileSearchOpen)} className="lg:hidden p-2 text-gray-600 hover:text-red-600 transition">
                  <FaSearch className="text-base sm:text-lg" />
                </button>

                <Link to="/gio-hang" className="relative p-2 text-gray-600 hover:text-red-600 transition">
                  <FaShoppingCart className="text-lg sm:text-xl" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full min-w-[20px] h-5 px-1 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>

                <button onClick={() => setShowMenu(!showMenu)} className="lg:hidden p-2 text-gray-600 hover:text-red-600 transition">
                  {showMenu ? <FaTimes className="text-lg" /> : <FaBars className="text-lg" />}
                </button>
              </div>
            </div>

            {/* Mobile Search */}
            {mobileSearchOpen && (
              <div className="lg:hidden pb-3 animate-in slide-in-from-top">
                <div className="flex border-2 border-red-400 bg-white overflow-hidden rounded-none">
                  <input type="text" placeholder="Tìm kiếm sản phẩm..." className="flex-1 px-3 py-2.5 text-sm outline-none min-w-0" autoFocus />
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
                    {!isLoggedIn ? (
                      <Link
                        to="/dang-nhap"
                        className="flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg font-medium text-sm transition mx-3"
                      >
                        <span>Đăng nhập</span>
                      </Link>
                    ) : (
                      <div className="mx-3">
                        <div className="flex items-center space-x-2 mb-3 px-3 py-2 bg-gradient-to-r from-red-50 to-white rounded-lg border border-red-100">
                          <img src={avatar || defaultAvatar} alt="Avatar" className="w-8 h-8 rounded-full object-cover ring-1 ring-red-200" />
                          <div className="min-w-0 flex-1">
                            <span className="text-sm font-semibold text-gray-900 block truncate">{username}</span>
                            <span className="text-xs text-gray-500">Đã đăng nhập</span>
                          </div>
                        </div>
                        <Link
                          to="/thong-tin-ca-nhan"
                          className="flex items-center space-x-2 w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg font-medium text-sm mb-2 transition"
                          onClick={() => setShowMenu(false)}
                        >
                          <span className="flex-1">Thông tin cá nhân</span>
                        </Link>
                        <button
                          onClick={() => {
                            handleLogout();
                            setShowMenu(false);
                          }}
                          className="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg font-medium text-sm transition"
                        >
                          <span>Đăng xuất</span>
                        </button>
                      </div>
                    )}
                  </div>
                </nav>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Spacer */}
      <div className="pt-[120px]"></div>

      {/* Banner */}
      {showBanner && <HomeBanner />}
    </>
  );
};

export default memo(Header);
