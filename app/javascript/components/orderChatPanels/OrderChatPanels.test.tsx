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
  OrderMessageReceivedSubscription,
  OrderMessageReceivedSubscriptionVariables,
  OrderStatus,
} from "graphql/types";
import { CURRENT_USER } from "components/headerNav/HeaderNav";
import { ORDER_MESSAGE_RECEIVED } from "components/orderChatPanels/orderChat/OrderChat";

const validMocks: MockedResponse<
  | CurrentUserQuery
  | FetchCurrentUserOrdersQuery
  | OrderMessageReceivedSubscription,
  | FetchCurrentUserOrdersQueryVariables
  | OrderMessageReceivedSubscriptionVariables
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
      variables: { incomplete: true },
    },
    result: {
      data: {
        currentUserOrders: [
          {
            id: "1",
            status: OrderStatus.InTransit,
            createdAt: "2024-12-6",
            updatedAt: "2024-12-7",
            completedAt: null,
            stripeCheckoutSessionLineItems: [
              {
                name: "product",
                quantity: 1,
                imageUrl: "www.someimage.com",
                unitAmount: 300,
              },
            ],
            amountTotal: 600,
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
    request: {
      query: ORDER_MESSAGE_RECEIVED,
      variables: { orderId: "1" },
    },
    result: {
      data: {
        orderMessageReceived: {
          id: "1",
          body: "heyo",
          createdAt: "2024",
          userId: "1",
          userIsAdmin: false,
        },
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
