import OrderChat from "components/orderChatPanels/orderChat/OrderChat";
import { useCurrentUserQuery, useFetchOrdersQuery } from "graphql/types";
import React from "react";

const AdminDashboardOrderChats = () => {
  const { loading: currentUserLoading, data: currentUserData } =
    useCurrentUserQuery();

  const { loading, data } = useFetchOrdersQuery();

  return (
    <div className="flex flex-wrap gap-4">
      {data?.orders?.map((order) => (
        <OrderChat
          key={order.id}
          hideChatsOnSelect={false}
          currentUserId={parseInt(currentUserData?.currentUser?.id || "")}
          orderId={order.id}
        />
      ))}
    </div>
  );
};

export default AdminDashboardOrderChats;
