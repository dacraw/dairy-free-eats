import React from "react";
import { screen, render } from "@testing-library/react";
import OrderChat from "components/orderChatPanels/orderChat/OrderChat";
import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import {
  FetchOrderMessagesQuery,
  FetchOrderMessagesQueryVariables,
} from "graphql/types";
import { FETCH_ORDER_MESSAGES } from "components/orderChatPanels/OrderChatPanels";

const mockOrderMessages = [
  {
    id: "1",
    body: "This is an order chat message",
    createdAt: "2024",
    userId: "1",
    userIsAdmin: false,
    userIsGemini: false,
  },
];

const validMocks: MockedResponse<
  FetchOrderMessagesQuery,
  FetchOrderMessagesQueryVariables
>[] = [
  {
    request: { query: FETCH_ORDER_MESSAGES, variables: { orderId: "1" } },
    result: {
      data: {
        orderMessages: mockOrderMessages,
      },
    },
  },
];

describe("<OrderChat />", () => {
  it("renders without errors", async () => {
    render(
      <MockedProvider mocks={validMocks}>
        <OrderChat orderId="1" currentUserId={"1"} currentUserIsAdmin={false} />
      </MockedProvider>
    );

    expect(
      await screen.findByText(mockOrderMessages[0].body)
    ).toBeInTheDocument();
  });
});
