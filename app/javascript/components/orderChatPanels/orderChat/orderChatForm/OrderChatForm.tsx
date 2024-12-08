import { gql } from "@apollo/client";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FETCH_ORDER_MESSAGES } from "components/orderChatPanels/OrderChatPanels";
import {
  FetchOrderMessagesQuery,
  OrderMessage,
  useCreateOrderMessageMutation,
  useGenerateGeminiOrderMessageMutation,
  User,
} from "graphql/types";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

export const GENERATE_GOOGLE_GEMINI_ORDER_MESSAGE = gql`
  mutation GenerateGeminiOrderMessage(
    $input: GenerateGeminiOrderMessageInput!
  ) {
    generateGeminiOrderMessage(input: $input) {
      orderMessage {
        id
        body
      }
      errors {
        path
        message
      }
    }
  }
`;

const OrderChatMessageForm = ({
  currentUserId,
  currentUserIsAdmin,

  orderId,
}: {
  currentUserIsAdmin: User["admin"];
  currentUserId: User["id"];
  orderId: OrderMessage["orderId"];
}) => {
  const [
    createOrderMessage,
    { data: createOrderMessageData, loading: createOrderMessageLoading },
  ] = useCreateOrderMessageMutation({
    update(cache, { data }) {
      const newMessage = data?.createOrderMessage?.orderMessage;

      const existingData = cache.readQuery<FetchOrderMessagesQuery>({
        query: FETCH_ORDER_MESSAGES,
        variables: { orderId },
      });

      if (!existingData) return null;

      if (!newMessage) return existingData;

      const updatedData = {
        ...existingData,
        orderMessages: [...existingData.orderMessages, newMessage],
      };

      cache.writeQuery({
        query: FETCH_ORDER_MESSAGES,
        variables: { orderId },
        data: updatedData,
      });
    },
  });

  const [
    generateGeminiOrderMessage,
    {
      data: generateGeminiMessageData,
      loading: generateGeminiMessageLoading,
      error: generateGeminiMessageError,
    },
  ] = useGenerateGeminiOrderMessageMutation();

  const [receiveGeminiResponse, setReceiveGeminiResponse] = useState(true);

  const messageRef = useRef<HTMLInputElement | null>(null);

  const { register, handleSubmit, reset, setFocus, formState } = useForm<{
    message: string;
  }>();

  const { ref, ...rest } = register("message");

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.focus({ preventScroll: true });
    }
  }, [createOrderMessageData]);

  return (
    <form
      autoComplete="off"
      onSubmit={handleSubmit(async (data) => {
        const orderMessage = await createOrderMessage({
          variables: {
            input: {
              createOrderMessageInputType: {
                orderId,
                userId: currentUserId,
                body: data?.message,
              },
            },
          },
        });

        reset();

        const newOrderMessageId =
          orderMessage?.data?.createOrderMessage?.orderMessage?.id;

        if (!newOrderMessageId) return;
        if (currentUserIsAdmin) return;
        if (!receiveGeminiResponse) return;

        await generateGeminiOrderMessage({
          variables: {
            input: {
              orderMessageId: newOrderMessageId,
            },
          },
        });
      })}
    >
      <input
        {...rest}
        name="message"
        autoComplete="off"
        disabled={createOrderMessageLoading || createOrderMessageLoading}
        ref={(e) => {
          ref(e);
          messageRef.current = e;
        }}
        className="block w-full bg-gray-200 mb-4"
      />

      <div className="mb-4 flex gap-x-2 justify-center">
        <input
          id="receive-gemini-response"
          type="checkbox"
          checked={receiveGeminiResponse}
          onChange={() => setReceiveGeminiResponse(!receiveGeminiResponse)}
        />
        <label className="text-sm" htmlFor="receive-gemini-response">
          Enable Chatbot Responses
        </label>
      </div>

      <button className="blue-button w-full">
        {createOrderMessageLoading ? (
          <FontAwesomeIcon icon={faSpinner} />
        ) : (
          "Submit Message"
        )}
      </button>
    </form>
  );
};

export default OrderChatMessageForm;
