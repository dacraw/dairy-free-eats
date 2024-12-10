import React, { useEffect } from "react";

import { gql } from "@apollo/client";
import {
  FetchOrdersQuery,
  OrderStatus,
  SetOrderStatusInput,
  SetOrderStatusMutationVariables,
  useCurrentUserQuery,
  useFetchOrdersQuery,
  useSetOrderStatusMutation,
  useStripeRefundCreateMutation,
} from "graphql/types";
import { Link } from "react-router";
import { startCase } from "lodash";
import ConfirmButton from "components/confirmButton/ConfirmButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

export const SET_ORDER_STATUS = gql`
  mutation SetOrderStatus($input: SetOrderStatusInput!) {
    setOrderStatus(input: $input) {
      order {
        id
        status
      }
    }
  }
`;

export const FETCH_ORDERS = gql`
  query FetchOrders {
    orders {
      id
      status
      stripeCheckoutSessionLineItems {
        name
        quantity
      }
      user {
        id
        email
      }
      guestEmail
      stripePaymentIntentId
    }
  }
`;

type OrderTableArgs = {
  orders: FetchOrdersQuery["orders"];
  setOrderActive: (
    id: SetOrderStatusInput["setOrderStatusInputType"]["id"]
  ) => void;
  setOrderInTransit: (
    id: SetOrderStatusInput["setOrderStatusInputType"]["id"]
  ) => void;
  setOrderCompleted: (
    id: SetOrderStatusInput["setOrderStatusInputType"]["id"]
  ) => void;
  setOrderCancelled: (
    id: SetOrderStatusInput["setOrderStatusInputType"]["id"]
  ) => void;
};

