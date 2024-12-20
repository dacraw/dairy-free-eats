import Footer from "components/footer/Footer";
import HeaderNav from "components/headerNav/HeaderNav";
import OrderChatPanels from "components/orderChatPanels/OrderChatPanels";
import React from "react";
import { Outlet } from "react-router";

const RootLayout = () => {
  return (
    <div>
      <HeaderNav />

      <div className="min-h-[calc(100vh-10em)] grid justify-center my-10">
        <div className="md:min-w-[500px] px-4 grid justify-center">
          <Outlet />
        </div>
      </div>

      <div className="fixed right-0 bottom-0 z-[400]">
        <OrderChatPanels />
      </div>

      <Footer />
    </div>
  );
};

export default RootLayout;
