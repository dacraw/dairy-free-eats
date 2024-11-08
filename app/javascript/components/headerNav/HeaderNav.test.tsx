import React from "react";
import { screen, render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import HeaderNav, {
  CURRENT_USER,
  SESSION_DELETE,
} from "components/headerNav/HeaderNav";
import {
  CurrentUserQuery,
  SessionDeleteMutation,
  SessionDeleteMutationResult,
} from "graphql/types";
import userEvent from "@testing-library/user-event";

describe("<HeaderNav />", () => {
  let currentUserPresentMocks: MockedResponse<
    CurrentUserQuery | SessionDeleteMutation
  >[];

  describe("when there is a current user", () => {
    beforeEach(() => {
      currentUserPresentMocks = [
        {
          request: { query: CURRENT_USER },
          result: {
            data: {
              currentUser: {
                id: "1",
                email: "test@demo.com",
              },
            },
          },
        },
        {
          request: { query: SESSION_DELETE },
          result: {
            data: {
              sessionDelete: {
                user: null,
                errors: [],
              },
            },
          },
        },
        {
          request: { query: CURRENT_USER },
          result: {
            data: {
              currentUser: null,
            },
          },
        },
      ];
    });

    it("displays the current user's email", async () => {
      render(
        <MockedProvider mocks={currentUserPresentMocks} addTypename={false}>
          <BrowserRouter
            future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
          >
            <HeaderNav />
          </BrowserRouter>
        </MockedProvider>
      );

      const target = await screen.findAllByText("test@demo.com");

      expect(target[0]).toBeInTheDocument();
    });

    it("says 'Logging Out' while logging out", async () => {
      currentUserPresentMocks[1].delay = Infinity;

      render(
        <MockedProvider mocks={currentUserPresentMocks} addTypename={false}>
          <BrowserRouter
            future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
          >
            <HeaderNav />
          </BrowserRouter>
        </MockedProvider>
      );

      const target = await screen.findAllByText("test@demo.com");
      expect(target[0]).toBeInTheDocument();

      const logoutButton = await screen.findAllByRole("button", {
        name: "Logout",
      });
      expect(logoutButton[0]).toBeInTheDocument();

      userEvent.click(logoutButton[0]);
      expect(await screen.findAllByText("Logging Out")).toBeTruthy();
    });

    it("clicking logout invokes the session delete mutation", async () => {
      render(
        <MockedProvider mocks={currentUserPresentMocks} addTypename={false}>
          <BrowserRouter
            future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
          >
            <HeaderNav />
          </BrowserRouter>
        </MockedProvider>
      );

      const target = await screen.findAllByText("test@demo.com");
      expect(target[0]).toBeInTheDocument();

      const logoutButton = await screen.findAllByRole("button", {
        name: "Logout",
      });
      expect(logoutButton[0]).toBeInTheDocument();

      await userEvent.click(logoutButton[0]);

      const target2 = await screen.findAllByText("test@demo.com");

      expect(target2[0]).not.toBeInTheDocument();
    });
  });

  describe("when there is no current user", () => {
    beforeEach(() => {
      currentUserPresentMocks = [
        {
          request: { query: CURRENT_USER },
          result: {
            data: {
              currentUser: null,
            },
          },
        },
      ];
    });
    it("does not show the user email", async () => {
      render(
        <MockedProvider mocks={currentUserPresentMocks} addTypename={false}>
          <BrowserRouter
            future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
          >
            <HeaderNav />
          </BrowserRouter>
        </MockedProvider>
      );

      expect(screen.queryAllByText("Logging Out")).toHaveLength(0);
    });
  });
});
