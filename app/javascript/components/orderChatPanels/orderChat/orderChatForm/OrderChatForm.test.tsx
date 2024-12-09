import React from "react";
import { screen, render } from "@testing-library/react";

import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import OrderChatMessageForm, {
  GENERATE_GOOGLE_GEMINI_ORDER_MESSAGE,
} from "components/orderChatPanels/orderChat/orderChatForm/OrderChatForm";
import {
  CreateOrderMessageMutation,
  CreateOrderMessageMutationVariables,
  GenerateGeminiOrderMessageMutation,
  GenerateGeminiOrderMessageMutationVariables,
} from "graphql/types";
import { CREATE_ORDER_MESSAGE } from "components/orderChatPanels/OrderChatPanels";

const orderMessage = {
  id: "1",
  userIsAdmin: false,
  userId: "1",
  createdAt: "2024-01-15",
  body: "Test Message",
  userIsGemini: false,
};

const geminiOrderMessage = {
  id: "2",
  userIsAdmin: false,
  userId: "2",
  createdAt: "20204-01-5",
  body: "This is a Gemini Message",
  userIsGemini: true,
};

const userNotAdminMocks: MockedResponse<
  CreateOrderMessageMutation | GenerateGeminiOrderMessageMutation,
  | CreateOrderMessageMutationVariables
  | GenerateGeminiOrderMessageMutationVariables
>[] = [
  {
    request: {
      query: CREATE_ORDER_MESSAGE,
      variables: { input: { orderMessageId: orderMessage.id } },
    },
    result: {
      data: {
        createOrderMessage: {
          orderMessage,
        },
      },
    },
  },
  {
    request: {
      query: GENERATE_GOOGLE_GEMINI_ORDER_MESSAGE,
      variables: { input: { orderMessageId: orderMessage.id } },
    },
    result: {
      data: {
        createOrderMessage: {
          orderMessage: geminiOrderMessage,
        },
      },
    },
  },
];

describe("<OrderChatMessage />", () => {
  it("renders without errors", async () => {
    render(
      <MockedProvider mocks={userNotAdminMocks}>
        <OrderChatMessageForm
          orderId="1"
          currentUserId={"1"}
          currentUserIsAdmin={false}
        />
      </MockedProvider>
    );

    const submitButton = await screen.findByRole("button", {
      name: /Submit Message/i,
    });
    const messageInput = screen.getByRole("textbox");

    expect(submitButton).toBeInTheDocument();
    expect(messageInput).toBeInTheDocument();
  });
});
