import React, { useContext, useEffect } from "react";
import { gql } from "@apollo/client";
import {
  faCircleCheck,
  faCircleXmark,
} from "@fortawesome/free-regular-svg-icons";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useFetchStripeCheckoutSessionQuery } from "graphql/types";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import { CartContext } from "context/CartProvider";
import { formatIntegerToMoney } from "util/stringUtil";

export const FETCH_STRIPE_CHECKOUT_SESSION = gql`
  query FetchStripeCheckoutSession($id: ID!) {
    fetchCheckoutSession(id: $id) {
      id
      amountTotal
      lineItems {
        hasMore
        data {
          id
          amountTotal
          description
          quantity
        }
      }
    }
  }
`;

const OrderSuccess = () => {
  const [params] = useSearchParams();
  const checkoutId = params.get("checkout_id");
  const navigate = useNavigate();
  const location = useLocation();
  const { data, loading, error } = useFetchStripeCheckoutSessionQuery({
    variables: { id: checkoutId || "" },
  });
  const { clearCart } = useContext(CartContext);

  useEffect(() => {
    if (!checkoutId) {
      navigate("/");
    } else {
      clearCart();
    }
  }, [checkoutId]);

  if (error) {
    return (
      <div className="text-center">
        <p className="p-6 ">There was an issue retrieving the Stripe order.</p>
        <p className="p-6 mb-4 ">
          If you placed an order and were redirected here, please contact{" "}
          <a
            href="mailto:dairyfreeeats555@gmail.com"
            className="underline font-bold"
          >
            dairyfreeeats555@gmail.com
          </a>{" "}
          so I can investigate the issue!
        </p>
        <FontAwesomeIcon
          className="text-9xl text-red-700"
          icon={faCircleXmark}
        />
      </div>
    );
  }

  return (
    <div>
      {loading ? (
        <div className="text-center ">
          <FontAwesomeIcon className="text-6xl mb-6" spin icon={faSpinner} />
          <p>Loading order info...</p>
        </div>
      ) : (
        <>
          <div className="grid place-content-center text-center mb-4">
            <div className="bg-green-700 rounded w-80">
              <div className="font-bold text-2xl py-4 px-2 flex items-center gap-2 justify-center bg-green-600">
                <h3 className="">Order Successful</h3>
                <FontAwesomeIcon icon={faCircleCheck} />
              </div>
              <div className=" p-4 ">
                <div className="my-2">
                  {data?.fetchCheckoutSession?.lineItems?.data?.map((item) => {
                    return (
                      <p key={item.id}>
                        {item.description} x{item.quantity}
                      </p>
                    );
                  })}
                </div>
                {data?.fetchCheckoutSession?.amountTotal && (
                  <div className="border-t-2 mt-6 pt-2">
                    <p>
                      <strong className="font-bold">Total:</strong>{" "}
                      <span>
                        {formatIntegerToMoney(
                          Number(data?.fetchCheckoutSession?.amountTotal)
                        )}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="grid place-content-center">
            <div className="w-80 text-sm">
              <p className="mb-4">
                If you ordered using an email address that you can access, you
                should have received an email confirming that the order was
                received.
              </p>
              <p className="mb-4">
                Next, the order needs to be accepted by the admin for it to
                enter the active state (i.e. the order is being prepared). After
                that, the admin can mark the order as in-transit when the item
                is being delivered. Finally, when the order is delivered the
                admin may mark the order as completed.
              </p>
              <p className="font-bold">
                You should receive an email each time the order status is
                updated by the admin.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default OrderSuccess;
