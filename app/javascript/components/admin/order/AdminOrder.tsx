import { gql } from "@apollo/client";
import { faCircleLeft } from "@fortawesome/free-regular-svg-icons";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ConfirmButton from "components/confirmButton/ConfirmButton";
import {
  OrderStatus,
  useCurrentUserQuery,
  useFetchOrderQuery,
  useSetOrderStatusMutation,
} from "graphql/types";
import React, { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export const FETCH_ORDER = gql`
  query FetchOrder($id: ID!) {
    order(id: $id) {
      id
      user {
        id
        email
      }
      status
      stripePaymentIntentId
      createdAt
      updatedAt
      stripeCheckoutSessionLineItems {
        name
        quantity
      }
      guestEmail
    }
  }
`;

const AdminOrder = () => {
  const { orderId } = useParams<{ orderId: string }>();

  const { loading, data, error } = useFetchOrderQuery({
    variables: { id: orderId || "" },
  });

  const [
    setOrderStatus,
    {
      loading: setOrderStatusLoading,
      data: setOrderStatusData,
      error: setOrderStatusError,
    },
  ] = useSetOrderStatusMutation();

  const { loading: currentUserLoading, data: currentUserData } =
    useCurrentUserQuery();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUserData?.currentUser && !currentUserData.currentUser.admin) {
      navigate("/");
    }
  }, [currentUserData]);

  return (
    <div>
      {loading || currentUserLoading ? (
        <div className="grid justify-center">
          <FontAwesomeIcon className="text-6xl mb-6" icon={faSpinner} spin />
          <p>Loading order...</p>
        </div>
      ) : (
        <div>
          <Link
            className="flex items-center gap-2 mb-6 text-blue-500  hover:text-blue-300 transition-all underline md:no-underline"
            to="/admin/dashboard"
          >
            <FontAwesomeIcon icon={faCircleLeft} /> Back to Dashboard
          </Link>
          <div className=" border-2 rounded p-4 bg-blue-700">
            <h3 className="text-center text-lg font-bold border-b-2 mb-6 pb-2">
              Order Details
            </h3>

            <div className="grid grid-cols-2 gap-4 grid-rows-1">
              <p className="justify-self-end font-bold text-right">Id</p>
              <p>{data?.order?.id}</p>
              <p className="justify-self-end font-bold text-right">
                User Email
              </p>
              <p>
                {data?.order?.user
                  ? data?.order?.user?.email
                  : data?.order?.guestEmail}
              </p>
              <p className="justify-self-end font-bold text-right">Status</p>
              <p data-testid="admin-order-status">{data?.order?.status}</p>

              <p className="justify-self-end font-bold text-right">
                Stripe Payment Intent Id
              </p>
              <p className="break-all">{data?.order?.stripePaymentIntentId}</p>
              <p className="justify-self-end font-bold text-right">
                Created At
              </p>
              <p>{data?.order?.createdAt}</p>
              <p className="justify-self-end font-bold text-right">
                Order Items
              </p>
              <div>
                {data?.order?.stripeCheckoutSessionLineItems?.map((item, i) => (
                  <p key={i}>
                    {item.name} x{item.quantity}
                  </p>
                ))}
              </div>
            </div>
            {data?.order?.status === OrderStatus.Received && (
              <ConfirmButton
                action={async () => {
                  await setOrderStatus({
                    variables: {
                      input: {
                        setOrderStatusInputType: {
                          id: data?.order?.id!,
                          status: OrderStatus.Active,
                        },
                      },
                    },
                  });
                }}
                actionText={`Set order #${data?.order.id!} to active?`}
                buttonClassName="green-button"
                buttonText="Set Active"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrder;