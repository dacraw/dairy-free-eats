import React from "react";
import { screen, render } from "@testing-library/react";
import Order, {
  GET_PRODUCTS,
  STRIPE_CHECKOUT_SESSION_CREATE,
} from "components/Order/Order";
import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import {
  GetProductsQuery,
  StripeCheckoutSessionCreateMutation,
  StripeCheckoutSessionCreateMutationVariables,
} from "graphql/types";
import userEvent from "@testing-library/user-event";

describe("<Order />", () => {
  describe("with successful GraphQL operations", () => {
    let successfulMocks: MockedResponse<
      GetProductsQuery | StripeCheckoutSessionCreateMutation,
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
                    defaultPrice: "price_12345",
                    description: "Blended mixed berries, filtered water",
                    name: "Mixed Berry Smoothie (Water base)",
                  },
                  {
                    defaultPrice: "price_54321",
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
        await screen.findByLabelText("Mixed Berry Smoothie (Water base)")
      ).toBeInTheDocument();
      expect(
        await screen.findByLabelText("Breakfast Burrito")
      ).toBeInTheDocument();
    });

    it("allows the order to be submitted with input", async () => {
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

      const firstProductInput = await screen.findByLabelText(
        "Mixed Berry Smoothie (Water base)"
      );

      expect(firstProductInput).toBeInTheDocument();
      expect(
        await screen.findByLabelText("Breakfast Burrito")
      ).toBeInTheDocument();

      await userEvent.type(firstProductInput, "1");
      await userEvent.click(screen.getByRole("button", { name: /Submit/i }));

      expect(window.location.href).toBe("http://www.mocked.com/");
    });
  });

  describe("when there's an error", () => {
    it("renders an error when at least one quantity must be entered", async () => {
      const unsuccessfulMocks: MockedResponse<
        GetProductsQuery | StripeCheckoutSessionCreateMutation,
        StripeCheckoutSessionCreateMutationVariables
      >[] = [
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
                    defaultPrice: "price_12345",
                    description: "Blended mixed berries, filtered water",
                    name: "Mixed Berry Smoothie (Water base)",
                  },
                  {
                    defaultPrice: "price_54321",
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
                  lineItems: [],
                },
              },
            },
          },
          result: {
            data: {
              stripeCheckoutSessionCreate: {
                stripeCheckoutSession: null,
                errors: [
                  {
                    message: "You must enter a quantity for at least one item.",
                  },
                ],
              },
            },
          },
        },
      ];
      render(
        <MockedProvider addTypename={false} mocks={unsuccessfulMocks}>
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
        await screen.findByLabelText("Mixed Berry Smoothie (Water base)")
      ).toBeInTheDocument();
      expect(
        await screen.findByLabelText("Breakfast Burrito")
      ).toBeInTheDocument();

      await userEvent.click(screen.getByRole("button", { name: /Submit/i }));

      expect(
        screen.getByText("You must enter a quantity for at least one item.")
      ).toBeInTheDocument();
    });

    it("renders an error when there's an issue with creating the stripe checkout session", async () => {
      const unsuccessfulMocks: MockedResponse<
        GetProductsQuery | StripeCheckoutSessionCreateMutation,
        StripeCheckoutSessionCreateMutationVariables
      >[] = [
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
                    defaultPrice: "price_12345",
                    description: "Blended mixed berries, filtered water",
                    name: "Mixed Berry Smoothie (Water base)",
                  },
                  {
                    defaultPrice: "price_54321",
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
                stripeCheckoutSession: null,
                errors: [
                  {
                    message:
                      "Unfortunately, there is an issue with the Stripe checkout at this time. Please try again later.",
                  },
                ],
              },
            },
          },
        },
      ];

      render(
        <MockedProvider addTypename={false} mocks={unsuccessfulMocks}>
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

      const firstProductInput = await screen.findByLabelText(
        "Mixed Berry Smoothie (Water base)"
      );

      expect(firstProductInput).toBeInTheDocument();
      expect(
        await screen.findByLabelText("Breakfast Burrito")
      ).toBeInTheDocument();

      await userEvent.type(firstProductInput, "1");
      await userEvent.click(screen.getByRole("button", { name: /Submit/i }));

      expect(
        screen.getByText(
          "Unfortunately, there is an issue with the Stripe checkout at this time. Please try again later."
        )
      ).toBeInTheDocument();
    });
  });
});
