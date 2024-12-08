import React from "react";
import {
  FetchOrderMessagesQuery,
  OrderMessage,
  useCreateOrderMessageMutation,
  useFetchOrderMessagesQuery,
  useGenerateGeminiOrderMessageMutation,
  User,
} from "graphql/types";
import { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import { gql } from "@apollo/client";
import { FETCH_ORDER_MESSAGES } from "components/orderChatPanels/OrderChatPanels";

const OrderChatMessage = ({
  currentUserId,
  currentUserIsAdmin,
  message,
}: {
  currentUserId: User["id"];
  message: Pick<OrderMessage, "createdAt" | "body" | "userId" | "userIsAdmin">;
  currentUserIsAdmin: boolean;
}) => {
  const utcDate = new Date(message.createdAt);
  const offset = utcDate.getTimezoneOffset();
  const localTime = new Date(utcDate.getTime() - offset);

  return (
    <div className={`grid mb-4`}>
      <div
        className={`p-2 rounded w-3/4 ${
          currentUserId === message.userId ||
          (message.userIsAdmin && currentUserIsAdmin)
            ? "justify-self-end bg-gray-800"
            : "justify-self-start bg-blue-800"
        }`}
      >
        <p>{message.body}</p>
        <p className="text-sm">{localTime.toLocaleString()}</p>
      </div>
    </div>
  );
};

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

  const messageRef = useRef<HTMLInputElement | null>(null);

  const { register, handleSubmit, reset, setFocus, formState } = useForm<{
    message: string;
  }>();

  const { ref, ...rest } = register("message");

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.focus({ preventScroll: true });
    }
  }, []);

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

export const ORDER_MESSAGE_RECEIVED = gql`
  subscription OrderMessageReceived($orderId: ID!) {
    orderMessageReceived(orderId: $orderId) {
      id
      body
      createdAt
      userId
      userIsAdmin
    }
  }
`;

const OrderChat = ({
  orderId,
  currentUserId,
  currentUserIsAdmin,
}: {
  orderId: string;
  currentUserId: User["id"];
  currentUserIsAdmin: boolean;
  hideChatsOnSelect?: boolean;
}) => {
  const chatRef = useRef<HTMLDivElement>(null);

  // TODO: clear the cache when user logs out
  const { data, loading } = useFetchOrderMessagesQuery({
    variables: { orderId },
  });

  useEffect(() => {
    const handleScroll = () => {
      if (!chatRef.current) return;
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    };

    const observer = new MutationObserver(handleScroll);

    if (chatRef.current) {
      observer.observe(chatRef.current, { childList: true });
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="relative">
      <div
        id="chat"
        ref={chatRef}
        className={`p-4 overflow-auto h-96 animate-slide-up gray-background`}
        onAnimationStart={() => {
          if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
          }
        }}
      >
        <p className="text-center text-xs bg-gray-800 rounded p-2 mb-4">
          This chat will be available after an order is received and until it is
          completed.
        </p>
        {loading ? (
          <>
            <FontAwesomeIcon icon={faSpinner} />
            <p>Loading messages...</p>
          </>
        ) : (
          data?.orderMessages?.map((message) => {
            return (
              <OrderChatMessage
                currentUserIsAdmin={currentUserIsAdmin}
                key={message.id}
                message={message}
                currentUserId={currentUserId}
              />
            );
          })
        )}
      </div>
      <div className="p-4 gray-background">
        <OrderChatMessageForm
          orderId={orderId}
          currentUserId={currentUserId}
          currentUserIsAdmin={currentUserIsAdmin}
        />
      </div>
    </div>
  );
};

export default OrderChat;
