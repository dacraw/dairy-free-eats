import Footer from "components/footer/Footer";
import HeaderNav from "components/headerNav/HeaderNav";
import OrderChat from "components/orderChat/OrderChat";
import React from "react";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <div>
      <HeaderNav />

      <div className="min-h-[calc(100vh-17em)] grid justify-center">
        <div className="md:min-w-[500px] px-4 grid justify-center">
          <Outlet />
        </div>
      </div>

      <OrderChat />

      <Footer />
    </div>
  );
};

export default RootLayout;
