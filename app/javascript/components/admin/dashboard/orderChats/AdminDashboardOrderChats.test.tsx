import React from "react";
import { screen, render } from "@testing-library/react";
import AdminDashboardOrderChats from "components/admin/dashboard/orderChats/AdminDashboardOrderChats";
import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import {
  CurrentUserQuery,
  FetchOrderMessagesQuery,
  FetchOrderMessagesQueryVariables,
  FetchOrdersQuery,
  OrderStatus,
} from "graphql/types";
import { CURRENT_USER } from "components/headerNav/HeaderNav";
import { FETCH_ORDERS } from "components/admin/dashboard/orders/AdminDashboardOrders";
import { FETCH_ORDER_MESSAGES } from "components/orderChatPanels/OrderChatPanels";

const validMocks: MockedResponse<
  CurrentUserQuery | FetchOrdersQuery | FetchOrderMessagesQuery,
  FetchOrderMessagesQueryVariables
>[] = [
  {
    request: {
      query: CURRENT_USER,
    },
    result: {
      data: {
        currentUser: {
          id: "1",
          email: "testuser@test.com",
          admin: true,
        },
      },
    },
  },
  {
    request: { query: FETCH_ORDERS },
    result: {
      data: {
        orders: [
          {
            id: "1",
            status: OrderStatus.InTransit,
            stripeCheckoutSessionLineItems: [
              {
                name: "some thing",
                quantity: 3,
              },
            ],
            user: {
              id: "2",
              email: "cooluser@test.com",
            },
            guestEmail: null,
          },
        ],
      },
    },
  },
  {
    request: { query: FETCH_ORDER_MESSAGES, variables: { orderId: "1" } },
    result: {
      data: {
        orderMessages: [
          {
            id: "1",
            body: "coolio",
            createdAt: "2024",
            userId: 2,
            userIsAdmin: false,
          },
        ],
      },
    },
  },
];

describe("<AdminDashboardOrderChats />", () => {
  it("renders without errors", async () => {
    render(
      <MockedProvider mocks={validMocks}>
        <AdminDashboardOrderChats />
      </MockedProvider>
    );

    expect(await screen.findByText("Order #1 Chat")).toBeInTheDocument();
  });
});
