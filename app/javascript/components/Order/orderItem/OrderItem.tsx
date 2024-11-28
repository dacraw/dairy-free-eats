import { OrderPageInput, Price, Product } from "graphql/types";
import React from "react";
import { useForm } from "react-hook-form";

const OrderItem: React.FC<{
  description: Product["description"];
  imageUrl: string;
  name: Product["name"];
  stripePriceId: Price["id"];
  unitAmount: Price["unitAmount"];
}> = ({ stripePriceId, name, description, unitAmount, imageUrl }) => {
  const { register, handleSubmit } = useForm();
  return (
    <form
      className="w-56 grid justify-center text-center"
      onSubmit={handleSubmit(async (data) => {
        const cartProductInfo = {
          description,
          name,
          unitAmount,
          quantity: parseInt(data[stripePriceId]),
        };

        const existingCartItems = JSON.parse(localStorage.getItem("cartItems"));

        if (!existingCartItems) {
          localStorage.setItem(
            "cartItems",
            JSON.stringify({ [stripePriceId]: cartProductInfo })
          );
        } else if (existingCartItems[stripePriceId]) {
          const existingQuantity = parseInt(
            existingCartItems[stripePriceId].quantity
          );
          existingCartItems[stripePriceId].quantity =
            cartProductInfo.quantity + existingQuantity;
          localStorage.setItem("cartItems", JSON.stringify(existingCartItems));
        } else {
          existingCartItems[stripePriceId] = cartProductInfo;
          localStorage.setItem("cartItems", JSON.stringify(existingCartItems));
        }
      })}
    >
      <img src={imageUrl} className="cursor-pointer mb-2" />
      <p className="font-bold text-lg mb-2">{name}</p>
      <p className="mb-2">{description}</p>
      <p className="mb-6">
        {new Intl.NumberFormat("en-EN", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 2,
        }).format(Number((unitAmount / 100).toFixed(2)))}
      </p>
      <div className=" mb-4">
        <label htmlFor={`qty-${stripePriceId}`} className="mr-4">
          Quantity:
        </label>
        <input
          id={`qty-${stripePriceId}`}
          type="number"
          min={1}
          {...register(stripePriceId)}
          className="text-center h-6 w-10"
        />
      </div>
      <button className="blue-button">Add To Cart</button>
    </form>
  );
};

export default OrderItem;
