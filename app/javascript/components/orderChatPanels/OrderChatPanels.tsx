import React, { useEffect } from "react";
import { gql } from "@apollo/client";
import {
  useCurrentUserQuery,
  useFetchCurrentUserOrdersQuery,
} from "graphql/types";
import OrderChatPanel from "components/orderChatPanels/orderChatPanel/OrderChatPanel";
import useOrderChatStore from "stores/orderChatsStore";

export const FETCH_ORDER_MESSAGES = gql`
  query FetchOrderMessages($orderId: ID!) {
    orderMessages(orderId: $orderId) {
      id
      body
      createdAt
      userId
      userIsAdmin
      userIsGemini
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
        userIsGemini
      }
    }
  }
`;

export const FETCH_CURRENT_USER_ORDERS = gql`
  query FetchCurrentUserOrders($incomplete: Boolean) {
    currentUserOrders(incomplete: $incomplete) {
      id
      amountTotal
      createdAt
      guestEmail
      updatedAt
      status
      completedAt
      stripeCheckoutSessionLineItems {
        imageUrl
        name
        quantity
        unitAmount
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

  const { setupChats, chatVisibility } = useOrderChatStore();

  const { data, loading, refetch } = useFetchCurrentUserOrdersQuery({
    variables: { incomplete: true },
  });

  useEffect(() => {
    const orderIds = data?.currentUserOrders?.map((order) =>
      parseInt(order.id)
    );

    if (orderIds && orderIds?.length) {
      setupChats(orderIds, "bottom_stacked");
    }
  }, [data]);

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
