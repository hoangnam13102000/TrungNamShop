import React, { createContext, useContext, useEffect, useState } from "react";

// Key lưu trên localStorage
const CART_KEY = "cart";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem(CART_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  // Lưu cart xuống localStorage mỗi khi cartItems thay đổi
  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  // Thêm sản phẩm
  const addItem = (item) => {
    setCartItems((prev) => [...prev, item]);
  };

  // Xóa sản phẩm
  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Clear toàn bộ giỏ
  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider value={{ cartItems, setCartItems, addItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Hook tiện lợi
export const useCart = () => useContext(CartContext);
