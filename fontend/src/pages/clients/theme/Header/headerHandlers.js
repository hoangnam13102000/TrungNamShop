
export const handleLogout = (navigate) => {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  localStorage.removeItem("avatar");
  localStorage.removeItem("account_id");

  Object.keys(localStorage)
    .filter((key) => key.startsWith("chat_history_"))
    .forEach((key) => localStorage.removeItem(key));

  window.dispatchEvent(new Event("storage"));
  navigate("/");
};

export const handleSearch = (navigate, term, category, closeMobileSearch, closeMenu) => {
  const queryParams = new URLSearchParams();
  if (term) queryParams.append("search", term);
  if (category) queryParams.append("brands", category.value);
  navigate(`/danh-sach-san-pham?${queryParams.toString()}`);
  if (closeMobileSearch) closeMobileSearch(false);
  if (closeMenu) closeMenu(false);
};

export const handleDesktopSearch = (e, searchTerm, selectedCategory, navigate, setMobileSearchOpen, setShowMenu) => {
  e.preventDefault();
  handleSearch(navigate, searchTerm, selectedCategory, setMobileSearchOpen, setShowMenu);
};

export const handleMobileSearch = (e, mobileSearchTerm, navigate, setMobileSearchOpen, setShowMenu) => {
  e.preventDefault();
  handleSearch(navigate, mobileSearchTerm, null, setMobileSearchOpen, setShowMenu);
};

export const getProfile = (customersData, employeesData, accountId) => {
  return (
    customersData.find((c) => c.account_id == accountId) ||
    employeesData.find((e) => e.account_id == accountId)
  );
};

export const loadCartFromStorage = (setCartItems, setCartCount) => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalQuantity = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  setCartCount(totalQuantity);
  setCartItems(cart);
};
