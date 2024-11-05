import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getCsrfToken } from "../util/formUtil";

const HeaderNav = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const csrfToken = getCsrfToken();
    if (!csrfToken) return;

    const fetchCurrentUser = async () => {
      const url = "/check_current_user";
      const response = await fetch(url, {
        headers: {
          "X-CSRF-Token": csrfToken,
          "Content-Type": "application/json",
        },
      });

      const responseData = await response.json();
      setCurrentUser(responseData.current_user);
    };

    fetchCurrentUser();
  }, [location.pathname]);

  const logout = async (e) => {
    e.preventDefault();

    const csrfToken = getCsrfToken();
    if (!csrfToken) return null;
    const url = "/session";
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
      },
    });

    const responseData = await response.json();

    navigate("/login");
  };

  return (
    <header className="flex border-b-2 my-2 p-2 justify-between">
      <div className="border-2 gap-4 flex">
        <Link to="/">Home</Link>
        <Link to="/order">Order</Link>
      </div>
      <div className="border-2 gap-4 flex">
        {!currentUser ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        ) : (
          <button onClick={logout}>Logout</button>
        )}
      </div>
    </header>
  );
};

export default HeaderNav;
