import { gql } from "@apollo/client";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  FetchOrdersQuery,
  SetOrderActiveMutationFn,
  useCurrentUserQuery,
  useFetchOrdersQuery,
  useSetOrderActiveMutation,
} from "graphql/types";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SET_ORDER_ACTIVE = gql`
  mutation SetOrderActive($input: SetOrderActiveInput!) {
    setOrderActive(input: $input) {
      order {
        id
        status
      }
    }
  }
`;

const FETCH_ORDERS = gql`
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
    }
  }
`;

const DesktopOrderTable: React.FC<{
  orders: FetchOrdersQuery["orders"];
  setOrderActive: SetOrderActiveMutationFn;
}> = ({ orders, setOrderActive }) => {
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
          <p>{order.user?.email}</p>
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
                onClick={() =>
                  setOrderActive({ variables: { input: { id: order.id } } })
                }
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

const ResponsiveOrderTable: React.FC<{
  orders: FetchOrdersQuery["orders"];
  setOrderActive: SetOrderActiveMutationFn;
}> = ({ orders, setOrderActive }) => {
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
              <p>{order.user?.email}</p>
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
                  onClick={() =>
                    setOrderActive({ variables: { input: { id: order.id } } })
                  }
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

const AdminDashboard = () => {
  const [
    setOrderActive,
    {
      loading: setOrderActiveLoading,
      data: setOrderActiveData,
      error: setOrderActiveError,
    },
  ] = useSetOrderActiveMutation();
  const { loading: ordersLoading, data: ordersData } = useFetchOrdersQuery();
  const { loading: currentUserLoading, data: currentUserData } =
    useCurrentUserQuery();
  const navigate = useNavigate();
  useEffect(() => {
    if (currentUserData?.currentUser && !currentUserData.currentUser.admin) {
      navigate("/");
    }
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
