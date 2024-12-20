import { gql } from "@apollo/client";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import OrderItem from "components/Order/orderItem/OrderItem";
import {
  useCurrentUserQuery,
  useFetchCurrentUserOrdersQuery,
  useGetProductsQuery,
} from "graphql/types";
import React from "react";

export const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      stripeDefaultPriceId
      stripePriceUnitAmount
      stripeDescription
      stripeImages
      stripeName
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
  const { data: getProductsData, loading: getProductsLoading } =
    useGetProductsQuery();
  const { data: currentUserData } = useCurrentUserQuery();
  const { data: incompleteOrdersData, loading: ordersLoading } =
    useFetchCurrentUserOrdersQuery({ variables: { incomplete: true } });

  return (
    <>
      {getProductsLoading || ordersLoading ? (
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
          <h5 className="page-title">Welcome to the order page!</h5>
          <p className="mb-6 font-bold text-sm">
            Please read the information below this form before clicking
            "Submit", as it contains information regarding the information to be
            entered into the Stripe Checkout page in order to demo this process.
          </p>

          <div className="mb-6 p-2 md:m-2 md:p-6 dark-blue-background rounded">
            {incompleteOrdersData?.currentUserOrders?.length === 2 && (
              <p className="text-red-700 text-center font-bold mb-4">
                Please note: You currently have 2 incomplete orders and cannot
                place any more until at least one of these is completed.
              </p>
            )}
            <div className="flex flex-wrap gap-10 w-full justify-between sm:justify-normal ">
              {getProductsData?.products?.map((product) => {
                return (
                  <OrderItem
                    currentUserIsAdmin={Boolean(
                      currentUserData?.currentUser?.admin
                    )}
                    currentUserPresent={Boolean(currentUserData?.currentUser)}
                    key={product?.stripeDefaultPriceId}
                    description={product?.stripeDescription}
                    imageUrl={product?.stripeImages[0] || ""}
                    name={product?.stripeName}
                    stripePriceId={product?.stripeDefaultPriceId}
                    unitAmount={product?.stripePriceUnitAmount}
                  />
                );
              })}
            </div>
          </div>
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
