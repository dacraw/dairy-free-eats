import React, { useEffect } from "react";
import { gql } from "@apollo/client";
import {
  useCurrentUserQuery,
  useFetchCurrentUserOrdersQuery,
} from "graphql/types";
import OrderChatPanel from "components/orderChatPanels/orderChatPanel/OrderChatPanel";

export const FETCH_ORDER_MESSAGES = gql`
  query FetchOrderMessages($orderId: ID!) {
    orderMessages(orderId: $orderId) {
      id
      body
      createdAt
      userId
      userIsAdmin
    }
  }
`;

export const CREATE_ORDER_MESSAGE = gql`
  mutation CreateOrderMessage($input: CreateOrderMessageInput!) {
    createOrderMessage(input: $input) {
      orderMessage {
        id
        userIsAdmin
        userId
        createdAt
        body
      }
    }
  }
`;

export const FETCH_CURRENT_USER_ORDERS = gql`
  query FetchCurrentUserOrders($incomplete: Boolean) {
    currentUserOrders(incomplete: $incomplete) {
      id
      createdAt
      guestEmail
      updatedAt
      status
      stripeCheckoutSessionLineItems {
        name
        quantity
        imageUrl
      }
      user {
        id
        email
      }
    }
  }
`;

const OrderChatPanels = () => {
  const { data: currentUserData, loading: currentUserLoading } =
    useCurrentUserQuery();

  const { data, loading, refetch } = useFetchCurrentUserOrdersQuery({
    variables: { incomplete: true },
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
    <OrderChatPanel
      key={order.id}
      orderId={order.id}
      currentUserId={currentUserData?.currentUser?.id || ""}
      currentUserIsAdmin={Boolean(currentUserData?.currentUser?.admin)}
    />
  ));
};

export default OrderChatPanels;
