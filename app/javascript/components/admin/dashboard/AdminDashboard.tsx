import { useCurrentUserQuery } from "graphql/types";
import React, { useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const { loading: currentUserLoading, data: currentUserData } =
    useCurrentUserQuery();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUserData?.currentUser && !currentUserData.currentUser.admin) {
      navigate("/");
    }
  }, [currentUserData]);

  return (
    <>
      <h3 className="text-3xl font-bold text-center mb-6">Admin Dashboard</h3>
      <div className="flex gap-4 border-b-2 pb-2 mb-2">
        <NavLink
          className={({ isActive }) => {
            return `${
              isActive ? "blue-button" : "hover:text-blue-400 transition-colors"
            } py-2 px-4  text-lg font-bold`;
          }}
          to="orders"
        >
          ORDERS
        </NavLink>
      </div>
      <Outlet />
    </>
  );
};
export default AdminDashboard;
