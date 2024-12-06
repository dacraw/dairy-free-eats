import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useFetchCurrentUserOrdersQuery } from "graphql/types";
import React from "react";

const MyOrders = () => {
  const { data, loading, error } = useFetchCurrentUserOrdersQuery();

  if (!data) return null;

  return (
    <div>
      {loading ? (
        <FontAwesomeIcon icon={faSpinner} />
      ) : (
        <div>
          {data?.currentUserOrders?.map((order) => (
            <div key={order.id}>
              <p>{order.status}</p>
              <div>
                {order.stripeCheckoutSessionLineItems.map((item, i) => (
                  <div key={i}>
                    <p>{item.name}</p>
                    <p>{item.quantity}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
