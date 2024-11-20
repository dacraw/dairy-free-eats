import React, { useEffect } from "react";
import { gql } from "@apollo/client";
import {
  useCurrentUserQuery,
  useFetchCurrentUserOrdersQuery,
} from "graphql/types";
import OrderChat from "components/orderChatPanels/orderChat/OrderChat";

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

export const FETCH_CURRENT_USER_ORDERS = gql`
  query FetchCurrentUserOrders($completed: Boolean!) {
    currentUserOrders(completed: $completed) {
      id
      status
      stripeCheckoutSessionLineItems {
        name
        quantity
      }
      user {
        id
        email
      }
      guestEmail
    }
  }
`;

const OrderChatPanels = () => {
  const { data: currentUserData, loading: currentUserLoading } =
    useCurrentUserQuery();

  const { data, loading, refetch } = useFetchCurrentUserOrdersQuery({
    variables: { completed: false },
  });

  useEffect(() => {
    refetch();
  }, [currentUserData]);

  if (
    !currentUserData?.currentUser ||
    !data ||
    currentUserData?.currentUser?.admin
  )
    return null;

  return data?.currentUserOrders?.map((order) => (
    <OrderChat
      key={order.id}
      orderId={order.id}
      currentUserId={parseInt(currentUserData?.currentUser?.id || "")}
    />
  ));
};

export default OrderChatPanels;
