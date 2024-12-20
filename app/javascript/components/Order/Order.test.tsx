import React from "react";
import { screen, render } from "@testing-library/react";
import Order, {
  GET_PRODUCTS,
  STRIPE_CHECKOUT_SESSION_CREATE,
} from "components/Order/Order";
import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { MemoryRouter, Route, Routes } from "react-router";
import {
  CurrentUserQuery,
  FetchCurrentUserOrdersQuery,
  FetchCurrentUserOrdersQueryVariables,
  GetProductsQuery,
  OrderStatus,
  StripeCheckoutSessionCreateMutation,
  StripeCheckoutSessionCreateMutationVariables,
} from "graphql/types";
import userEvent from "@testing-library/user-event";
import { CURRENT_USER } from "components/headerNav/HeaderNav";
import { FETCH_CURRENT_USER_ORDERS } from "components/orderChatPanels/OrderChatPanels";

const currentUserMock = {
  request: { query: CURRENT_USER },
  result: {
    data: {
      currentUser: {
        id: "1",
        admin: false,
        email: "someuser@test.com",
      },
    },
  },
};

const products = [
  {
    stripeDefaultPriceId: "price_12345",
    stripePriceUnitAmount: 300,
    stripeImages: ["picture1"],
    stripeDescription: "Blended mixed berries, filtered water",
    stripeName: "Mixed Berry Smoothie (Water base)",
  },
  {
    stripeDefaultPriceId: "price_54321",
    stripePriceUnitAmount: 400,
    stripeImages: ["imageString"],
    stripeDescription: "2 salted/peppered eggs, 2 strips of bacon, hummis",
    stripeName: "Breakfast Burrito",
  },
];

const twoIncompleteOrderMocks: MockedResponse<
  GetProductsQuery | CurrentUserQuery | FetchCurrentUserOrdersQuery,
  FetchCurrentUserOrdersQueryVariables
>[] = [
  {
    request: {
      query: GET_PRODUCTS,
    },
    result: {
      data: {
        products,
      },
    },
  },
  {
    request: {
      query: FETCH_CURRENT_USER_ORDERS,
      variables: { incomplete: true },
    },
    result: {
      data: {
        currentUserOrders: [
          {
            id: "1",
            amountTotal: 600,
            createdAt: "createdat",
            guestEmail: null,
            updatedAt: "updatedat",
            status: OrderStatus.InTransit,
            completedAt: null,
            stripeCheckoutSessionLineItems: [
              {
                imageUrl: "image",
                name: "name",
                quantity: 1,
                unitAmount: 600,
              },
            ],
            user: {
              id: "1",
              email: "useremail",
            },
          },
          {
            id: "2",
            amountTotal: 600,
            createdAt: "createdat",
            guestEmail: null,
            updatedAt: "updatedat",
            status: OrderStatus.InTransit,
            completedAt: null,
            stripeCheckoutSessionLineItems: [
              {
                imageUrl: "image",
                name: "name",
                quantity: 1,
                unitAmount: 600,
              },
            ],
            user: {
              id: "1",
              email: "useremail",
            },
          },
        ],
      },
    },
  },
  currentUserMock,
];

describe("<Order />", () => {
  describe("with successful GraphQL operations", () => {
    let successfulMocks: MockedResponse<
      | GetProductsQuery
      | CurrentUserQuery
      | StripeCheckoutSessionCreateMutation
      | FetchCurrentUserOrdersQuery,
      | StripeCheckoutSessionCreateMutationVariables
      | FetchCurrentUserOrdersQueryVariables
    >[];
    beforeEach(() => {
      successfulMocks = [
        {
          request: {
            query: GET_PRODUCTS,
          },
          result: {
            data: {
              products,
            },
          },
        },
        {
          request: {
            query: STRIPE_CHECKOUT_SESSION_CREATE,
            variables: {
              input: {
                stripeCheckoutSessionInput: {
                  lineItems: [{ price: "price_12345", quantity: 1 }],
                },
              },
            },
          },
          result: {
            data: {
              stripeCheckoutSessionCreate: {
                stripeCheckoutSession: {
                  url: "http://www.mocked.com",
                },
                errors: [],
              },
            },
          },
        },
        {
          request: {
            query: FETCH_CURRENT_USER_ORDERS,
            variables: { incomplete: true },
          },
          result: {
            data: {
              currentUserOrders: [
                {
                  id: "1",
                  amountTotal: 600,
                  createdAt: "createdat",
                  guestEmail: null,
                  updatedAt: "updatedat",
                  status: OrderStatus.InTransit,
                  completedAt: null,
                  stripeCheckoutSessionLineItems: [
                    {
                      imageUrl: "image",
                      name: "name",
                      quantity: 1,
                      unitAmount: 600,
                    },
                  ],
                  user: {
                    id: "1",
                    email: "useremail",
                  },
                },
                {
                  id: "2",
                  amountTotal: 600,
                  createdAt: "createdat",
                  guestEmail: null,
                  updatedAt: "updatedat",
                  status: OrderStatus.InTransit,
                  completedAt: null,
                  stripeCheckoutSessionLineItems: [
                    {
                      imageUrl: "image",
                      name: "name",
                      quantity: 1,
                      unitAmount: 600,
                    },
                  ],
                  user: {
                    id: "1",
                    email: "useremail",
                  },
                },
              ],
            },
          },
        },
        currentUserMock,
      ];

      Object.defineProperty(window, "location", {
        configurable: true,
        enumerable: true,
        value: new URL(window.location.href),
      });
    });

    let originalWindowLocation = window.location;

    afterEach(() => {
      Object.defineProperty(window, "location", {
        configurable: true,
        enumerable: true,
        value: originalWindowLocation,
      });
    });

    it("renders", async () => {
      render(
        <MockedProvider addTypename={false} mocks={successfulMocks}>
          <MemoryRouter initialEntries={["/order"]}>
            <Routes>
              <Route path="/order" element={<Order />} />
            </Routes>
          </MemoryRouter>
        </MockedProvider>
      );

      expect(
        await screen.findByText("Welcome to the order page!")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Mixed Berry Smoothie (Water base)")
      ).toBeInTheDocument();
      expect(screen.getByText("Breakfast Burrito")).toBeInTheDocument();
    });
  });

  describe("when the current user has two incomplete orders", () => {
    it("notifies the user of this on the page", async () => {
      render(
        <MockedProvider addTypename={false} mocks={twoIncompleteOrderMocks}>
          <MemoryRouter initialEntries={["/order"]}>
            <Routes>
              <Route path="/order" element={<Order />} />
            </Routes>
          </MemoryRouter>
        </MockedProvider>
      );

      expect(
        await screen.findByText(
          "Please note: You currently have 2 incomplete orders and cannot place any more until at least one of these is completed."
        )
      ).toBeInTheDocument();
    });
  });
});
