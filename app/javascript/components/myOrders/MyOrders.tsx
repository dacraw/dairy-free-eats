import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useFetchCurrentUserOrdersQuery } from "graphql/types";
import { startCase } from "lodash";
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
          {data?.currentUserOrders?.map((order) => {
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
                      onMouseOver={(e) => (e.currentTarget.style.zIndex = "50")}
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
                      <img
                        className={`w-full h-full rounded-full `}
                        src={item.imageUrl}
                      />
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <div className="grid md:block">
                    {order.status === "completed" ? (
                      <>
                        <p className="font-bold">Completed on:</p>
                        <p>{order.completedAt}</p>
                      </>
                    ) : (
                      <>
                        <p className="font-bold">Placed on:</p>
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
                <div>
                  <button className="blue-button text-sm">View</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
