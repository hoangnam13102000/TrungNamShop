import { useState, useCallback } from "react";
import { getImageUrl } from "../../utils/helpers/getImageUrl"; 

const getCartItemImage = (item) => {
  if (!item) return null;

  if (item.image) {
    if (typeof item.image === "string") return item.image;
    if (Array.isArray(item.image)) return item.image[0]?.image_path || null;
    return item.image.image_path || item.image.url || item.image.path || null;
  }

  if (item.primary_image) {
    if (typeof item.primary_image === "string") return item.primary_image;
    return item.primary_image.image_path || item.primary_image.url || null;
  }

  if (item.brand?.image) return item.brand.image;

  return null;
};

export const useCartData = () => {
  // Get data cart from Local Storage
  const [cartItems, setCartItems] = useState(() => {
    try {
      const storedCart = localStorage.getItem("cart");
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      console.error("Error parsing cart data from localStorage:", error);
      return [];
    }
  });

  const getSubtotal = useCallback(() => {
    return cartItems.reduce(
      (sum, item) =>
        sum + Number(item.final_price ?? item.price ?? 0) * (item.quantity || 1),
      0
    );
  }, [cartItems]);

  return {
    cartItems,
    setCartItems, 
    getSubtotal,
    getCartItemImage: (item) => getImageUrl(getCartItemImage(item)),
  };
};