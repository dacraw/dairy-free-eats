import React, { useEffect, useRef } from "react";
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
  const { register, handleSubmit } = useForm();

  useEffect(() => {
    if (!chatRef.current) return;

    connectToOrdersChannel(54, chatRef.current);
  }, []);
  console.log(chatRef);
  return (
    <div>
      <div className="bg-gray-900 p-4 text-gray-200 w-60 rounded">
        <div ref={chatRef}>
          <p className="">Hey this is an order chat.</p>
          {data?.orderMessages?.map((message) => (
            <div key={message.id} className="mb-4">
              <p>{message.body}</p>
              <p className="text-sm">{message.createdAt}</p>
            </div>
          ))}
        </div>
        <form
          onSubmit={handleSubmit(async (data) => {
            const currentUserId = "7";
            // const currentUserId = currentUserData?.currentUser?.id;
            if (!currentUserId) return;

            createOrderMessage({
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
