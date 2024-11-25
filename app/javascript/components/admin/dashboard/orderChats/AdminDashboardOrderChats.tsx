import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import OrderChatPanel from "components/orderChatPanels/orderChatPanel/OrderChatPanel";
import { useCurrentUserQuery, useFetchOrdersQuery } from "graphql/types";
import React from "react";

const AdminDashboardOrderChats = () => {
  const { loading: currentUserLoading, data: currentUserData } =
    useCurrentUserQuery();

  const { data, loading } = useFetchOrdersQuery();

  return (
    <div className="flex flex-wrap gap-4 my-4">
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
