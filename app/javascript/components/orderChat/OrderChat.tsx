import React, { useEffect, useLayoutEffect, useRef } from "react";
import { connectToOrdersChannel } from "channels";
import { gql } from "@apollo/client";
import {
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

const OrderChat = () => {
  const chatRef = useRef<HTMLDivElement>(null);

  // const { data: currentUserData, loading: currentUserLoading } =
  //   useCurrentUserQuery();
  const { data, loading } = useFetchOrderMessagesQuery({
    variables: { orderId: "54" },
  });
  const [
    createOrderMessage,
    { data: createOrderMessageData, loading: createOrderMessageLoading },
  ] = useCreateOrderMessageMutation();

  const { register, handleSubmit, reset } = useForm();

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

  return (
    <div>
      <div className="bg-gray-900 p-4 text-gray-200 w-60 rounded">
        <div id="chat" ref={chatRef} className="overflow-auto h-96">
          <p className="">Hey this is an order chat.</p>
          {data?.orderMessages?.map((message) => {
            const utcDate = new Date(message.createdAt);
            const offset = utcDate.getTimezoneOffset();
            const localTime = new Date(utcDate.getTime() - offset);

            return (
              <div key={message.id} className="mb-4">
                <p>{message.body}</p>
                <p className="text-sm">{localTime.toLocaleString()}</p>
              </div>
            );
          })}
        </div>
        <form
          onSubmit={handleSubmit(async (data) => {
            const currentUserId = "7";
            // const currentUserId = currentUserData?.currentUser?.id;
            if (!currentUserId) return;

            await createOrderMessage({
              variables: {
                input: {
                  createOrderMessageInputType: {
                    orderId: 54,
                    userId: parseInt(currentUserId),
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
      </div>
    </div>
  );
};

export default OrderChat;
