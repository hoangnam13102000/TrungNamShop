export const increaseQuantity = (cart, id, maxStock = 10) => {
  return cart.map((item) =>
    item.id === id
      ? { ...item, quantity: Math.min(item.quantity + 1, maxStock) }
      : item
  );
};

export const decreaseQuantity = (cart, id) => {
  return cart.map((item) =>
    item.id === id && item.quantity > 1
      ? { ...item, quantity: item.quantity - 1 }
      : item
  );
};

export const removeItem = (cart, id) => {
  return cart.filter((item) => item.id !== id);
};

export const calculateTotal = (cart) => {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
};
