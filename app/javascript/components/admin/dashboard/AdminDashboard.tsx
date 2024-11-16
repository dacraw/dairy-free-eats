import { gql } from "@apollo/client";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  FetchOrdersQuery,
  OrderStatus,
  SetOrderStatusInput,
  SetOrderStatusMutationVariables,
  useCurrentUserQuery,
  useFetchOrdersQuery,
  useSetOrderStatusMutation,
} from "graphql/types";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const SET_ORDER_ACTIVE = gql`
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
    }
  }
`;

type OrderTableArgs = {
  orders: FetchOrdersQuery["orders"];
  setOrderActive: (
    id: SetOrderStatusInput["setOrderStatusInputType"]["id"]
  ) => void;
};

const DesktopOrderTable: React.FC<OrderTableArgs> = ({
  orders,
  setOrderActive,
}) => {
  if (!orders) return null;

  return (
    <div className="hidden md:block">
      <h5 className="text-lg mb-6 border-b-2 font-bold">ORDERS</h5>
      <div className="grid grid-cols-[50px_100px_1fr_1fr_125px] gap-4">
        <p className="font-bold">Id</p>
        <p className="font-bold">Status</p>
        <p className="font-bold">Email</p>
        <p className="font-bold">Items</p>
        <p></p>
      </div>
      {orders.map((order) => (
        <div
          key={order.id}
          className="grid grid-cols-[50px_100px_1fr_1fr_125px] gap-4"
        >
          <p>{order.id}</p>
          <p>{order.status}</p>
          <p>{order.user?.email || order.guestEmail}</p>
          <div>
            {order.stripeCheckoutSessionLineItems.map((item, i) => (
              <p key={i}>
                {item.name} x{item.quantity}
              </p>
            ))}
          </div>
          <div className="justify-self-center">
            {order.status === "received" && (
              <button
                className="green-button"
                onClick={() => setOrderActive(order.id)}
              >
                Set Active
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

const ResponsiveOrderTable: React.FC<OrderTableArgs> = ({
  orders,
  setOrderActive,
}) => {
  if (!orders) return null;

  return (
    <div className="md:hidden">
      <h5 className="text-lg mb-2 border-b-2 font-bold">ORDERS</h5>
      <div className="">
        {orders.map((order) => (
          <div key={order.id} className="bg-blue-700 rounded mb-2 p-2">
            <div className="mb-2">
              <p className="font-bold">Id</p>
              <p>{order.id}</p>
            </div>
            <div className="mb-2">
              <p className="font-bold">Status</p>
              <p>{order.status}</p>
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
              {order.status === "received" && (
                <button
                  className="green-button"
                  onClick={() => setOrderActive(order.id)}
                >
                  Set Active
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const setOrderActiveVariables = (
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

const AdminDashboard = () => {
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
      variables: setOrderActiveVariables(id, OrderStatus.Active),
    });
  };

  const { loading: currentUserLoading, data: currentUserData } =
    useCurrentUserQuery();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUserData?.currentUser && !currentUserData.currentUser.admin) {
      navigate("/");
    }
  }, [currentUserData]);

  useEffect(() => {
    // for the demo admin, refetch orders when the current user changes
    // this avoids using stale cache data
    refetchOrders();
  }, [currentUserData]);

  return (
    <div className=" grid place-content-center  ">
      {ordersLoading || currentUserLoading || setOrderActiveLoading ? (
        <div className="">
          <FontAwesomeIcon className="text-6xl mb-6" spin icon={faSpinner} />
          <p>Loading...</p>
        </div>
      ) : (
        <div className=" rounded p-2 md:p-6 ">
          <h3 className="text-3xl font-bold text-center mb-6">
            Admin Dashboard
          </h3>
          {ordersData?.orders?.length && (
            <>
              <DesktopOrderTable
                orders={ordersData.orders}
                setOrderActive={setOrderActive}
              />
              <ResponsiveOrderTable
                orders={ordersData.orders}
                setOrderActive={setOrderActive}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};
export default AdminDashboard;
