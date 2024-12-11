import React, { useEffect } from "react";

import { gql } from "@apollo/client";
import {
  FetchOrdersQuery,
  Maybe,
  Order,
  OrderStatus,
  SetOrderStatusInput,
  SetOrderStatusMutationVariables,
  useCurrentUserQuery,
  useFetchOrdersQuery,
  User,
  useSetOrderStatusMutation,
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
        imageUrl
        unitAmount
      }
      user {
        id
        email
      }
      createdAt
      updatedAt
      amountTotal
      guestEmail
      stripePaymentIntentId
    }
  }
`;

// type OrderTableArgs = {
//   orders: FetchOrdersQuery["orders"];
//   setOrderActive: (
//     id: SetOrderStatusInput["setOrderStatusInputType"]["id"]
//   ) => void;
//   setOrderInTransit: (
//     id: SetOrderStatusInput["setOrderStatusInputType"]["id"]
//   ) => void;
//   setOrderCompleted: (
//     id: SetOrderStatusInput["setOrderStatusInputType"]["id"]
//   ) => void;
//   setOrderCancelled: (
//     id: SetOrderStatusInput["setOrderStatusInputType"]["id"]
//   ) => void;
// };

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

const AdminDashboardOrder: React.FC<{
  id: Order["id"];
  status: Order["status"];
  guestEmail: Maybe<Order["guestEmail"]>;
  userEmail: Maybe<User["email"]>;
  lineItems: Order["stripeCheckoutSessionLineItems"];
}> = ({ id, status, guestEmail, userEmail, lineItems }) => {
  const [
    setOrderStatus,
    {
      loading: setOrderActiveLoading,
      data: setOrderActiveData,
      error: setOrderActiveError,
    },
  ] = useSetOrderStatusMutation();

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

  return (
    <>
      <div className="flex gap-x-2  justify-self-center">
        <span className="md:hidden">ID:</span>
        <Link to={`${id}`} className="font-bold hover:underline">
          {id}
        </Link>
      </div>
      <div className="flex gap-x-2 justify-self-center items-center">
        <span className="font-bold md:hidden">Status:</span>
        <span className="italic md:not-italic">{startCase(status)}</span>
      </div>
      <div className="col-span-2 mb-4 md:mb-0 md:block md:col-span-1">
        <span className="font-bold md:hidden">Email: </span>
        <span>{userEmail || guestEmail}</span>
      </div>
      <div className="col-span-2 mb-4 md:mb-0 md:col-span-1">
        <span className="font-bold md:hidden">Items</span>
        <div>
          {lineItems.map((item, i) => (
            <p key={i}>
              {item.name} x{item.quantity}
            </p>
          ))}
        </div>
      </div>
      <div>
        {status === OrderStatus.Received && (
          <ConfirmButton
            action={() => setOrderActive(id)}
            actionText={`Set order #${id} to active?`}
            buttonClassName="green-button"
            buttonText="Set Active"
          />
        )}
        {status === OrderStatus.Active && (
          <ConfirmButton
            action={() => setOrderInTransit(id)}
            actionText={`Set order #${id} to in-transit?`}
            buttonClassName="green-button"
            buttonText="Set In-Transit"
          />
        )}
        {status === OrderStatus.InTransit && (
          <ConfirmButton
            action={() => setOrderCompleted(id)}
            actionText={`Set order #${id} to completed?`}
            buttonClassName="green-button"
            buttonText="Set Completed"
          />
        )}
      </div>
      <div>
        {status !== OrderStatus.Completed &&
          status !== OrderStatus.Cancelled && (
            <ConfirmButton
              action={() => setOrderCancelled(id)}
              actionText={`Set order #${id} to cancelled?`}
              buttonClassName="red-button"
              buttonText="Cancel"
            />
          )}
      </div>
    </>
  );
};

const AdminDashboardOrders = () => {
  const { data: currentUserData } = useCurrentUserQuery();
  const {
    loading: ordersLoading,
    data: ordersData,
    refetch: refetchOrders,
  } = useFetchOrdersQuery();

  useEffect(() => {
    // for the demo admin, refetch orders when the current user changes
    // this avoids using stale cache data
    refetchOrders();
  }, [currentUserData?.currentUser?.id]);

  if (!ordersData) return null;

  return (
    <div>
      {ordersLoading ? (
        <div className="">
          <FontAwesomeIcon className="text-6xl mb-6" spin icon={faSpinner} />
          <p>Loading...</p>
        </div>
      ) : (
        <div className="">
          <div
            className="
            text-center p-2 hidden 
            md:grid md:grid-cols-[25px_100px_1fr_1fr_130px_90px] md:gap-2 md:items-center
            "
          >
            <p className="font-bold">Id</p>
            <p className="font-bold">Status</p>
            <p className="font-bold">Email</p>
            <p className="font-bold">Items</p>
            <p></p>
            <p></p>
          </div>

          {Number(ordersData?.orders?.length) > 0 &&
            ordersData?.orders?.map((order) => {
              if (!order) return;
              return (
                <div
                  key={order.id}
                  className="
                  mb-4 grid grid-cols-2 text-sm text-center px-2 py-4 gap-4 items-center
                  dark-gray-background rounded
                  md:grid md:grid-cols-[25px_100px_1fr_1fr_130px_90px] md:gap-2 md:items-center md:mb-0 md:even:gray-background md:odd:dark-gray-background md:rounded-none
                  "
                >
                  <AdminDashboardOrder
                    id={order.id}
                    status={order.status}
                    guestEmail={order.guestEmail}
                    userEmail={order.user?.email || null}
                    lineItems={order?.stripeCheckoutSessionLineItems}
                  />
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default AdminDashboardOrders;
