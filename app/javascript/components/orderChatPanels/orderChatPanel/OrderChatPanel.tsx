import { faMessage, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import OrderChat from "components/orderChatPanels/orderChat/OrderChat";
import { FETCH_ORDER_MESSAGES } from "components/orderChatPanels/OrderChatPanels";
import {
  FetchOrderMessagesQuery,
  useOrderMessageReceivedSubscription,
  User,
} from "graphql/types";

import React, { useEffect, useRef, useState } from "react";

const OrderChatPanel = ({
  orderId,
  currentUserId,
  currentUserIsAdmin,
}: {
  orderId: string;
  currentUserId: User["id"];
  currentUserIsAdmin: boolean;
}) => {
  const [visible, setVisible] = useState(false);
  const toggleVisibilityRef = useRef<HTMLParagraphElement>(null);

  const {
    data: orderMessageReceivedData,
    loading: orderMessageReceivedLoading,
    error: orderMessageReceivedError,
  } = useOrderMessageReceivedSubscription({
    variables: { orderId },
    fetchPolicy: "no-cache",
    onData({ client, data }) {
      const receivedMessage = data.data?.orderMessageReceived;
      if (!receivedMessage) return null;

      const existingData = client.readQuery<FetchOrderMessagesQuery>({
        query: FETCH_ORDER_MESSAGES,
        variables: { orderId },
      });

      if (!existingData) return null;

      const updatedData = {
        ...existingData,
        orderMessages: [...existingData.orderMessages, receivedMessage],
      };

      client.writeQuery({
        query: FETCH_ORDER_MESSAGES,
        variables: { orderId },
        data: updatedData,
      });
    },
  });

  useEffect(() => {
    const closeChat = (e: MouseEvent) => {
      if (toggleVisibilityRef.current) {
        // check if the click is outside the component, but allow the panel to be opened initially
        // this also allows the submit button and input element to be clicked w/o closing the chat panel
        if (!toggleVisibilityRef.current.contains(e.target as HTMLElement)) {
          setVisible(false);
        }
      }
    };

    document.addEventListener("click", closeChat);

    return () => document.removeEventListener("click", closeChat);
  }, []);

  return (
    <div
      className="bg-gray-900  text-gray-200 w-60 rounded"
      ref={toggleVisibilityRef}
    >
      <div
        className={`${
          orderMessageReceivedLoading ? "text-gray-500" : "text-inherit"
        } text-center bg-gray-800 rounded py-2 cursor-pointer flex gap-4 justify-center items-center`}
        onClick={() => {
          if (orderMessageReceivedLoading) return;

          setVisible(!visible);
        }}
      >
        {orderMessageReceivedError ? (
          <p>{orderMessageReceivedError.message}</p>
        ) : (
          <>
            <p>Order #{orderId} Chat</p>
            {orderMessageReceivedLoading ? (
              // TODO: create a component for the loading spinners;
              // look into using the react router API w/ createBrowserRouter
              <FontAwesomeIcon icon={faSpinner} spin />
            ) : (
              <FontAwesomeIcon icon={faMessage} />
            )}
          </>
        )}
      </div>

      {visible && (
        <OrderChat
          orderId={orderId}
          currentUserId={currentUserId}
          currentUserIsAdmin={currentUserIsAdmin}
        />
      )}
    </div>
  );
};

export default OrderChatPanel;