const DesktopOrderTable: React.FC<OrderTableArgs> = ({
  orders,
  setOrderActive,
  setOrderInTransit,
  setOrderCompleted,
  setOrderCancelled,
}) => {
  if (!orders) return null;

  return (
    <div className="hidden md:block">
      <div className="grid grid-cols-[50px_100px_1fr_1fr_125px] gap-4">
        <p className="font-bold">Id</p>
        <p className="font-bold">Status</p>
        <p className="font-bold">Email</p>
        <p className="font-bold">Items</p>
        <p></p>
      </div>
      <div className="grid grid-cols-[50px_100px_1fr_1fr_125px_auto] gap-4 items-center">
        {orders.map((order) => (
          <React.Fragment key={order.id}>
            <p>
              <Link
                to={`${order.id}`}
                className="text-blue-400 hover:underline"
              >
                {order.id}
              </Link>
            </p>
            <p>{startCase(order.status)}</p>
            <p>{order.user?.email || order.guestEmail}</p>
            <div>
              {order.stripeCheckoutSessionLineItems.map((item, i) => (
                <p key={i}>
                  {item.name} x{item.quantity}
                </p>
              ))}
            </div>
            <div className="justify-self-center">
              {order.status === OrderStatus.Received && (
                <ConfirmButton
                  action={() => setOrderActive(order.id)}
                  actionText={`Set order #${order.id} to active?`}
                  buttonClassName="green-button"
                  buttonText="Set Active"
                />
              )}
              {order.status === OrderStatus.Active && (
                <ConfirmButton
                  action={() => setOrderInTransit(order.id)}
                  actionText={`Set order #${order.id} to in-transit?`}
                  buttonClassName="green-button"
                  buttonText="Set In-Transit"
                />
              )}
              {order.status === OrderStatus.InTransit && (
                <ConfirmButton
                  action={() => setOrderCompleted(order.id)}
                  actionText={`Set order #${order.id} to completed?`}
                  buttonClassName="green-button"
                  buttonText="Set Completed"
                />
              )}
            </div>
            <div>
              {order.status !== OrderStatus.Completed &&
                order.status !== OrderStatus.Cancelled && (
                  <ConfirmButton
                    action={() => setOrderCancelled(order.id)}
                    actionText={`Set order #${order.id} to cancelled?`}
                    buttonClassName="red-button"
                    buttonText="Cancel"
                  />
                )}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

const ResponsiveOrderTable: React.FC<OrderTableArgs> = ({
  orders,
  setOrderActive,
  setOrderInTransit,
  setOrderCompleted,
  setOrderCancelled,
}) => {
  if (!orders) return null;

  return (
    <div className="md:hidden">
      <div className="">
        {orders.map((order) => (
          <div key={order.id} className="bg-blue-700 rounded mb-2 p-2">
            <div className="mb-2">
              <p className="font-bold">Id</p>
              <Link className="underline text-blue-300" to={`${order.id}`}>
                {order.id}
              </Link>
            </div>
            <div className="mb-2">
              <p className="font-bold">Status</p>
              <p>{startCase(order.status)}</p>
            </div>
            <div className="mb-2">
              <p className="font-bold">Email</p>
              <p>{order.user?.email || order.guestEmail}</p>
            </div>
            <div className="mb-2">
              <p className="font-bold">Items</p>
              <div>
                {order.stripeCheckoutSessionLineItems.map((item, i) => (
                  <p key={i}>
                    {item.name} x{item.quantity}
                  </p>
                ))}
              </div>
            </div>
            <div>
              {order.status === OrderStatus.Received && (
                <ConfirmButton
                  action={() => setOrderActive(order.id)}
                  actionText={`Set order #${order.id} to active?`}
                  buttonClassName="green-button"
                  buttonText="Set Active"
                />
              )}
              {order.status === OrderStatus.Active && (
                <ConfirmButton
                  action={() => setOrderInTransit(order.id)}
                  actionText={`Set order #${order.id} to in-transit?`}
                  buttonClassName="green-button"
                  buttonText="Set In-Transit"
                />
              )}
              {order.status === OrderStatus.InTransit && (
                <ConfirmButton
                  action={() => setOrderCompleted(order.id)}
                  actionText={`Set order #${order.id} to completed?`}
                  buttonClassName="green-button"
                  buttonText="Set Completed"
                />
              )}
              {order.status !== OrderStatus.Completed &&
                order.status !== OrderStatus.Cancelled && (
                  <ConfirmButton
                    action={() => setOrderCancelled(order.id)}
                    actionText={`Set order #${order.id} to cancelled?`}
                    buttonClassName="red-button"
                    buttonText="Cancel"
                  />
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const setOrderStatusVariables = (
  id: SetOrderStatusMutationVariables["input"]["setOrderStatusInputType"]["id"],
  status: SetOrderStatusMutationVariables["input"]["setOrderStatusInputType"]["status"]
): SetOrderStatusMutationVariables => {
  return {
    input: {
      setOrderStatusInputType: {
        id,
        status,
      },
    },
  };
};

const AdminDashboardOrders = () => {
  const { data: currentUserData } = useCurrentUserQuery();
  const [
    setOrderStatus,
    {
      loading: setOrderActiveLoading,
      data: setOrderActiveData,
      error: setOrderActiveError,
    },
  ] = useSetOrderStatusMutation();
  const {
    loading: ordersLoading,
    data: ordersData,
    refetch: refetchOrders,
  } = useFetchOrdersQuery();

  const setOrderActive = (
    id: SetOrderStatusInput["setOrderStatusInputType"]["id"]
  ) => {
    setOrderStatus({
      variables: setOrderStatusVariables(id, OrderStatus.Active),
    });
  };

  const setOrderInTransit = (
    id: SetOrderStatusInput["setOrderStatusInputType"]["id"]
  ) => {
    setOrderStatus({
      variables: setOrderStatusVariables(id, OrderStatus.InTransit),
    });
  };

  const setOrderCompleted = (
    id: SetOrderStatusInput["setOrderStatusInputType"]["id"]
  ) => {
    setOrderStatus({
      variables: setOrderStatusVariables(id, OrderStatus.Completed),
    });
  };

  const setOrderCancelled = (
    id: SetOrderStatusInput["setOrderStatusInputType"]["id"]
  ) => {
    setOrderStatus({
      variables: setOrderStatusVariables(id, OrderStatus.Cancelled),
    });
  };

  useEffect(() => {
    // for the demo admin, refetch orders when the current user changes
    // this avoids using stale cache data
    refetchOrders();
  }, [currentUserData?.currentUser?.id]);
  return (
    <div className=" grid place-content-center">
      {ordersLoading || setOrderActiveLoading ? (
        <div className="">
          <FontAwesomeIcon className="text-6xl mb-6" spin icon={faSpinner} />
          <p>Loading...</p>
        </div>
      ) : (
        <div className="rounded p-2 md:p-6 ">
          {ordersData?.orders?.length && (
            <>
              <DesktopOrderTable
                orders={ordersData.orders}
                setOrderActive={setOrderActive}
                setOrderInTransit={setOrderInTransit}
                setOrderCompleted={setOrderCompleted}
                setOrderCancelled={setOrderCancelled}
              />
              <ResponsiveOrderTable
                orders={ordersData.orders}
                setOrderActive={setOrderActive}
                setOrderInTransit={setOrderInTransit}
                setOrderCompleted={setOrderCompleted}
                setOrderCancelled={setOrderCancelled}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboardOrders;
