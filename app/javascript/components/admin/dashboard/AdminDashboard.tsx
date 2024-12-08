import React from "react";
import { NavLink, Outlet } from "react-router";

const AdminDashboard = () => {
  return (
    <div className="md:w-[90vw]">
      <>
        <h3 className="page-title">Admin Dashboard</h3>
        <div className="flex gap-4 border-b-2 pb-2 mb-2">
          <NavLink
            className={({ isActive }) => {
              return `${
                isActive
                  ? "blue-button"
                  : "hover:text-blue-400 transition-colors"
              } py-2 px-4  text-lg font-bold`;
            }}
            to="orders"
          >
            ORDERS
          </NavLink>
          <NavLink
            className={({ isActive }) => {
              return `${
                isActive
                  ? "blue-button"
                  : "hover:text-blue-400 transition-colors"
              } py-2 px-4  text-lg font-bold`;
            }}
            to="order_chats"
          >
            ORDER CHATS
          </NavLink>
        </div>

        <Outlet />
      </>
    </div>
  );
};
export default AdminDashboard;
