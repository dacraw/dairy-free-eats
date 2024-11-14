import { gql } from "@apollo/client";
import { useFetchStripeCheckoutSessionQuery } from "graphql/types";
import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

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

  if (!checkoutId) {
    return navigate("/");
  }

  const { data, loading } = useFetchStripeCheckoutSessionQuery({
    variables: { id: checkoutId },
  });

  return (
    <div>
      {loading ? (
        <div>Loading order info...</div>
      ) : (
        <div>
          <h3 className="text-xl">Order Successful</h3>

          <div>
            {data?.fetchCheckoutSession?.lineItems?.data?.map((item) => {
              return (
                <p key={item.id}>
                  {item.description} x{item.quantity}
                </p>
              );
            })}
          </div>
          {data?.fetchCheckoutSession?.amountTotal && (
            <div>
              <p>
                <strong className="font-bold">Total:</strong>{" "}
                <span>
                  {new Intl.NumberFormat("en-EN", {
                    style: "currency",
                    currency: "USD",
                    minimumFractionDigits: 2,
                  }).format(
                    Number(
                      (data?.fetchCheckoutSession?.amountTotal / 100).toFixed(2)
                    )
                  )}
                </span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderSuccess;
