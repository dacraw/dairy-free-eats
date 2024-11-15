import React from "react";
import { screen, render } from "@testing-library/react";
import AdminDashboard, {
  FETCH_ORDERS,
  SET_ORDER_ACTIVE,
} from "components/admin/dashboard/AdminDashboard";
import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import {
  CurrentUserQuery,
  FetchOrdersQuery,
  SetOrderActiveMutation,
  SetOrderActiveMutationVariables,
} from "graphql/types";
import { CURRENT_USER } from "components/headerNav/HeaderNav";
import Home from "components/Home";

const validMocks: MockedResponse<
  FetchOrdersQuery | CurrentUserQuery | SetOrderActiveMutation,
  SetOrderActiveMutationVariables
>[] = [
  {
    request: {
      query: FETCH_ORDERS,
    },
    result: {
      data: {
        orders: [
          {
            id: "1",
            status: "received",
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
            status: "received",
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
    request: { query: SET_ORDER_ACTIVE, variables: { input: { id: "1" } } },
    result: {
      data: {
        setOrderActive: {
          order: { id: "1", status: "active" },
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
            status: "active",
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
          },
        ],
      },
    },
  },
];

const currentUserNotAdmin: MockedResponse<
  FetchOrdersQuery | CurrentUserQuery
>[] = [
  {
    request: {
      query: FETCH_ORDERS,
    },
    result: {
      data: {
        orders: [
          {
            id: "1",
            status: "received",
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
            status: "received",
            stripeCheckoutSessionLineItems: [
              {
                name: "Shake",
                quantity: 1,
              },
            ],
            user: null,
            guestEmail: "guest@test.com",
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
        <MockedProvider mocks={validMocks}>
          <MemoryRouter
            initialEntries={["/admin/dashboard"]}
            future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
          >
            <Routes>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Routes>
          </MemoryRouter>
        </MockedProvider>
      );
      expect(await screen.findByText("Admin Dashboard")).toBeInTheDocument();
      expect(screen.getAllByText("guestEmail@test.com").length).toBeTruthy();
      expect(screen.getAllByText("testuser@test.com").length).toBeTruthy();
    });
  });

  describe("when the user is not an admin", () => {
    it("redirects to the home page", async () => {
      render(
        <MockedProvider mocks={currentUserNotAdmin}>
          <MemoryRouter
            initialEntries={["/admin/dashboard"]}
            future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Routes>
          </MemoryRouter>
        </MockedProvider>
      );

      expect(
        await screen.findByText(
          "Order lactose-free food that is tasty and affordable."
        )
      ).toBeInTheDocument();
    });
  });
});
