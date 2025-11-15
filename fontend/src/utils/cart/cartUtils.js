// utils/cart/cartUtils.js

// Lấy giỏ hàng từ localStorage
export const getCart = () => {
  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : [];
};

// Lưu giỏ hàng vào localStorage
export const saveCart = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

// Thêm sản phẩm vào giỏ
export const addToCart = (product) => {
  const cart = getCart();
  const existing = cart.find((item) => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  saveCart(cart);
  return cart;
};

// Tăng số lượng
export const increaseQuantity = (cart, id) => {
  const newCart = cart.map((item) =>
    item.id === id ? { ...item, quantity: item.quantity + 1 } : item
  );
  saveCart(newCart);
  return newCart;
};

// Giảm số lượng
export const decreaseQuantity = (cart, id) => {
  const newCart = cart
    .map((item) =>
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item
    );
  saveCart(newCart);
  return newCart;
};

// Xóa sản phẩm
export const removeItem = (cart, id) => {
  const newCart = cart.filter((item) => item.id !== id);
  saveCart(newCart);
  return newCart;
};

// Tính tổng tiền
export const calculateTotal = (cart) =>
  cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
