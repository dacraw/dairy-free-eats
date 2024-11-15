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
  UserInput,
} from "graphql/types";

const validUserInput: UserInput = {
  /* Commenting out to make demo'ing easier */
  // address: {
  //   city: "Some city",
  //   country: "Some country",
  //   line1: "123 St.",
  //   line2: "Apt 1111",
  //   postalCode: "12345",
  //   state: "Best state",
  // },
  // name: "Great Name",
  // phone: "123-456-7890",
  email: "test@demo.com",
  password: "password",
  passwordConfirmation: "password",
};

const validMocks: MockedResponse<
  CreateUserMutation | GetProductsQuery,
  CreateUserMutationVariables
>[] = [
  {
    request: {
      query: CREATE_USER,
      variables: {
        input: {
          userInput: validUserInput,
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

const invalidUserInput = {
  /* Commenting out to make demo'ing easier */
  // address: {
  //   city: "Some city",
  //   country: "Some country",
  //   line1: "123 St.",
  //   line2: "Apt 1111",
  //   postalCode: "12345",
  //   state: "Best state",
  // },
  // name: "Great Name",
  // phone: "123-456-7890",
  email: "test@demo.com",
  password: "password1",
  passwordConfirmation: "password2",
};

const invalidMocks: MockedResponse<
  CreateUserMutation | GetProductsQuery,
  CreateUserMutationVariables
>[] = [
  {
    request: {
      query: CREATE_USER,
      variables: {
        input: {
          userInput: invalidUserInput,
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

    /* Commenting out to make demo'ing easier */
    // // Address
    // await userEvent.type(
    //   screen.getByLabelText(/City/i),
    //   validUserInput.address.city
    // );

    // const countryInput = screen.getByLabelText(/Country/i);
    // await userEvent.clear(countryInput);
    // await userEvent.type(countryInput, validUserInput.address.country);

    // await userEvent.type(
    //   screen.getByLabelText(/Address 1/i),
    //   validUserInput.address.line1
    // );
    // await userEvent.type(
    //   screen.getByLabelText(/Address 2/i),
    //   validUserInput.address.line2!
    // );
    // await userEvent.type(
    //   screen.getByLabelText(/Postal Code/i),
    //   validUserInput.address.postalCode
    // );
    // await userEvent.type(
    //   screen.getByLabelText(/State/i),
    //   validUserInput.address.state
    // );

    // // Contact/login information
    // await userEvent.type(
    //   screen.getByLabelText(/Full Name/i),
    //   validUserInput.name
    // );
    // await userEvent.type(screen.getByLabelText(/Phone/i), validUserInput.phone);

    await userEvent.type(screen.getByLabelText(/email/i), validUserInput.email);
    await userEvent.type(
      screen.getByLabelText("Password"),
      validUserInput.password
    );
    await userEvent.type(
      screen.getByLabelText("Confirm Password"),
      validUserInput.passwordConfirmation
    );

    await userEvent.click(
      screen.getByRole("button", { name: /Create Account/i })
    );

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

    /* Commenting out to make demo'ing easier */
    // // Address
    // await userEvent.type(
    //   screen.getByLabelText(/City/i),
    //   invalidUserInput.address.city
    // );

    // const countryInput = screen.getByLabelText(/Country/i);
    // await userEvent.clear(countryInput);
    // await userEvent.type(countryInput, invalidUserInput.address.country);

    // await userEvent.type(
    //   screen.getByLabelText(/Address 1/i),
    //   invalidUserInput.address.line1
    // );
    // await userEvent.type(
    //   screen.getByLabelText(/Address 2/i),
    //   invalidUserInput.address.line2!
    // );
    // await userEvent.type(
    //   screen.getByLabelText(/Postal Code/i),
    //   invalidUserInput.address.postalCode
    // );
    // await userEvent.type(
    //   screen.getByLabelText(/State/i),
    //   invalidUserInput.address.state
    // );

    // // Contact/login information
    // await userEvent.type(
    //   screen.getByLabelText(/Full Name/i),
    //   invalidUserInput.name
    // );
    // await userEvent.type(
    //   screen.getByLabelText(/Phone/i),
    //   invalidUserInput.phone
    // );

    await userEvent.type(
      screen.getByLabelText(/email/i),
      invalidUserInput.email
    );
    await userEvent.type(
      screen.getByLabelText("Password"),
      invalidUserInput.password
    );
    await userEvent.type(
      screen.getByLabelText("Confirm Password"),
      invalidUserInput.passwordConfirmation
    );

    await userEvent.click(
      screen.getByRole("button", { name: /Create Account/i })
    );

    expect(
      await screen.findByText((content) => {
        return content.includes("Password Confirmation does not match");
      })
    ).toBeInTheDocument();

    expect(
      screen.queryByText("Blended mixed berries, filtered water")
    ).not.toBeInTheDocument();
  });
});
