import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCurrentUserQuery } from "graphql/types";
import React, { useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router";

const AdminDashboard = () => {
  const {
    loading: currentUserLoading,
    data: currentUserData,
    error,
  } = useCurrentUserQuery({ fetchPolicy: "network-only" });
  const navigate = useNavigate();

  useEffect(() => {
    if (
      (currentUserData?.currentUser && !currentUserData?.currentUser?.admin) ||
      currentUserData?.currentUser === null
    ) {
      navigate("/");
    }
  }, [currentUserData]);

  return (
    <div className="md:w-[90vw]">
      <>
        <h3 className="font-bold md:px-6 text-center text-xl mb-6 animate-home-title-shimmer">
          Admin Dashboard
        </h3>
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
