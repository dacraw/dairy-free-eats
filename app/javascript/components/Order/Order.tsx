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
    <div className="grid place-content-center">
      <div className="p-4">
        <h5 className="font-bold md:px-6 text-center">
          Welcome to the order page!
        </h5>

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

            if (
              mutationData?.data?.stripeCheckoutSessionCreate?.errors?.length
            ) {
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
          <div className="grid place-content-center h-48 md:border-2 md:m-2 md:p-6">
            {stripeCheckoutSessionCreateError &&
              stripeCheckoutSessionCreateError.map((error, i) => {
                return (
                  <p key={i} className="text-red-700">
                    {error.message}
                  </p>
                );
              })}
            <div className="">
              <h5 className="mb-6">
                Enter the number of each item you would like to order and then
                click "Submit"
              </h5>
              <div className="grid grid-cols-[1fr_50px] gap-2">
                {products.map((product) => {
                  return (
                    <React.Fragment key={product.defaultPrice}>
                      <label htmlFor={product.defaultPrice}>
                        {product.name}
                      </label>
                      <input
                        className="border-2 self-center text-center"
                        type="number"
                        placeholder="0"
                        key={product.defaultPrice}
                        id={product.defaultPrice}
                        step={1}
                        min={1}
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
        <div className="md:p-6">
          <p>
            The items above are retrieved from the current Stripe products
            created in the Stripe dashboard.
          </p>
          <p>
            After entering a quantity for at least one item and clicking Submit,
            you will be redirected to the Stripe Checkout page.
          </p>
          <p>
            Please note that this is using a test API key, so no transaction
            will occur. However, please do not use real payment information when
            checking out.
          </p>
          <ul className="list-disc ml-4">
            <li>
              Use Test Credit Card number
              <strong className="font-bold"> 4242 4242 4242 4242</strong>
            </li>
            <li>
              Use an email address that you can receive emails to, in order to
              receive a confirmation email after the order.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Order;
