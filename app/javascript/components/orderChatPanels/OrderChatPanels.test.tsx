import React from "react";
import { screen, render } from "@testing-library/react";
import OrderChatPanels, {
  FETCH_CURRENT_USER_ORDERS,
  FETCH_ORDER_MESSAGES,
} from "components/orderChatPanels/OrderChatPanels";
import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import {
  CurrentUserQuery,
  FetchCurrentUserOrdersQuery,
  FetchCurrentUserOrdersQueryVariables,
  FetchOrderMessagesQuery,
  FetchOrderMessagesQueryVariables,
  OrderStatus,
} from "graphql/types";
import { CURRENT_USER } from "components/headerNav/HeaderNav";

const validMocks: MockedResponse<
  CurrentUserQuery | FetchCurrentUserOrdersQuery | FetchOrderMessagesQuery,
  FetchCurrentUserOrdersQueryVariables | FetchOrderMessagesQueryVariables
>[] = [
  {
    request: { query: CURRENT_USER },
    result: {
      data: {
        currentUser: {
          id: "1",
          email: "test@demo.com",
          admin: false,
        },
      },
    },
  },
  {
    request: {
      query: FETCH_CURRENT_USER_ORDERS,
      variables: { completed: false },
    },
    result: {
      data: {
        currentUserOrders: [
          {
            id: "1",
            status: OrderStatus.InTransit,
            stripeCheckoutSessionLineItems: [
              {
                name: "product",
                quantity: 1,
              },
            ],
            user: {
              id: "1",
              email: "test@demo.com",
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
            body: "message",
            createdAt: "2024",
            userId: 1,
            userIsAdmin: false,
          },
        ],
      },
    },
  },
];

describe("<OrderChatPanels />", () => {
  it("renders without errors", async () => {
    render(
      <MockedProvider mocks={validMocks}>
        <OrderChatPanels />
      </MockedProvider>
    );

    expect(await screen.findByText("Order #1 Chat")).toBeInTheDocument();
  });
});
