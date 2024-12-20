import {
  faMinus,
  faPlus,
  faSpinner,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ImageLoader from "components/imageLoader/ImageLoader";
import { CartContext } from "context/CartProvider";
import {
  Error,
  OrderPageInput,
  useStripeCheckoutSessionCreateMutation,
} from "graphql/types";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router";
import { formatIntegerToMoney } from "util/stringUtil";

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

const ShoppingCartCheckoutButton = () => {
  const [createStripeCheckoutSession, { loading }] =
    useStripeCheckoutSessionCreateMutation();
  const [checkoutError, setStripeCheckoutSessionCreateError] = useState<
    Error[]
  >([]);

  const { cartItems } = useContext(CartContext);

  const handleSubmit = async () => {
    const items: OrderPageInput[] = [];

    Object.entries(cartItems).map(([price, { quantity }]) => {
      if (quantity === 0) return;

      items.push({ price, quantity });
    });

    const mutationData = await createStripeCheckoutSession({
      variables: {
        input: {
          stripeCheckoutSessionInput: {
            lineItems: items,
          },
        },
      },
    });

    if (mutationData?.data?.stripeCheckoutSessionCreate?.errors?.length) {
      setStripeCheckoutSessionCreateError(
        mutationData?.data?.stripeCheckoutSessionCreate?.errors
      );
      return;
    }

    const checkoutUrl =
      mutationData?.data?.stripeCheckoutSessionCreate?.stripeCheckoutSession
        ?.url;

    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    }
  };

  return (
    <div className={`grid justify-end my-2`}>
      {checkoutError.length > 0 &&
        checkoutError.map((error) => <p>{error.message}</p>)}
      {loading ? (
        <div className="green-button">
          <FontAwesomeIcon spin icon={faSpinner} />
        </div>
      ) : (
        <button
          className={`green-button`}
          onClick={(e) => {
            e.stopPropagation();
            handleSubmit();
          }}
        >
          Checkout
        </button>
      )}
    </div>
  );
};

const ShoppingCartItems = () => {
  const { cartItems } = useContext(CartContext);

  return (
    <div id="shopping-cart-contents">
      {Object.keys(cartItems).length > 0 ? (
        <div>
          {Object.entries(cartItems).map(([stripePrice, itemInfo]) => (
            <div
              key={stripePrice}
              className="grid grid-cols-[auto_1fr_auto] gap-x-4 items-center mb-6"
            >
              <ImageLoader
                alt={itemInfo.name}
                additionalClassName="w-16"
                src={itemInfo.imageUrl}
              />
              <div>
                <p className="font-bold">{itemInfo.name}</p>
                <p className="text-sm">{itemInfo.description}</p>
                <p className="tet-sm">
                  {formatIntegerToMoney(
                    Number(itemInfo.unitAmount * itemInfo.quantity)
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
                {formatIntegerToMoney(
                  Number(
                    Object.keys(cartItems).reduce(
                      (acc, key) =>
                        cartItems[key].unitAmount * cartItems[key].quantity +
                        acc,
                      0
                    )
                  )
                )}
              </span>
            </div>
          </div>

          <ShoppingCartCheckoutButton />
        </div>
      ) : (
        <div className="text-center">
          <p>Your cart currently has no items.</p>
          <p>
            Visit the{" "}
            <Link className="font-bold text-blue-400" to="/order">
              Order Page
            </Link>{" "}
            to add items.
          </p>
        </div>
      )}
    </div>
  );
};

const ShoppingCart = () => {
  return (
    <div id="shopping-cart">
      <ShoppingCartItems />
    </div>
  );
};

export default ShoppingCart;
