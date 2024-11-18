import React from "react";
import { screen, render } from "@testing-library/react";
import AdminDashboard, {
  FETCH_ORDERS,
} from "components/admin/dashboard/AdminDashboard";
import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { CurrentUserQuery, FetchOrdersQuery, OrderStatus } from "graphql/types";
import { CURRENT_USER } from "components/headerNav/HeaderNav";
import Home from "components/Home";

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

const currentUserNotAdmin: MockedResponse<
  FetchOrdersQuery | CurrentUserQuery
>[] = [
  {
    maxUsageCount: Infinity,
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
        <MockedProvider mocks={validMocks} addTypename={false}>
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
      expect(
        (await screen.findAllByText("testuser@test.com")).length
      ).toBeTruthy();
      expect(
        (await screen.findAllByText("guestEmail@test.com")).length
      ).toBeTruthy();
    });
  });

  describe("when the user is not an admin", () => {
    it("redirects to the home page", async () => {
      render(
        <MockedProvider mocks={currentUserNotAdmin} addTypename={false}>
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
