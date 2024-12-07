import ImageLoader from "components/imageLoader/ImageLoader";
import { CartContext } from "context/CartProvider";
import { NotificationsContext } from "context/NotificationsProvider";
import { Price, Product, User } from "graphql/types";
import React, { useContext } from "react";
import { useForm } from "react-hook-form";

const OrderItem: React.FC<{
  currentUserIsAdmin: User["admin"];
  description: Product["description"];
  imageUrl: string;
  name: Product["name"];
  stripePriceId: Price["id"];
  unitAmount: Price["unitAmount"];
}> = ({
  stripePriceId,
  name,
  description,
  unitAmount,
  imageUrl,
  currentUserIsAdmin,
}) => {
  const { register, handleSubmit, reset } = useForm();
  const { addToCart } = useContext(CartContext);
  const { addNotification } = useContext(NotificationsContext);

  return (
    <form
      className="w-56 grid justify-center text-center"
      onSubmit={handleSubmit(async (data) => {
        const cartProductInfo = {
          description,
          name,
          unitAmount,
          quantity: parseInt(data[stripePriceId]),
          imageUrl,
          stripePriceId,
        };

        addToCart(cartProductInfo);
        addNotification(
          `${name} x${data[stripePriceId]} has been added to the cart!`
        );
        reset();
      })}
    >
      <ImageLoader
        alt={name}
        src={imageUrl}
        additionalClassName="cursor-pointer mb-2 w-[224px] h-[224px]"
      />
      <p className="font-bold text-lg mb-2 h-[60px]">{name}</p>
      <p className="mb-2 h-[60px]">{description}</p>
      <p className="mb-6">
        {new Intl.NumberFormat("en-EN", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 2,
        }).format(Number((unitAmount / 100).toFixed(2)))}
      </p>

      {!currentUserIsAdmin && (
        <>
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
          <button
            className="blue-button w-[224px] h-[45px]"
            id={`add-to-cart-${stripePriceId}`}
          >
            Add To Cart
          </button>
        </>
      )}
    </form>
  );
};

export default OrderItem;
