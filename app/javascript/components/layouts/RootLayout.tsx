import Footer from "components/footer/Footer";
import HeaderNav from "components/headerNav/HeaderNav";
import React from "react";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <div>
      <HeaderNav />

      <div className="min-h-[calc(100vh-17em)]">
        <Outlet />
      </div>

      <Footer />
    </div>
  );
};

export default RootLayout;
