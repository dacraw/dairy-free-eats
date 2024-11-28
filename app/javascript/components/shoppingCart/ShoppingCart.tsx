import React, { useEffect, useState } from "react";

const ShoppingCart = () => {
  const [items, setItems] = useState(null);

  useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems") || "");
    setItems(cartItems);
  }, []);

  if (!items) return null;

  return (
    <div>
      <h3 className="text-center font-bold mb-4">Your Cart</h3>
      <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 text-center">
        <h5 className="font-bold">Product</h5>
        <h5 className="font-bold">Qty</h5>
        <h5 className="font-bold">Price</h5>
        <h5 className="font-bold justify-self-end">Item Total</h5>

        {Object.entries(items).map(([stripePrice, itemInfo]) => (
          <React.Fragment key={stripePrice}>
            <p>{itemInfo.name}</p>
            <p>{itemInfo.quantity}</p>
            <p>
              {new Intl.NumberFormat("en-EN", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 2,
              }).format(Number((itemInfo.unitAmount / 100).toFixed(2)))}
            </p>
            <p className="justify-self-end">
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
          </React.Fragment>
        ))}
      </div>
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
                  Object.keys(items).reduce(
                    (acc, key) =>
                      items[key].unitAmount * items[key].quantity + acc,
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

export default ShoppingCart;
