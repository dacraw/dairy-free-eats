import React from "react";
import { Link } from "react-router-dom";

const HeaderNav = () => {
  const logout = (e) => {
    e.preventDefault();
    console.log("logging out");
  };

  return (
    <header className="flex border-b-2 my-2 p-2 justify-between">
      <div className="border-2 gap-4 flex">
        <Link to="/">Home</Link>
        <Link to="/order">Order</Link>
      </div>
      <div className="border-2 gap-4 flex">
        <Link to="/login">Login</Link>
        <button onClick={logout}>Logout</button>
      </div>
    </header>
  );
};

export default HeaderNav;
