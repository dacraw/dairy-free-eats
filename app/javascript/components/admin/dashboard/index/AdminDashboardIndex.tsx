import React from "react";
import { Link } from "react-router";

const AdminDashboardIndex = () => {
  return (
    <div>
      <p className="mb-6">Select a navigation option from above.</p>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded dark-blue-background p-4">
          <h3 className=" font-bold text-center border-b-2 mb-4 pb-2">
            <Link to="orders" className="hover:text-gray-200 ">
              ORDERS
            </Link>
          </h3>
          <p className="">
            View all orders placed by a user, whether a guest or a user
            registered on this site.
          </p>
        </div>
        <div className="dark-blue-background rounded p-4">
          <h3 className="font-bold text-center mb-4 pb-2 border-b-2">
            <Link to="order_chats" className="hover:text-gray-200">
              ORDER CHATS
            </Link>
          </h3>
          <p className=" rounded-[0_0_.25rem_.25rem]">
            View order chat panels for any order that is not completed. Only the
            user that placed the order and any admin can send and view messages
            in this chat.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardIndex;
