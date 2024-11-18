import React from "react";
import { screen, render, waitFor } from "@testing-library/react";
import AdminOrder, { FETCH_ORDER } from "components/admin/order/AdminOrder";
import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { MemoryRouter, Route, Routes } from "react-router-dom";
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
import Home from "components/Home";
import AdminDashboard, {
  FETCH_ORDERS,
  SET_ORDER_STATUS,
} from "components/admin/dashboard/AdminDashboard";
import userEvent from "@testing-library/user-event";

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

const fetchOrdersMocks: MockedResponse<FetchOrdersQuery>[] = [
  {
    request: {
      query: FETCH_ORDERS,
    },
    result: {
      data: {
        orders: [
          {
            id: "123",
            status: OrderStatus.Received,
            stripeCheckoutSessionLineItems: [
              {
                name: "Some great item",
                quantity: 4,
              },
            ],
            user: {
              id: "1234",
              email: "useremail@test.com",
            },
            guestEmail: null,
          },
        ],
      },
    },
  },
];

describe("<AdminOrder />", () => {
  it("renders without errors", async () => {
    render(
      <MockedProvider mocks={validMocks} addTypename={false}>
        <MemoryRouter
          initialEntries={["/admin/orders/1"]}
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <Routes>
            <Route path="/admin/orders/:orderId" element={<AdminOrder />} />
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

  it("lets the user return to the dashboard", async () => {
    render(
      <MockedProvider
        mocks={[...validMocks, ...fetchOrdersMocks]}
        addTypename={false}
      >
        <MemoryRouter
          initialEntries={["/admin/orders/1"]}
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <Routes>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/orders/:orderId" element={<AdminOrder />} />
          </Routes>
        </MemoryRouter>
      </MockedProvider>
    );

    const backButton = await screen.findByText(/Back to Dashboard/i);
    expect(backButton).toBeInTheDocument();

    await userEvent.click(backButton);

    expect(await screen.findByText(/Admin Dashboard/i)).toBeInTheDocument();
  });

  describe("while loading", () => {
    it("shows the loading spinner", async () => {
      render(
        <MockedProvider
          mocks={[...validMocks, { ...validMocks[0], delay: Infinity }]}
          addTypename={false}
        >
          <MemoryRouter
            initialEntries={["/admin/orders/1"]}
            future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
          >
            <Routes>
              <Route path="/admin/orders/:orderId" element={<AdminOrder />} />
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
          <MemoryRouter
            initialEntries={["/admin/orders/1"]}
            future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/admin/orders/:orderId" element={<AdminOrder />} />
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
