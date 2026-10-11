import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('nexora_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  useEffect(() => {
    localStorage.setItem('nexora_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.productId === product._id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: product._id,
          sku: product.sku,
          name: product.name,
          brand: product.brand || 'Nexora Tech',
          image: product.image || '',
          quantity,
          unitPrice: product.price,
        },
      ];
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
    setPromoCode('');
    setDiscountPercent(0);
  };

  const applyPromo = (code) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'NEXORA10' || clean === 'SAVE10') {
      setPromoCode(clean);
      setDiscountPercent(10);
      return { success: true, message: '10% discount applied successfully!' };
    } else if (clean === 'NEXORA20' || clean === 'VIP20') {
      setPromoCode(clean);
      setDiscountPercent(20);
      return { success: true, message: '20% VIP discount applied!' };
    }
    return { success: false, message: 'Invalid promo code. Try NEXORA10' };
  };

  const removePromo = () => {
    setPromoCode('');
    setDiscountPercent(0);
  };

  const getSubtotal = () =>
    cartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  const getDiscountAmount = () =>
    (getSubtotal() * discountPercent) / 100;

  const getCartTotal = () =>
    Math.max(0, getSubtotal() - getDiscountAmount());

  const getCartCount = () =>
    cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyPromo,
        removePromo,
        promoCode,
        discountPercent,
        getSubtotal,
        getDiscountAmount,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
