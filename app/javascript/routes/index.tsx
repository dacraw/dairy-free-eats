import Home from "components/home/Home";
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

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import AdminDashboardOrderChats from "components/admin/dashboard/orderChats/AdminDashboardOrderChats";
import { ErrorBoundary } from "react-error-boundary";
import AdminRoute from "components/protRoute/AdminRoute";
import MyOrders from "components/myOrders/MyOrders";

const DefaultError = () => {
  return (
    <p>
      Sorry, something went wrong. Please contact{" "}
      <a
        href="mailto:doug.a.crawford@gmail.com"
        className="font-bold text-blue-400"
      >
        doug.a.crawford@gmail.com
      </a>{" "}
      to report this issue.
    </p>
  );
};

const AppRoute = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route
            index
            element={
              <ErrorBoundary fallback={<DefaultError />}>
                <Home />
              </ErrorBoundary>
            }
          />

          <Route path="order" element={<Order />} />
          <Route path="signup" element={<Signup />} />
          <Route path="login" element={<Login />} />
          <Route path="success" element={<OrderSuccess />} />
          <Route path="my_orders" element={<MyOrders />} />
          <Route path="admin" element={<AdminRoute />}>
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
    </BrowserRouter>
  );
};

export default AppRoute;
