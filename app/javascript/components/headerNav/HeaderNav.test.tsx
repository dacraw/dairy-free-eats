import React from "react";
import {
  screen,
  render,
  waitFor,
  queryByRole,
  act,
} from "@testing-library/react";
import { BrowserRouter, MemoryRouter, Route, Routes } from "react-router";
import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import HeaderNav, { CURRENT_USER } from "components/headerNav/HeaderNav";
import {
  CurrentUserNotificationReceivedSubscription,
  CurrentUserQuery,
} from "graphql/types";
import userEvent from "@testing-library/user-event";
import Login from "components/login/Login";
import Home from "components/home/Home";
import { cache } from "apolloClient";
import { CURRENT_USER_NOTIFICATION_RECEIVED } from "components/headerNav/headerNotifications/HeaderNotifications";

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ message: "success", redirect_url: "/login" }),
  })
) as jest.Mock;

const currentUserEmail = "test@demo.com";

describe("<HeaderNav />", () => {
  let currentUserPresentMocks: MockedResponse<
    CurrentUserQuery | CurrentUserNotificationReceivedSubscription
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
                email: currentUserEmail,
                admin: false,
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
        {
          request: { query: CURRENT_USER_NOTIFICATION_RECEIVED },
          result: {
            data: {
              currentUserNotificationReceived: null,
            },
          },
        },
      ];
    });

    it("displays the current user's email", async () => {
      render(
        <MockedProvider cache={cache} mocks={currentUserPresentMocks}>
          <BrowserRouter>
            <HeaderNav />
          </BrowserRouter>
        </MockedProvider>
      );

      const userAccountIcon = await screen.findByTestId("user-account-icon");
      expect(userAccountIcon).toBeInTheDocument();

      await userEvent.click(userAccountIcon);
      expect(
        screen.getByRole("button", { name: /Logout/i })
      ).toBeInTheDocument();
      expect(screen.getByText(currentUserEmail)).toBeInTheDocument();
    });

    it("does not display the admin dashboard link for non admin", async () => {
      render(
        <MockedProvider mocks={currentUserPresentMocks} cache={cache}>
          <BrowserRouter>
            <HeaderNav />
          </BrowserRouter>
        </MockedProvider>
      );

      const userAccountIcon = await screen.findByTestId("user-account-icon");
      expect(userAccountIcon).toBeInTheDocument();

      await userEvent.click(userAccountIcon);
      expect(
        screen.getByRole("button", { name: /Logout/i })
      ).toBeInTheDocument();

      expect(
        screen.queryAllByRole("link", { name: /ADMIN DASHBOARD/i }).length
      ).toEqual(0);
    });

    it("clicking logout invokes the session delete mutation and redirects to login page", async () => {
      render(
        <MockedProvider mocks={currentUserPresentMocks} cache={cache}>
          <MemoryRouter>
            <HeaderNav />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </MemoryRouter>
        </MockedProvider>
      );

      const userAccountIcon = await screen.findByTestId("user-account-icon");
      expect(userAccountIcon).toBeInTheDocument();

      await userEvent.click(userAccountIcon);
      expect(
        screen.getByRole("button", { name: /Logout/i })
      ).toBeInTheDocument();

      const logoutButton = await screen.findByRole("button", {
        name: "Logout",
      });
      expect(logoutButton).toBeInTheDocument();

      await userEvent.click(logoutButton);

      await waitFor(() => {
        expect(screen.queryByText("Logout")).not.toBeInTheDocument();

        expect(screen.getByLabelText("Email")).toBeInTheDocument();
        expect(screen.getByLabelText("Password")).toBeInTheDocument();
      });
    });

    describe("when the current user is an admin", () => {
      it("displays the admin dashboard link", async () => {
        currentUserPresentMocks = [
          {
            request: { query: CURRENT_USER },
            result: {
              data: {
                currentUser: {
                  id: "1",
                  email: "admin@demo.com",
                  admin: true,
                },
              },
            },
          },
          {
            request: { query: CURRENT_USER_NOTIFICATION_RECEIVED },
            result: {
              data: {
                currentUserNotificationReceived: null,
              },
            },
            maxUsageCount: Infinity,
          },
        ];
        render(
          <MockedProvider mocks={currentUserPresentMocks} cache={cache}>
            <BrowserRouter>
              <HeaderNav />
            </BrowserRouter>
          </MockedProvider>
        );

        const userAccountIcon = await screen.findByTestId("user-account-icon");
        expect(userAccountIcon).toBeInTheDocument();

        await userEvent.click(userAccountIcon);
        expect(
          screen.getByRole("button", { name: /Logout/i })
        ).toBeInTheDocument();

        expect(
          screen.getByRole("link", { name: /DASHBOARD/i })
        ).toBeInTheDocument();
      });
      it("does not render the shopping cart modal", async () => {
        currentUserPresentMocks = [
          {
            request: { query: CURRENT_USER },
            result: {
              data: {
                currentUser: {
                  id: "1",
                  email: "admin@demo.com",
                  admin: true,
                },
              },
            },
          },
          {
            request: { query: CURRENT_USER_NOTIFICATION_RECEIVED },
            result: {
              data: {
                currentUserNotificationReceived: null,
              },
            },
            maxUsageCount: Infinity,
          },
        ];
        render(
          <MockedProvider mocks={currentUserPresentMocks} cache={cache}>
            <BrowserRouter>
              <HeaderNav />
            </BrowserRouter>
          </MockedProvider>
        );

        const userAccountIcon = await screen.findByTestId("user-account-icon");
        expect(userAccountIcon).toBeInTheDocument();

        await userEvent.click(userAccountIcon);
        expect(
          screen.getByRole("button", { name: /Logout/i })
        ).toBeInTheDocument();
        expect(
          screen.queryByTestId("shopping-cart-icon")
        ).not.toBeInTheDocument();
      });
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
        <MockedProvider mocks={currentUserPresentMocks} cache={cache}>
          <BrowserRouter>
            <HeaderNav />
          </BrowserRouter>
        </MockedProvider>
      );

      const userAccountIcon = await screen.findByTestId("user-account-icon");
      expect(userAccountIcon).toBeInTheDocument();

      await userEvent.click(userAccountIcon);

      expect(
        screen.queryByRole("button", { name: /Logout/i })
      ).not.toBeInTheDocument();
    });
  });
});
