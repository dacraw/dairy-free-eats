import { Price, Product } from "graphql/types";
import React from "react";

const OrderItem: React.FC<{
  description: Product["description"];
  imageUrl: string;
  name: Product["name"];
  stripePriceId: Price["id"];
  unitAmount: Price["unitAmount"];
}> = ({ stripePriceId, name, description, unitAmount, imageUrl }) => {
  return (
    <div className={`w-56 grid justify-center text-center`}>
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
          className="text-center h-6 w-10"
        />
      </div>
      <button className="blue-button">Add To Cart</button>
    </div>
  );
};

export default OrderItem;
