import { memo, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthDropdown from "../../../../components/UI/dropdown/AuthDropdown";
import Dropdown from "../../../../components/UI/dropdown/DropDown";
import { useCRUDApi } from "../../../../api/hooks/useCRUDApi"; 
import HomeBanner from "@page_user/theme/Header/Banner.jsx";
import { getImageUrl } from "../../../../utils/helpers/getImageUrl";
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

const SOCIAL_LINKS = [
  { icon: FaFacebookSquare, url: "https://facebook.com/phonestore" },
  { icon: FaYoutube, url: "https://youtube.com/@phonestore" },
  { icon: FaInstagramSquare, url: "https://instagram.com/phonestore" },
  { icon: FaTwitter, url: "https://twitter.com/phonestore" },
];

const Header = () => {
  const [cartCount, setCartCount] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const showBanner = location.pathname === "/";

  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [username, setUsername] = useState(localStorage.getItem("username") || "User");

  // Lấy account_id từ localStorage
  const accountId = localStorage.getItem("account_id");

  // APIs
  const storeAPI = useCRUDApi("stores");
  const brandAPI = useCRUDApi("brands");
  const customerAPI = useCRUDApi("customers");

  const { data: stores = [], isLoading: isStoresLoading } = storeAPI.useGetAll();
  const mainStore = stores[0];

  const { data: brandsData = [], isLoading: isBrandsLoading } = brandAPI.useGetAll();

  const { data: customersData = [], isLoading: isCustomersLoading } = customerAPI.useGetAll();
  const customer = customersData.find(c => c.account_id == accountId);

  // Reset selected category khi chuyển trang
  useEffect(() => setSelectedCategory(null), [location.pathname]);

  // Cập nhật login khi localStorage thay đổi
  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
      setUsername(localStorage.getItem("username") || "User");
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Load cart count + realtime update
  useEffect(() => {
    const loadCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const totalQuantity = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
      setCartCount(totalQuantity);
    };

    loadCartCount();

    const handleStorageChange = (e) => {
      if (e.key === "cart") loadCartCount();
    };
    const handleCartUpdated = () => loadCartCount();

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("cartUpdated", handleCartUpdated);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cartUpdated", handleCartUpdated);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("avatar");
    localStorage.removeItem("account_id");
    window.dispatchEvent(new Event("storage"));
    navigate("/");
  };

  // Dropdown brand
  const dropdownOptions = brandsData.map((brand) => ({
    label: brand.name,
    value: brand.id,
  }));

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 w-full">
        {/* Top Bar */}
        <div className="bg-red-600 text-white">
          <div className="container mx-auto px-3 sm:px-4">
            <div className="flex justify-between items-center py-2 gap-2">
              <div className="flex items-center gap-1 sm:gap-2 flex-1 min-w-0 overflow-x-auto">
                {isStoresLoading ? (
                  <span className="text-xs opacity-80">Đang tải thông tin cửa hàng...</span>
                ) : mainStore ? (
                  <>
                    <a href={`tel:${mainStore.phone}`} className="flex items-center space-x-1.5 px-2 py-1.5 rounded-lg text-xs">
                      <FaPhoneAlt />
                      <span>{mainStore.phone}</span>
                    </a>
                    <a href="/lien-he" className="hidden lg:flex items-center space-x-1.5 px-2 py-1.5 rounded-lg text-xs">
                      <FaEnvelope />
                      <span>{mainStore.email}</span>
                    </a>
                    <a href={mainStore.google_map || "#"} target="_blank" rel="noopener noreferrer" className="hidden md:flex items-center space-x-1.5 px-2 py-1.5 rounded-lg text-xs">
                      <FaMapMarkerAlt />
                      <span>{mainStore.name ? `${mainStore.name} - ${mainStore.address}` : mainStore.address}</span>
                    </a>
                  </>
                ) : (
                  <span className="text-xs opacity-80">Không có dữ liệu cửa hàng.</span>
                )}
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                <div className="hidden sm:flex items-center gap-1.5">
                  {SOCIAL_LINKS.map((social, i) => (
                    <a key={i} href={social.url} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-white/20 rounded-lg">
                      <social.icon className="text-white text-sm" />
                    </a>
                  ))}
                </div>

                {!isCustomersLoading && (
                  <AuthDropdown
                    isLoggedIn={isLoggedIn}
                    username={username}
                    avatar={getImageUrl(customer?.avatar)}
                    onLogout={handleLogout}
                    onNavigate={navigate}
                    menuItems={[
                      { label: "Thông tin cá nhân", link: "/thong-tin-ca-nhan" },
                      { label: "Đơn hàng của tôi", link: "/don-hang" },
                    ]}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="bg-white shadow">
          <div className="container mx-auto px-3 sm:px-4">
            <div className="flex items-center justify-between py-2 sm:py-3 gap-2 sm:gap-4">
              <Link to="/" className="flex items-center flex-shrink-0 justify-center">
                <div className="w-24 sm:w-28 md:w-32 lg:w-36 flex justify-center">
                  <img src="logo.png" alt="TechPhone" className="h-12 sm:h-14 md:h-16 lg:h-20 object-contain" />
                </div>
              </Link>

              {/* Desktop Search */}
              <div className="hidden lg:flex flex-1 max-w-2xl relative">
                <div className="flex items-center border-2 border-red-400 bg-white w-full h-11">
                  <Dropdown
                    label={selectedCategory?.label || "Chọn thương hiệu"}
                    options={dropdownOptions}
                    selected={selectedCategory}
                    onSelect={(option) => {
                      setSelectedCategory(option);
                      navigate(`/danh-sach-san-pham?brand=${option.value}`);
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

            {/* Mobile Menu */}
            {showMenu && (
              <div className="lg:hidden bg-white border-t shadow-lg pb-3 animate-in slide-in-from-top">
                <nav className="space-y-1 pt-2">
                  {brandsData.map((brand) => (
                    <button
                      key={brand.id}
                      className="flex items-center space-x-3 px-3 py-2.5 hover:bg-red-50 rounded-lg transition w-full text-left"
                      onClick={() => {
                        navigate(`/products?brand=${brand.id}`);
                        setShowMenu(false);
                      }}
                    >
                      <span className="text-sm font-medium">{brand.name}</span>
                    </button>
                  ))}
                </nav>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="pt-[120px]" />
      {showBanner && <HomeBanner />}
    </>
  );
};

export default memo(Header);
