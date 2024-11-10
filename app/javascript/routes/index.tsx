import Home from "components/Home";
import Order from "components/Order/Order";
import Login from "components/login/Login";
import Signup from "components/signup/Signup";

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const AppRoute = ({ children }: { children?: React.ReactElement }) => {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      {children}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/order" element={<Order />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default AppRoute;
