import { faMinus, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CartContext } from "context/CartProvider";
import { Maybe, User } from "graphql/types";
import React, { useContext, useEffect, useState } from "react";

const ShoppingCartItemQuantity: React.FC<{
  itemKey: string;
  existingQuantity: number;
}> = ({ existingQuantity, itemKey }) => {
  const { removeFromCart, adjustItemQuantity } = useContext(CartContext);

  return (
    <div className="blue-background rounded-lg p-2 flex gap-2 items-center">
      {existingQuantity > 1 ? (
        <FontAwesomeIcon
          icon={faMinus}
          onClick={() => adjustItemQuantity(itemKey, -1)}
        />
      ) : (
        <FontAwesomeIcon
          icon={faTrash}
          onClick={(e) => {
            // prevents triggering onClick modal closer in <HeaderNav />
            // for some reason removing this item will close the modal otherwise
            e.stopPropagation();

            removeFromCart(itemKey);
          }}
        />
      )}
      <span>{existingQuantity}</span>
      <FontAwesomeIcon
        icon={faPlus}
        onClick={() => adjustItemQuantity(itemKey, 1)}
      />
    </div>
  );
};

const ShoppingCartItems = () => {
  const { cartItems } = useContext(CartContext);

  return (
    <div>
      {Object.entries(cartItems).map(([stripePrice, itemInfo]) => (
        <div
          key={stripePrice}
          className="grid grid-cols-[auto_1fr_auto] gap-x-4 items-center"
        >
          <img className="w-16" src={itemInfo.imageUrl} />
          <div>
            <p className="font-bold">{itemInfo.name}</p>
            <p className="text-sm">{itemInfo.description}</p>
            <p className="tet-sm">
              {new Intl.NumberFormat("en-EN", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 2,
              }).format(
                Number(
                  (itemInfo.unitAmount / 100).toFixed(2) * itemInfo.quantity
                )
              )}
            </p>
          </div>
          <ShoppingCartItemQuantity
            itemKey={stripePrice}
            existingQuantity={itemInfo.quantity}
          />
        </div>
      ))}
      <div className="flex justify-end mt-6 border-t-2 pt-2">
        <div>
          <span className="font-bold">Total: </span>
          <span className="font-bold">
            {new Intl.NumberFormat("en-EN", {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 2,
            }).format(
              Number(
                (
                  Object.keys(cartItems).reduce(
                    (acc, key) =>
                      cartItems[key].unitAmount * cartItems[key].quantity + acc,
                    0
                  ) / 100
                ).toFixed(2)
              )
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

const ShoppingCart = () => {
  return (
    <div>
      <h3 className="text-center font-bold mb-4">Your Cart</h3>
      <ShoppingCartItems />
    </div>
  );
};

export default ShoppingCart;
