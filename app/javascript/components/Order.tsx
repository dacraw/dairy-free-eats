import { gql } from "@apollo/client";
import {
  OrderPageInput,
  useGetProductsQuery,
  useStripeCheckoutSessionCreateMutation,
} from "graphql/types";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

const GET_PRODUCTS = gql`
  query GetProducts {
    listProducts {
      stripeObject
      hasMore
      url
      data {
        defaultPrice
        description
        name
      }
    }
  }
`;

const STRIPE_CHECKOUT_SESSION_CREATE = gql`
  mutation StripeCheckoutSessionCreate(
    $input: StripeCheckoutSessionCreateInput!
  ) {
    stripeCheckoutSessionCreate(input: $input) {
      stripeCheckoutSession {
        url
      }
      errors {
        message
      }
    }
  }
`;

const Order = () => {
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState<string | null>(null);
  const { data: getProductsData } = useGetProductsQuery();
  const [createStripeCheckoutSession, { data: stripeCheckoutSessionData }] =
    useStripeCheckoutSessionCreateMutation();

  // const onSubmit = async (data) => {
  //   const items: OrderPageInput[] = [];
  //   Object.entries(data).map(([productId, quantity]) => {
  //     items.push({ productId, quantity: parseInt(quantity) || 0 });
  //   });
  //   console.log(items);
  //   await createStripeCheckoutSession
  //   // const csrfToken = getCsrfToken();

  //   // if (!csrfToken) return null;
  //   // const url = "/api/v1/stripe/create_checkout_session";
  //   // const response = await fetch(url, {
  //   //   method: "POST",
  //   //   body: JSON.stringify({ stripe: data }),
  //   //   headers: {
  //   //     "X-CSRF-Token": csrfToken,
  //   //     "Content-Type": "application/json",
  //   //   },
  //   // });
  //   // const responseData = await response.json();

  //   // if (!response.ok) {
  //   //   setError(responseData.message);
  //   //   return;
  //   // }

  //   // window.location.href = responseData.checkout_url;
  // };

  if (!getProductsData) return null;
  const {
    listProducts: { data: products },
  } = getProductsData;
  if (!products) return null;

  return (
    <>
      <p>Welcome to the order page!</p>

      <form
        onSubmit={handleSubmit(async (data) => {
          const items: OrderPageInput[] = [];
          Object.entries(data).map(([price, quantity]) => {
            items.push({ price, quantity: parseInt(quantity) || 0 });
          });
          console.log(items);
          const mutationData = await createStripeCheckoutSession({
            variables: {
              input: {
                stripeCheckoutSessionInput: {
                  lineItems: items,
                },
              },
            },
          });

          console.log(mutationData);
        })}
      >
        <div className="grid place-content-center h-48 md:border-2 md:m-2">
          {error && <p className="text-red-700">{error}</p>}
          <div>
            <h5 className="mb-6">
              Enter the number of each item you would like to order and then
              click "Submit"
            </h5>
            <div className="grid grid-cols-[1fr_50px] gap-2">
              {products.map((product) => {
                return (
                  <React.Fragment key={product.defaultPrice}>
                    <label htmlFor={product.defaultPrice}>{product.name}</label>
                    <input
                      className="border-2 self-center text-center"
                      type="number"
                      placeholder="0"
                      key={product.defaultPrice}
                      id={product.defaultPrice}
                      {...register(product.defaultPrice)}
                    />
                  </React.Fragment>
                );
              })}
              <input type="submit" className="col-span-2 green-button" />
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default Order;
