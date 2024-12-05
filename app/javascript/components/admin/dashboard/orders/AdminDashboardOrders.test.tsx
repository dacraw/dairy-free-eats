import React from "react";
import { screen, render } from "@testing-library/react";
import { CurrentUserQuery, FetchOrdersQuery, OrderStatus } from "graphql/types";
import AdminDashboardOrders, {
  FETCH_ORDERS,
} from "components/admin/dashboard/orders/AdminDashboardOrders";
import { CURRENT_USER } from "components/headerNav/HeaderNav";
import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { MemoryRouter, Route, Routes } from "react-router";
import AdminDashboard from "components/admin/dashboard/AdminDashboard";

const validMocks: MockedResponse<FetchOrdersQuery | CurrentUserQuery>[] = [
  {
    maxUsageCount: 2,
    request: {
      query: FETCH_ORDERS,
    },
    result: {
      data: {
        orders: [
          {
            id: "1",
            status: OrderStatus.Received,
            stripeCheckoutSessionLineItems: [
              {
                name: "Shake",
                quantity: 1,
              },
            ],
            user: {
              id: "1",
              email: "testuser@test.com",
            },
            guestEmail: null,
          },
          {
            id: "2",
            status: OrderStatus.Received,
            stripeCheckoutSessionLineItems: [
              {
                name: "Shake",
                quantity: 1,
              },
            ],
            user: null,
            guestEmail: "guestEmail@test.com",
          },
        ],
      },
    },
  },
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

  {
    request: {
      query: FETCH_ORDERS,
    },
    result: {
      data: {
        orders: [
          {
            id: "1",
            status: OrderStatus.Active,
            stripeCheckoutSessionLineItems: [
              {
                name: "Shake",
                quantity: 1,
              },
            ],
            user: {
              id: "1",
              email: "testuser@test.com",
            },
            guestEmail: null,
          },
        ],
      },
    },
  },
];

describe("<AdminDashboardOrders />", () => {
  it("renders without errors", async () => {
    render(
      <MockedProvider mocks={validMocks} addTypename={false}>
        <MemoryRouter
          initialEntries={["/admin/dashboard/orders"]}
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <Routes>
            <Route path="admin">
              <Route path="dashboard" element={<AdminDashboard />}>
                <Route path="orders" element={<AdminDashboardOrders />} />
              </Route>
            </Route>
          </Routes>
        </MemoryRouter>
      </MockedProvider>
    );

    expect((await screen.findAllByText("testuser@test.com")).length).toEqual(2);
    expect((await screen.findAllByText("guestEmail@test.com")).length).toEqual(
      2
    );
  });
});
