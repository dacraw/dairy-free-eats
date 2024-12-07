import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ImageLoader from "components/imageLoader/ImageLoader";
import { useFetchCurrentUserOrdersQuery } from "graphql/types";
import { startCase } from "lodash";
import React from "react";
import { Link } from "react-router";

const MyOrders = () => {
  const { data, loading, error } = useFetchCurrentUserOrdersQuery();

  if (error) return <p>There was an error.</p>;

  return (
    <div>
      <h3 className="animate-home-title-shimmer font-bold text-center mb-10 text-2xl">
        My Orders
      </h3>
      {loading ? (
        <div>
          <FontAwesomeIcon
            icon={faSpinner}
            spin
            className="text-2xl text-center"
          />
        </div>
      ) : (
        <div>
          {data?.currentUserOrders?.length === 0 ? (
            <div>
              <p>
                You currently have no current or past orders! Head over to the{" "}
                <Link className="site-link" to="/order">
                  Order Page
                </Link>{" "}
                to place an order!
              </p>
            </div>
          ) : (
            data?.currentUserOrders?.map((order) => {
              const items = order.stripeCheckoutSessionLineItems;
              return (
                <div
                  className="grid grid-cols-[auto_1fr_auto] gap-4 items-center mb-4"
                  key={order.id}
                >
                  <div
                    className={`justify-center`}
                    style={{
                      display: "grid",
                      gridTemplateColumns: `repeat(${items.length * 2}, 1fr)`,
                    }}
                  >
                    {items.map((item, i) => (
                      <div
                        key={i}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.zIndex = "50")
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.zIndex = `${items.length - i}`)
                        }
                        className={`w-12 h-12 hover:scale-125 transition-transform`}
                        style={{
                          gridArea: `1 / ${items.length * 2 + 1} / 1 / ${
                            items.length + 1 - i
                          }`,
                          zIndex: items.length - i,
                        }}
                      >
                        <ImageLoader
                          alt={item.name}
                          additionalClassName={`w-full h-full rounded-full `}
                          src={item.imageUrl}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="text-sm">
                    <p className="font-bold">Order #{order.id}</p>
                    <div className="grid md:block">
                      {order.status === "completed" ? (
                        <>
                          <p>Completed on:</p>
                          <p>{order.completedAt}</p>
                        </>
                      ) : (
                        <>
                          <p>Placed on:</p>
                          <p>{order.createdAt}</p>
                          <p className="italic">{startCase(order.status)}</p>
                        </>
                      )}
                    </div>
                    <p>
                      {order.stripeCheckoutSessionLineItems.length} Item
                      {order.stripeCheckoutSessionLineItems.length > 1
                        ? "s"
                        : ""}{" "}
                      -{" "}
                      {new Intl.NumberFormat("en-EN", {
                        style: "currency",
                        currency: "USD",
                        minimumFractionDigits: 2,
                      }).format(Number((order.amountTotal / 100).toFixed(2)))}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
