import React from "react";
import { screen, render } from "@testing-library/react";
import AdminDashboardOrder, {
  FETCH_ORDER,
} from "components/admin/dashboard/order/AdminDashboardOrder";
import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { MemoryRouter, Route, Routes } from "react-router";
import {
  CurrentUserQuery,
  FetchOrderQuery,
  FetchOrderQueryVariables,
  FetchOrdersQuery,
  OrderStatus,
  SetOrderStatusMutation,
  SetOrderStatusMutationVariables,
} from "graphql/types";
import { CURRENT_USER } from "components/headerNav/HeaderNav";
import Home from "components/home/Home";
import {
  FETCH_ORDERS,
  SET_ORDER_STATUS,
} from "components/admin/dashboard/orders/AdminDashboardOrders";
import AdminDashboard from "components/admin/dashboard/AdminDashboard";

const orderMockValues: FetchOrderQuery["order"] = {
  id: "orderId_123",
  user: {
    id: "userId_123",
    email: "bestTestUser@test.com",
  },
  status: OrderStatus.Received,
  stripePaymentIntentId: "pi_12345",
  createdAt: "2024-11-17",
  updatedAt: "2024-11-19",
  stripeCheckoutSessionLineItems: [
    {
      name: "Super Burrito",
      quantity: 3,
    },
  ],
  guestEmail: null,
};

const currentUserMockValues = {
  id: "1",
  email: "admincurrentuser@test.com",
  admin: true,
};

const validMocks: MockedResponse<
  FetchOrderQuery | CurrentUserQuery | SetOrderStatusMutation,
  FetchOrderQueryVariables | SetOrderStatusMutationVariables
>[] = [
  {
    request: { query: FETCH_ORDER, variables: { id: "1" } },
    result: {
      data: {
        order: orderMockValues,
      },
    },
  },
  {
    request: {
      query: CURRENT_USER,
    },
    result: {
      data: {
        currentUser: currentUserMockValues,
      },
    },
  },
  {
    request: {
      query: SET_ORDER_STATUS,
      variables: {
        input: {
          setOrderStatusInputType: {
            id: orderMockValues.id,
            status: OrderStatus.Active,
          },
        },
      },
    },
    result: {
      data: {
        setOrderStatus: {
          order: {
            id: "1",
            status: OrderStatus.Active,
          },
        },
      },
    },
  },
];

describe("<AdminDashboardOrder />", () => {
  it("renders without errors", async () => {
    render(
      <MockedProvider mocks={validMocks} addTypename={false}>
        <MemoryRouter initialEntries={["/admin/dashboard/orders/1"]}>
          <Routes>
            <Route path="admin">
              <Route path="dashboard" element={<AdminDashboard />}>
                <Route path="orders">
                  <Route path=":id" element={<AdminDashboardOrder />} />
                </Route>
              </Route>
            </Route>
          </Routes>
        </MemoryRouter>
      </MockedProvider>
    );

    expect(await screen.findByText("Order Details")).toBeInTheDocument();

    expect(screen.getByText(orderMockValues.id)).toBeInTheDocument();
    expect(screen.getByText(orderMockValues?.user?.email!)).toBeInTheDocument();
    expect(screen.getByText(orderMockValues.status)).toBeInTheDocument();
    expect(
      screen.getByText(orderMockValues.stripePaymentIntentId)
    ).toBeInTheDocument();
    expect(screen.getByText(orderMockValues.createdAt)).toBeInTheDocument();

    const lineItemText = `${
      orderMockValues.stripeCheckoutSessionLineItems![0]?.name
    } x${orderMockValues.stripeCheckoutSessionLineItems![0]?.quantity}`;
    expect(screen.getByText(lineItemText)).toBeInTheDocument();
  });

  describe("while loading", () => {
    it("shows the loading spinner", async () => {
      render(
        <MockedProvider
          mocks={[...validMocks, { ...validMocks[0], delay: Infinity }]}
          addTypename={false}
        >
          <MemoryRouter initialEntries={["/admin/dashboard/orders/1"]}>
            <Routes>
              <Route path="admin">
                <Route path="dashboard" element={<AdminDashboard />}>
                  <Route path="orders">
                    <Route path=":id" element={<AdminDashboardOrder />} />
                  </Route>
                </Route>
              </Route>
            </Routes>
          </MemoryRouter>
        </MockedProvider>
      );

      expect(screen.getByText("Loading order...")).toBeInTheDocument();
    });
  });

  describe("when the current user is not an admin", () => {
    it("redirects to the home page", async () => {
      const currentUserNotAdmin: CurrentUserQuery["currentUser"] = {
        id: "123",
        email: "notanadmin@test.com",
        admin: false,
      };

      render(
        <MockedProvider
          mocks={[
            validMocks[0],
            {
              ...validMocks[1],
              result: { data: { currentUser: currentUserNotAdmin } },
            },
          ]}
          addTypename={false}
        >
          <MemoryRouter initialEntries={["/admin/dashboard/orders/1"]}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="admin">
                <Route path="dashboard" element={<AdminDashboard />}>
                  <Route path="orders">
                    <Route path=":id" element={<AdminDashboardOrder />} />
                  </Route>
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
