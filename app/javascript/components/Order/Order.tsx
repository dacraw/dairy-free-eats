import { gql } from "@apollo/client";
import {
  OrderPageInput,
  StripeCheckoutSessionCreatePayload,
  useGetProductsQuery,
  useStripeCheckoutSessionCreateMutation,
} from "graphql/types";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

export const GET_PRODUCTS = gql`
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

export const STRIPE_CHECKOUT_SESSION_CREATE = gql`
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
  const [
    stripeCheckoutSessionCreateError,
    setStripeCheckoutSessionCreateError,
  ] = useState<StripeCheckoutSessionCreatePayload["errors"] | null>(null);
  const { data: getProductsData, loading: getProductsLoading } =
    useGetProductsQuery();
  const [createStripeCheckoutSession, { data: stripeCheckoutSessionData }] =
    useStripeCheckoutSessionCreateMutation();

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
            const quantityInt = parseInt(quantity) || 0;
            if (quantityInt === 0) return;

            items.push({ price, quantity: quantityInt });
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
            mutationData?.data?.stripeCheckoutSessionCreate
              ?.stripeCheckoutSession?.url;

          if (checkoutUrl) {
            window.location.href = checkoutUrl;
          }
        })}
      >
        <div className="grid place-content-center h-48 md:border-2 md:m-2">
          {stripeCheckoutSessionCreateError &&
            stripeCheckoutSessionCreateError.map((error, i) => {
              return (
                <p key={i} className="text-red-700">
                  {error.message}
                </p>
              );
            })}
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
