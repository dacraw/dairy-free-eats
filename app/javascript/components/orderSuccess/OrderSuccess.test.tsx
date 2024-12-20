import React from "react";
import { screen, render } from "@testing-library/react";
import OrderSuccess, {
  FETCH_STRIPE_CHECKOUT_SESSION,
} from "components/orderSuccess/OrderSuccess";
import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { MemoryRouter, Route, Routes } from "react-router";
import {
  FetchStripeCheckoutSessionQuery,
  FetchStripeCheckoutSessionQueryVariables,
  GetHomePageDemoVideoUrlQuery,
} from "graphql/types";
import Home, { HOME_PAGE_DEMO_VIDEO_URL } from "components/home/Home";
import { formatIntegerToMoney } from "util/stringUtil";

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
  FetchStripeCheckoutSessionQuery | GetHomePageDemoVideoUrlQuery,
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
  {
    request: { query: HOME_PAGE_DEMO_VIDEO_URL },
    result: {
      data: {
        demoVideoPresignedUrl: "",
      },
    },
    maxUsageCount: 2,
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

      expect(
        screen.getByText(formatIntegerToMoney(624700))
      ).toBeInTheDocument();
      expect(
        screen.getByText("Mixed Berry Smoothie (Water base) x1")
      ).toBeInTheDocument();
    });
  });

  describe("when there is no checkout_id param present", () => {
    it("redirects to the home page", async () => {
      render(
        <MockedProvider mocks={checkoutIdParamMissingMocks}>
          <MemoryRouter initialEntries={["/success"]}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/success" element={<OrderSuccess />} />
            </Routes>
          </MemoryRouter>
        </MockedProvider>
      );

      expect(
        await screen.findByText("Order Dairy Free Food")
      ).toBeInTheDocument();
    });
  });

  describe("when the checkout_id param is an invalid Stripe Checkout id", () => {
    it("renders error information on the page", async () => {
      render(
        <MockedProvider mocks={checkoutIdParamInvalidMocks}>
          <MemoryRouter
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
