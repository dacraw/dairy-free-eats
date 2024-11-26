import Home from "components/Home";
import Order from "components/Order/Order";
import AdminDashboard from "components/admin/dashboard/AdminDashboard";
import AdminDashboardIndex from "components/admin/dashboard/index/AdminDashboardIndex";
import AdminDashboardOrders from "components/admin/dashboard/orders/AdminDashboardOrders";
import AdminDashboardOrder from "components/admin/dashboard/order/AdminDashboardOrder";
import CreateNewPassword from "components/createNewPassword/CreateNewPassword";
import RootLayout from "components/layouts/RootLayout";
import Login from "components/login/Login";
import OrderSuccess from "components/orderSuccess/OrderSuccess";
import PasswordReset from "components/passwordReset/PasswordReset";
import Signup from "components/signup/Signup";
import { useCurrentUserQuery } from "graphql/types";

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminDashboardOrderChats from "components/admin/dashboard/orderChats/AdminDashboardOrderChats";

const AppRoute = () => {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="order" element={<Order />} />
          <Route path="signup" element={<Signup />} />
          <Route path="login" element={<Login />} />
          <Route path="success" element={<OrderSuccess />} />
          <Route path="admin">
            <Route path="dashboard" element={<AdminDashboard />}>
              <Route index element={<AdminDashboardIndex />} />
              <Route path="orders">
                <Route index element={<AdminDashboardOrders />} />
                <Route path=":id" element={<AdminDashboardOrder />} />
              </Route>
              <Route
                path="order_chats"
                element={<AdminDashboardOrderChats />}
              />
            </Route>
          </Route>
          <Route path="password_reset" element={<PasswordReset />} />
          <Route
            path="/passwords/:token/edit"
            element={<CreateNewPassword />}
          />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoute;
