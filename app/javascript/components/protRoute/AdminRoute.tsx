import { useCurrentUserQuery } from "graphql/types";
import React from "react";
import { Outlet, Navigate } from "react-router";

const AdminRoute = () => {
  const { data, loading, error } = useCurrentUserQuery({
    fetchPolicy: "cache-and-network",
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>There was an error.</p>;

  return data?.currentUser?.admin ? <Outlet /> : <Navigate to="/" />;
};

export default AdminRoute;
