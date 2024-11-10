import React from "react";
import { render, screen } from "@testing-library/react";
import Signup, { CREATE_USER } from "components/signup/Signup";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import userEvent from "@testing-library/user-event";
import Order, { GET_PRODUCTS } from "components/Order/Order";
import {
  CreateUserMutation,
  CreateUserMutationVariables,
  GetProductsQuery,
} from "graphql/types";

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve([
        {
          default_price: "price_5555",
          description: "Blended mixed berries, filtered water",
          name: "Mixed Berry Smoothie (Water base)",
        },
        {
          default_price: "price_4444",
          description: "2 salted/peppered eggs, 2 strips of bacon, hummis",
          name: "Breakfast Burrito",
        },
      ]),
  })
) as jest.Mock;

const validMocks: MockedResponse<
  CreateUserMutation | GetProductsQuery,
  CreateUserMutationVariables
>[] = [
  {
    request: {
      query: CREATE_USER,
      variables: {
        input: {
          userInput: {
            email: "test@demo.com",
            password: "password",
            passwordConfirmation: "password",
          },
        },
      },
    },
    result: {
      data: {
        userCreate: {
          user: {
            id: "1",
            email: "2",
          },
          errors: [],
        },
      },
    },
  },
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
              description: "2 salted/peppered eggs, 2 strips of bacon, hummis",
              name: "Breakfast Burrito",
            },
          ],
        },
      },
    },
  },
];

const invalidMocks: MockedResponse[] = [
  {
    request: {
      query: CREATE_USER,
      variables: {
        input: {
          userInput: {
            email: "test@demo.com",
            password: "password1",
            passwordConfirmation: "password2",
          },
        },
      },
    },
    result: {
      data: {
        userCreate: {
          user: null,
          errors: [
            {
              path: ["attributes", "passwordConfirmation"],
              message: "does not match",
            },
          ],
        },
      },
    },
  },
];

describe("<Signup />", () => {
  afterEach(() => jest.restoreAllMocks());

  test("triggers the user create mutation with valid params and redirects to the order page", async () => {
    render(
      <MockedProvider mocks={validMocks} addTypename={false}>
        <MemoryRouter
          initialEntries={["/signup"]}
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/order" element={<Order />} />
          </Routes>
        </MemoryRouter>
      </MockedProvider>
    );

    await userEvent.type(
      screen.getByRole("textbox", { name: /email/i }),
      "test@demo.com"
    );
    await userEvent.type(screen.getByLabelText("Password"), "password");
    await userEvent.type(screen.getByLabelText("Confirm Password"), "password");

    await userEvent.click(screen.getByRole("button", { name: /submit/i }));

    expect(
      await screen.findByText("Mixed Berry Smoothie (Water base)")
    ).toBeInTheDocument();
  });

  test("it displays errors when there's an issue with a mutation and does not redirect to order page", async () => {
    render(
      <MockedProvider mocks={invalidMocks} addTypename={false}>
        <MemoryRouter
          initialEntries={["/signup"]}
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/order" element={<Order />} />
          </Routes>
        </MemoryRouter>
      </MockedProvider>
    );

    await userEvent.type(
      screen.getByRole("textbox", { name: /email/i }),
      "test@demo.com"
    );
    await userEvent.type(screen.getByLabelText("Password"), "password1");
    await userEvent.type(
      screen.getByLabelText("Confirm Password"),
      "password2"
    );

    await userEvent.click(screen.getByRole("button", { name: /submit/i }));

    expect(
      screen.getByText((content) => {
        return content.includes("Password Confirmation does not match");
      })
    ).toBeInTheDocument();

    expect(
      screen.queryByText("Blended mixed berries, filtered water")
    ).not.toBeInTheDocument();
  });
});
