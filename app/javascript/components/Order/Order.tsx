import { gql } from "@apollo/client";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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

  return (
    <>
      {getProductsLoading ? (
        <>
          <FontAwesomeIcon
            className="block text-9xl mx-auto mb-6"
            icon={faSpinner}
            spin
          />
          <p className="text-center">Loading products from Stripe...</p>
        </>
      ) : (
        <>
          <h5 className="font-bold md:px-6 text-center text-xl mb-6 animate-home-title-shimmer">
            Welcome to the order page!
          </h5>
          <p className="mb-6 font-bold text-sm">
            Please read the information below this form before clicking
            "Submit", as it contains information regarding the information to be
            entered into the Stripe Checkout page in order to demo this process.
          </p>

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
            className="grid justify-center"
          >
            <div className="mb-6 p-2 md:m-2 md:p-6 md:w-96 dark-blue-background rounded">
              {stripeCheckoutSessionCreateError &&
                stripeCheckoutSessionCreateError.map((error, i) => {
                  return (
                    <p key={i} className="text-red-700">
                      {error.message}
                    </p>
                  );
                })}
              <div className="">
                <h6 className="mb-8 pb-2 border-b-2 text-center text-lg font-bold ">
                  ORDER FORM
                </h6>
                <div className="grid grid-cols-[1fr_50px] gap-2">
                  {getProductsData?.listProducts?.data?.map((product) => {
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
                  <input
                    type="submit"
                    className="col-span-2 green-button mt-2"
                  />
                </div>
              </div>
            </div>
          </form>
          <div className="md:p-6">
            <h6 className="font-bold text-lg border-b-2 pb-2 mb-6 text-center">
              Stripe Checkout Page Instructions
            </h6>
            <div className="mb-6 pb-2 border-b-2">
              <strong className="font-bold">TLDR:</strong>
              <ul className="list-disc ml-4">
                <li>
                  Enter an email that you have access to if you want to receive
                  emails sent during the order process (this will be pre-filled
                  for you if you signed up on this app)
                </li>
                <li>Use Test Credit Card # 4242424242424242</li>
                <li>Enter arbitrary values for everything else</li>
              </ul>
            </div>
            <p className="mb-2">
              On the Stripe Checkout page that you will be redirected to after
              entering a quantity for at least one item above and clicking
              "Submit", please use the following values:
            </p>
            <ul className="list-disc ml-4 mb-2">
              <li>
                <strong className="font-bold">Email:</strong> This will be
                pre-filled if you have an account on this app; otherwise, enter
                any email you can receive messages to if you want to demo the
                email functionality from the Stripe webhook configuration of
                this app (if you don't care to receive the emails, you can enter
                any arbitrary email formatted value such as "test@demo.com")
              </li>
              <li>
                <strong className="font-bold">Credit Card number:</strong> 4242
                4242 4242 4242 (this is a test credit card number, feel free to
                use any of the{" "}
                <a
                  href="https://docs.stripe.com/testing#cards"
                  className="text-blue-700"
                >
                  Test Card Numbers provided by Stripe
                </a>
                )
              </li>
              <li>
                <strong className="font-bold">
                  Credit Card expiration date:
                </strong>{" "}
                Any month/year value in the future (e.g. "03/28")
              </li>
              <li>
                <strong className="font-bold">Credit Card CVC:</strong> Any 3
                consecutive numbers (e.g. "123")
              </li>
              <li>
                <strong className="font-bold">Cardholder name:</strong> Any
                white space delimited, two string combination (e.g. "Beebo
                Rado")
              </li>
              <li>
                <strong className="font-bold">Zip:</strong> Any consecutive 5
                numbers (e.g. "12345")
              </li>
            </ul>
            <p className="text-sm">
              Please note that the checkout is using a test API key to simulate
              real transactions, so no charges will occur. Regardless,{" "}
              <strong className="font-bold">
                please do not use real credit card information when checking
                out.
              </strong>
            </p>
          </div>
        </>
      )}
    </>
  );
};

export default Order;
