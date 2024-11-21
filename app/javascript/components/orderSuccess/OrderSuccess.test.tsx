import React from "react";
import { screen, render } from "@testing-library/react";
import OrderSuccess, {
  FETCH_STRIPE_CHECKOUT_SESSION,
} from "components/orderSuccess/OrderSuccess";
import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import {
  FetchStripeCheckoutSessionQuery,
  FetchStripeCheckoutSessionQueryVariables,
} from "graphql/types";
import Home from "components/Home";

const validMocks: MockedResponse<
  FetchStripeCheckoutSessionQuery,
  FetchStripeCheckoutSessionQueryVariables
>[] = [
  {
    request: {
      query: FETCH_STRIPE_CHECKOUT_SESSION,
      variables: {
        id: "cs_test_a1D2NebdAudpPiucybElBFWapFaucAX27qC1lOyp8rRoLHef40fLy5vV0g",
      },
    },
    result: {
      data: {
        fetchCheckoutSession: {
          id: "cs_test_a1D2NebdAudpPiucybElBFWapFaucAX27qC1lOyp8rRoLHef40fLy5vV0g",
          amountTotal: 624700,
          lineItems: {
            hasMore: false,
            data: [
              {
                id: "li_1QKQTcElA4InVgv8UgpyYLXg",
                amountTotal: 300,
                description: "Mixed Berry Smoothie (Water base)",
                quantity: 1,
              },
            ],
          },
        },
      },
    },
  },
];

const checkoutIdParamMissingMocks: MockedResponse<
  FetchStripeCheckoutSessionQuery,
  FetchStripeCheckoutSessionQueryVariables
>[] = [
  {
    request: {
      query: FETCH_STRIPE_CHECKOUT_SESSION,
      variables: { id: "" },
    },
    result: {
      data: {
        fetchCheckoutSession: null,
      },
    },
  },
];

const checkoutIdParamInvalidMocks: MockedResponse<
  FetchStripeCheckoutSessionQuery,
  FetchStripeCheckoutSessionQueryVariables
>[] = [
  {
    request: {
      query: FETCH_STRIPE_CHECKOUT_SESSION,
      variables: { id: "invalid_id" },
    },
    error: new Error("An error occurred"),
  },
];

describe("<OrderSuccess />", () => {
  describe("when there is a checkout_id search param", () => {
    it("renders the order items and amount total", async () => {
      render(
        <MockedProvider mocks={validMocks}>
          <MemoryRouter
            future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
            initialEntries={[
              {
                pathname: "/success",
                search: "?checkout_id=" + validMocks[0].request.variables?.id,
              },
            ]}
          >
            <Routes>
              <Route path="/success" element={<OrderSuccess />} />
            </Routes>
          </MemoryRouter>
        </MockedProvider>
      );

      expect(await screen.findByText("Order Successful")).toBeInTheDocument();

      expect(screen.getByText("$6,247.00")).toBeInTheDocument();
      expect(
        screen.getByText("Mixed Berry Smoothie (Water base) x1")
      ).toBeInTheDocument();
    });
  });

  describe("when there is no checkout_id param present", () => {
    it("redirects to the home page", async () => {
      render(
        <MockedProvider mocks={checkoutIdParamMissingMocks}>
          <MemoryRouter
            future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
            initialEntries={["/success"]}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/success" element={<OrderSuccess />} />
            </Routes>
          </MemoryRouter>
        </MockedProvider>
      );

      expect(
        await screen.findByText(
          "Order lactose-free food that is tasty and affordable"
        )
      ).toBeInTheDocument();
    });
  });

  describe("when the checkout_id param is an invalid Stripe Checkout id", () => {
    it("renders error information on the page", async () => {
      render(
        <MockedProvider mocks={checkoutIdParamInvalidMocks}>
          <MemoryRouter
            future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
            initialEntries={[
              {
                pathname: "/success",
                search: "?checkout_id=" + "invalid_id",
              },
            ]}
          >
            <Routes>
              <Route path="/success" element={<OrderSuccess />} />
            </Routes>
          </MemoryRouter>
        </MockedProvider>
      );

      expect(
        await screen.findByText(
          "There was an issue retrieving the Stripe order."
        )
      ).toBeInTheDocument();
    });
  });
});
