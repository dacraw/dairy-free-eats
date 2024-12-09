import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import OrderChatPanel from "components/orderChatPanels/orderChatPanel/OrderChatPanel";
import { useCurrentUserQuery, useFetchOrdersQuery } from "graphql/types";
import React, { useEffect } from "react";
import useOrderChatStore from "stores/orderChatsStore";

const AdminDashboardOrderChats = () => {
  const { loading: currentUserLoading, data: currentUserData } =
    useCurrentUserQuery();

  const { setupChats } = useOrderChatStore();

  const { data, loading } = useFetchOrdersQuery();

  useEffect(() => {
    const orderIds = data?.orders?.map((order) => parseInt(order.id));

    if (orderIds && orderIds?.length) {
      setupChats(orderIds, "top_columns");
    }
  }, [data]);

  return (
    <div className="relative">
      {loading ? (
        <FontAwesomeIcon className="text-xl" icon={faSpinner} />
      ) : (
        data?.orders?.map((order) => (
          <OrderChatPanel
            key={order.id}
            currentUserId={currentUserData?.currentUser?.id || ""}
            currentUserIsAdmin={Boolean(currentUserData?.currentUser?.admin)}
            orderId={order.id}
          />
        ))
      )}
    </div>
  );
};

export default AdminDashboardOrderChats;
