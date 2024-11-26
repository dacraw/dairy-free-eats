import Footer from "components/footer/Footer";
import HeaderNav from "components/headerNav/HeaderNav";
import OrderChatPanels from "components/orderChatPanels/OrderChatPanels";
import React from "react";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <div>
      <HeaderNav />

      <div className="min-h-[calc(100vh-17em)] grid justify-center">
        <div className="md:min-w-[500px] px-4 grid justify-center mt-[75px]">
          <Outlet />
        </div>
      </div>

      <div className="fixed right-0 bottom-0 z-50">
        <OrderChatPanels />
      </div>

      <Footer />
    </div>
  );
};

export default RootLayout;
