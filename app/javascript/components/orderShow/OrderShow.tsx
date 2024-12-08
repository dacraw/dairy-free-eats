import { useCurrentUserQuery, useFetchOrderQuery } from "graphql/types";
import React, { useEffect } from "react";
import { Navigate, useNavigate, useParams } from "react-router";

const OrderShow = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: currentUserData,
    loading: currentUserLoading,
    error: currentUserError,
  } = useCurrentUserQuery();

  const { data, loading, error } = useFetchOrderQuery({
    variables: { id: id || "" },
    skip: !id,
  });

  if (!data) return null;
  if (currentUserData?.currentUser?.id !== data?.order?.user?.id)
    return <Navigate to="/my_orders" />;

  return (
    <div>
      <h3>Your Order</h3>
      <p>Order # {data?.order?.id}</p>
      <div className="grid grid-cols-[auto_1fr">
        {data?.order?.stripeCheckoutSessionLineItems?.map((item, i) => (
          <React.Fragment key={i}>
            <p>{item.quantity}</p>
            <p>{item.name}</p>
          </React.Fragment>
        ))}
      </div>
      <p>Total: {data?.order?.amountTotal}</p>
    </div>
  );
};

export default OrderShow;
