import Home from "components/Home";
import Login from "components/Login";
import Order from "components/Order";
import Signup from "components/signup/Signup";

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const AppRoute = ({ children }: { children: React.ReactElement }) => {
  return (
    <Router>
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
