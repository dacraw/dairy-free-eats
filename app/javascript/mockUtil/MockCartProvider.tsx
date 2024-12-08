import { CartContext } from "context/CartProvider";
import React from "react";

export const mockAddToCart = jest.fn();
export const mockRemoveFromCart = jest.fn();
export const adjustItemQuantity = jest.fn();

const MockCartProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <CartContext.Provider
      value={{
        addToCart: mockAddToCart,
        cartItems: {},
        removeFromCart: mockRemoveFromCart,
        adjustItemQuantity: adjustItemQuantity,
        clearCart: () => {},
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default MockCartProvider;
