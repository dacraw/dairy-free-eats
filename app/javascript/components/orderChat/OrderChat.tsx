import React, { useEffect, useRef, useState } from "react";
import { connectToOrdersChannel } from "channels";
import { gql } from "@apollo/client";
import {
  OrderMessage,
  useCreateOrderMessageMutation,
  useCurrentUserQuery,
  useFetchOrderMessagesQuery,
} from "graphql/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";

export const FETCH_ORDER_MESSAGES = gql`
  query FetchOrderMessages($orderId: ID!) {
    orderMessages(orderId: $orderId) {
      id
      body
      createdAt
    }
  }
`;

export const CREATE_ORDER_MESSAGE = gql`
  mutation CreateOrderMessage($input: CreateOrderMessageInput!) {
    createOrderMessage(input: $input) {
      orderMessage {
        id
      }
    }
  }
`;

const OrderChatMessage = ({
  message,
}: {
  message: Pick<OrderMessage, "createdAt" | "body">;
}) => {
  const utcDate = new Date(message.createdAt);
  const offset = utcDate.getTimezoneOffset();
  const localTime = new Date(utcDate.getTime() - offset);

  return (
    <div className="mb-4">
      <p>{message.body}</p>
      <p className="text-sm">{localTime.toLocaleString()}</p>
    </div>
  );
};

const OrderChatMessageForm = ({ currentUserId }: { currentUserId: number }) => {
  const [
    createOrderMessage,
    { data: createOrderMessageData, loading: createOrderMessageLoading },
  ] = useCreateOrderMessageMutation();

  const { register, handleSubmit, reset } = useForm();

  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        await createOrderMessage({
          variables: {
            input: {
              createOrderMessageInputType: {
                orderId: 54,
                userId: currentUserId,
                body: data?.message,
              },
            },
          },
        });

        reset();
      })}
    >
      <input
        {...register("message")}
        className="block w-full bg-gray-200 mb-4"
      />
      <button className="blue-button w-full">Submit Message</button>
    </form>
  );
};

const OrderChat = () => {
  const chatRef = useRef<HTMLDivElement>(null);

  const { data: currentUserData, loading: currentUserLoading } =
    useCurrentUserQuery();

  const { data, loading } = useFetchOrderMessagesQuery({
    variables: { orderId: "54" },
  });

  useEffect(() => {
    if (!chatRef.current) return;

    connectToOrdersChannel(54, chatRef.current);
  }, []);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chatRef.current]);

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

  const [visible, setVisible] = useState(false);
  const toggleVisibilityRef = useRef<HTMLParagraphElement>(null);
  const closeChat = (e: MouseEvent) => {
    if (chatRef.current && toggleVisibilityRef.current) {
      // check if the click is outside the component, but allow the panel to be opened initially
      // this also allows the submit button and input element to be clicked w/o closing the chat panel
      if (
        !chatRef.current.contains(e.target as HTMLElement) &&
        !toggleVisibilityRef.current.contains(e.target as HTMLElement)
      ) {
        setVisible(false);
      }
    }
  };

  useEffect(() => {
    document.addEventListener("click", closeChat);

    return () => document.removeEventListener("click", closeChat);
  }, []);

  return (
    <div>
      <div
        className="bg-gray-900  text-gray-200 w-60 rounded"
        ref={toggleVisibilityRef}
      >
        <p
          className="text-center bg-gray-800 rounded py-2 cursor-pointer "
          onClick={() => setVisible(!visible)}
        >
          Order Chat
        </p>
        <div
          id="chat"
          ref={chatRef}
          onAnimationStart={() => {
            if (chatRef.current) {
              chatRef.current.scrollTop = chatRef.current.scrollHeight;
            }
          }}
          className={`overflow-auto h-96 hidden ${
            visible ? "animate-slide-up" : ""
          }`}
        >
          {loading || currentUserLoading ? (
            <>
              <FontAwesomeIcon icon={faSpinner} />
              <p>Loading messages...</p>
            </>
          ) : (
            <>
              {data?.orderMessages?.map((message) => {
                return <OrderChatMessage key={message.id} message={message} />;
              })}
            </>
          )}
        </div>
        {visible && (
          <div className="p-4">
            <OrderChatMessageForm
              currentUserId={parseInt(currentUserData?.currentUser?.id || "")}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderChat;
