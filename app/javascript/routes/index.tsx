import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../components/Home";
import Order from "../components/Order";
import Signup from "../components/Signup";
import HeaderNav from "../components/HeaderNav";
import Login from "../components/Login";

const AppRoute = () => {
  return (
    <Router>
      <HeaderNav />
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
