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

export const CartContext = createContext({});

type CartItem = {
  description: string;
  imageUrl: string;
  name: string;
  quantity: number;
  unitAmount: number;
  stripePriceId: string;
};

const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<{
    [key: string]: CartItem;
  }>({});

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
    }
  }, [cartId]);

  const addToCart = useCallback(
    (item: CartItem) => {
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

      console.log(localStorage.getItem(cartId));
    },
    [cartId]
  );

  const removeFromCart = useCallback(
    (itemKey: string) => {
      const newCartItems = { ...cartItems };

      delete newCartItems[itemKey];

      setCartItems(newCartItems);
      localStorage.setItem(cartId, JSON.stringify(newCartItems));
    },
    [cartId]
  );

  console.log("provider rendering");
  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
