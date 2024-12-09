import {
  faArrowRight,
  faMessage,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import OrderChat from "components/orderChatPanels/orderChat/OrderChat";
import { FETCH_ORDER_MESSAGES } from "components/orderChatPanels/OrderChatPanels";
import {
  FetchOrderMessagesQuery,
  useOrderMessageReceivedSubscription,
  User,
} from "graphql/types";

import React, { useEffect, useRef } from "react";
import useOrderChatStore, { OrderChatVisibility } from "stores/orderChatsStore";

const OrderChatPanel = ({
  orderId,
  currentUserId,
  currentUserIsAdmin,
}: {
  orderId: string;
  currentUserId: User["id"];
  currentUserIsAdmin: boolean;
}) => {
  const { mode, chatVisibility, setChatVisibility } = useOrderChatStore();
  const visibility = chatVisibility[parseInt(orderId)];
  const setVisible = (visibility: OrderChatVisibility) =>
    setChatVisibility(parseInt(orderId), visibility);

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
        if (
          !toggleVisibilityRef.current.contains(e.target as HTMLElement) &&
          visibility === "opened"
        ) {
          setVisible("closing");
        }
      }
    };

    document.addEventListener("click", closeChat);

    return () => document.removeEventListener("click", closeChat);
  }, [visibility]);

  return (
    <div className={`text-gray-200 w-60 rounded `} ref={toggleVisibilityRef}>
      <div
        className={`${
          orderMessageReceivedLoading ? "text-gray-500" : "text-inherit"
        } gray-button hover:gray-button-hover text-center cursor-pointer flex gap-4 justify-center items-center
        `}
        onClick={() => {
          if (orderMessageReceivedLoading) return;

          if (visibility === "closed") {
            setVisible("opening");
          } else if (visibility === "opened") {
            setVisible("closing");
          }
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
              <>
                {mode === "top_columns" ? null : (
                  <FontAwesomeIcon icon={faMessage} />
                )}

                {mode === "top_columns" ? (
                  visibility === "opened" ? (
                    <FontAwesomeIcon icon={faArrowRight} />
                  ) : (
                    <FontAwesomeIcon icon={faMessage} />
                  )
                ) : null}
              </>
            )}
          </>
        )}
      </div>

      {visibility !== "closed" && (
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
