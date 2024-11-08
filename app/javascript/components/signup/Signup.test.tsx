import React from "react";
import { render, screen } from "@testing-library/react";
import Signup, { CREATE_USER } from "components/signup/Signup";
import { BrowserRouter } from "react-router-dom";
import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

const validMocks: MockedResponse[] = [
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
  test("triggers the user create mutation with valid params", async () => {
    render(
      <MockedProvider mocks={validMocks} addTypename={false}>
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Signup />
        </BrowserRouter>
      </MockedProvider>
    );

    await userEvent.type(
      screen.getByRole("textbox", { name: /email/i }),
      "test@demo.com"
    );
    await userEvent.type(screen.getByLabelText("Password"), "password");
    await userEvent.type(screen.getByLabelText("Confirm Password"), "password");

    await userEvent.click(screen.getByRole("button", { name: /submit/i }));
  });

  test("it displays errors when there's an issue with a mutation", async () => {
    render(
      <MockedProvider mocks={invalidMocks} addTypename={false}>
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Signup />
        </BrowserRouter>
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
  });
});
