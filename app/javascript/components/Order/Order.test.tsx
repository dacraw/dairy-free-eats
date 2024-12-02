import React from "react";
import { screen, render } from "@testing-library/react";
import Order, {
  GET_PRODUCTS,
  STRIPE_CHECKOUT_SESSION_CREATE,
} from "components/Order/Order";
import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import {
  CurrentUserQuery,
  GetProductsQuery,
  StripeCheckoutSessionCreateMutation,
  StripeCheckoutSessionCreateMutationVariables,
} from "graphql/types";
import userEvent from "@testing-library/user-event";
import { CURRENT_USER } from "components/headerNav/HeaderNav";

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

describe("<Order />", () => {
  describe("with successful GraphQL operations", () => {
    let successfulMocks: MockedResponse<
      GetProductsQuery | CurrentUserQuery | StripeCheckoutSessionCreateMutation,
      StripeCheckoutSessionCreateMutationVariables
    >[];
    beforeEach(() => {
      successfulMocks = [
        {
          request: {
            query: GET_PRODUCTS,
          },
          result: {
            data: {
              listProducts: {
                stripeObject: "list",
                hasMore: false,
                url: "/v1/products",
                data: [
                  {
                    defaultPrice: { id: "price_12345", unitAmount: 300 },
                    images: ["picture1"],
                    description: "Blended mixed berries, filtered water",
                    name: "Mixed Berry Smoothie (Water base)",
                  },
                  {
                    defaultPrice: { id: "price_54321", unitAmount: 400 },
                    images: ["imageString"],
                    description:
                      "2 salted/peppered eggs, 2 strips of bacon, hummis",
                    name: "Breakfast Burrito",
                  },
                ],
              },
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
          <MemoryRouter
            initialEntries={["/order"]}
            future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
          >
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
});
