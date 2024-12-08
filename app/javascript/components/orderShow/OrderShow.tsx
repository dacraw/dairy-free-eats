import { useCurrentUserQuery, useFetchOrderQuery } from "graphql/types";
import React, { useEffect } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router";
import { formatIntegerToMoney } from "util/stringUtil";

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
      <h3 className="page-title">Your Order</h3>
      <div className="dark-blue-background p-4 mb-4">
        <p className="font-bold text-sm mb-4">Order # {data?.order?.id}</p>
        <div className=" mb-4">
          {data?.order?.stripeCheckoutSessionLineItems?.map((item, i) => (
            <div
              className="grid grid-cols-[50px_1fr] gap-x-2 grid-rows-[1fr_auto] items-center border-b-2 mb-4 pb-2"
              key={i}
            >
              <p className="text-sm px-2 text-center gray-background">
                {item.quantity}x
              </p>
              <p className="">{item.name}</p>
              <p className="row-start-2 col-start-2 italic text-sm">
                {formatIntegerToMoney(Number(item.unitAmount))}
              </p>
            </div>
          ))}
        </div>
        <p>
          <span className="font-bold text-sm">Total:</span>{" "}
          {formatIntegerToMoney(Number(data?.order?.amountTotal))}
        </p>
      </div>
      <div className="grid justify-center">
        <Link to="/my_orders" className="site-link text-sm text-center">
          Back to My Orders
        </Link>
      </div>
    </div>
  );
};

export default OrderShow;
