import { useCurrentUserQuery } from "graphql/types";
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

const generateCartId = (userEmail?: string) => {
  return userEmail ? `cart_${userEmail}` : `cart_guest`;
};

type CartContextType = {
  cartItems: { [key: string]: CartItem };
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemKey: string) => void;
  adjustItemQuantity: (itemKey: string, quantityDelta: number) => void;
};

export const CartContext = createContext<CartContextType>({
  cartItems: {},
  addToCart: () => {},
  removeFromCart: () => {},
  adjustItemQuantity: () => {},
});

type CartItem = {
  description: string;
  imageUrl: string;
  name: string;
  quantity: number;
  unitAmount: number;
  stripePriceId: string;
};

const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartContextType["cartItems"]>({});

  const { data: currentUserData, loading: currentUserLoading } =
    useCurrentUserQuery();

  const cartId = useMemo(
    () => generateCartId(currentUserData?.currentUser?.id),
    [currentUserData?.currentUser?.id]
  );

  useEffect(() => {
    const existingCartItems = localStorage.getItem(cartId);
    if (existingCartItems) {
      setCartItems(JSON.parse(existingCartItems));
    } else {
      setCartItems({});
    }
  }, [cartId]);

  const addToCart: CartContextType["addToCart"] = useCallback(
    (item) => {
      const { stripePriceId, quantity } = item;
      const newCartItems = { ...cartItems };

      if (cartItems[stripePriceId]) {
        const existingQuantity = cartItems[stripePriceId].quantity;
        newCartItems[stripePriceId].quantity = quantity + existingQuantity;

        setCartItems(newCartItems);
        localStorage.setItem(cartId, JSON.stringify(newCartItems));
      } else {
        newCartItems[stripePriceId] = item;

        setCartItems(newCartItems);
        localStorage.setItem(cartId, JSON.stringify(newCartItems));
      }
    },
    [cartId, cartItems]
  );

  const removeFromCart: CartContextType["removeFromCart"] = useCallback(
    (itemKey) => {
      const newCartItems = { ...cartItems };

      delete newCartItems[itemKey];

      setCartItems(newCartItems);
      localStorage.setItem(cartId, JSON.stringify(newCartItems));
    },
    [cartId, cartItems]
  );

  const adjustItemQuantity: CartContextType["adjustItemQuantity"] = useCallback(
    (itemKey, quantityDelta) => {
      const updatedItems = { ...cartItems };
      const updatedCartItem = { ...updatedItems[itemKey] };
      const updatedQuantity = updatedCartItem.quantity + quantityDelta;
      updatedCartItem.quantity = updatedQuantity;

      updatedItems[itemKey] = updatedCartItem;

      setCartItems(updatedItems);

      localStorage.setItem(cartId, JSON.stringify(updatedItems));
    },
    [cartItems]
  );

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, adjustItemQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
