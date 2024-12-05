import React from "react";
import { screen, render } from "@testing-library/react";
import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { MemoryRouter, Route, Routes } from "react-router";
import { CurrentUserQuery, FetchOrdersQuery, OrderStatus } from "graphql/types";
import { CURRENT_USER } from "components/headerNav/HeaderNav";
import Home from "components/home/Home";
import { FETCH_ORDERS } from "components/admin/dashboard/orders/AdminDashboardOrders";
import AdminDashboard from "components/admin/dashboard/AdminDashboard";
import AdminDashboardIndex from "components/admin/dashboard/index/AdminDashboardIndex";
import AdminRoute from "components/protRoute/AdminRoute";

const validMocks: MockedResponse<FetchOrdersQuery | CurrentUserQuery>[] = [
  {
    request: {
      query: CURRENT_USER,
    },
    result: {
      data: {
        currentUser: {
          id: "1",
          email: "admincurrentuser@test.com",
          admin: true,
        },
      },
    },
  },
];

const currentUserNotAdmin: MockedResponse<
  FetchOrdersQuery | CurrentUserQuery
>[] = [
  {
    request: {
      query: CURRENT_USER,
    },
    result: {
      data: {
        currentUser: {
          id: "1",
          email: "admincurrentuser@test.com",
          admin: false,
        },
      },
    },
  },
];

describe("<AdminDashboard />", () => {
  describe("when the user is an admin", () => {
    it("renders without errors", async () => {
      render(
        <MockedProvider mocks={validMocks} addTypename={false}>
          <MemoryRouter initialEntries={["/admin/dashboard/"]}>
            <Routes>
              <Route path="admin">
                <Route path="dashboard" element={<AdminDashboard />}>
                  <Route index element={<AdminDashboardIndex />} />
                </Route>
              </Route>
            </Routes>
          </MemoryRouter>
        </MockedProvider>
      );
      expect(await screen.findByText("Admin Dashboard")).toBeInTheDocument();

      expect(
        screen.getAllByRole("link", { name: "ORDERS" })[0]
      ).toHaveAttribute("href", "/admin/dashboard/orders");
      expect(
        screen.getAllByRole("link", { name: "ORDER CHATS" })[0]
      ).toHaveAttribute("href", "/admin/dashboard/order_chats");
    });
  });

  describe("when the user is not an admin", () => {
    it("redirects to the home page", async () => {
      render(
        <MockedProvider mocks={currentUserNotAdmin} addTypename={false}>
          <MemoryRouter initialEntries={["/admin/dashboard"]}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="admin" element={<AdminRoute />}>
                <Route path="dashboard" element={<AdminDashboard />}>
                  <Route index element={<AdminDashboardIndex />} />
                </Route>
              </Route>
            </Routes>
          </MemoryRouter>
        </MockedProvider>
      );

      expect(
        await screen.findByText("Order Dairy Free Food")
      ).toBeInTheDocument();
    });
  });

  describe("when there is no current user", () => {
    const noCurrentUserMocks: MockedResponse<
      FetchOrdersQuery | CurrentUserQuery
    >[] = [
      {
        request: {
          query: CURRENT_USER,
        },
        result: {
          data: {
            currentUser: null,
          },
        },
      },
    ];

    it("redirects to the home page", async () => {
      render(
        <MockedProvider mocks={noCurrentUserMocks} addTypename={false}>
          <MemoryRouter initialEntries={["/admin/dashboard"]}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="admin" element={<AdminRoute />}>
                <Route path="dashboard" element={<AdminDashboard />}>
                  <Route index element={<AdminDashboardIndex />} />
                </Route>
              </Route>
            </Routes>
          </MemoryRouter>
        </MockedProvider>
      );

      expect(
        await screen.findByText("Order Dairy Free Food")
      ).toBeInTheDocument();
    });
  });
});
