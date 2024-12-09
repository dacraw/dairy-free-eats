import React from "react";
import { OrderMessage, useFetchOrderMessagesQuery, User } from "graphql/types";
import { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { gql } from "@apollo/client";
import OrderChatMessageForm from "components/orderChatPanels/orderChat/orderChatForm/OrderChatForm";
import useOrderChatStore, { OrderChatVisibility } from "stores/orderChatsStore";

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

  const { chatVisibility, mode, setChatVisibility } = useOrderChatStore();
  const visibility = chatVisibility[parseInt(orderId)];
  const setVisibility = (visibility: OrderChatVisibility) =>
    setChatVisibility(parseInt(orderId), visibility);

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
    <div
      className={`
        ${
          mode === "bottom_stacked"
            ? visibility === "opened" || visibility === "opening"
              ? "animate-order-chat-slide-up max-h-[550px]"
              : "animate-order-chat-slide-down max-h-0"
            : ""
        }
        ${
          mode === "top_columns"
            ? visibility === "opened" || visibility === "opening"
              ? "animate-order-chat-admin-open max-h-[550px] \
                md:animate-order-chat-admin-open-md md:absolute md:top-0 md:left-60 md:w-96 opacity-1"
              : "animate-order-chat-admin-close max-h-0 \
                md:animate-order-chat-admin-close-md md:absolute md:top-0 md:left-60 md:w-96 opacity-0"
            : ""
        }
         transition-all z-[9999] overscroll-contain`}
      onAnimationStart={() => {
        if (chatRef.current) {
          chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
      }}
      onAnimationEnd={() => {
        // if (mode === "bottom_stacked") {
        if (visibility === "closing") {
          setVisibility("closed");
        } else if (visibility === "opening") {
          setVisibility("opened");
        }
        // }
      }}
    >
      <div
        id="chat"
        ref={chatRef}
        className={`p-4 overflow-auto h-96 gray-background`}
      >
        <p className="text-center text-xs bg-gray-800 rounded p-2 mb-4">
          This chat will be available after an order is received and until it is
          completed. You may ask a chatbot questions about your order by
          checking the "Enable Chatbot Responses" checkbox above the "Submit
          Message" field.
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
