import { useCurrentUserQuery } from "graphql/types";
import React, { useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

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
      <Link className="text-lg mb-2 border-b-2 font-bold" to="orders">
        ORDERS
      </Link>

      <Outlet />
    </>
  );
};
export default AdminDashboard;
