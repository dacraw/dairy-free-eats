import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getCsrfToken } from "util/formUtil";

type CurrentUser = {
  id: number;
};

type NavProps = {
  currentUser: CurrentUser | null;
  logout: () => Promise<null | undefined>;
};

const DesktopNav: React.FC<NavProps> = ({ currentUser, logout }) => {
  return (
    <div className="hidden justify-between md:flex">
      <div className="gap-4 flex">
        <Link
          className="hover:bg-blue-400 hover:text-gray-100 py-2 px-4 transition-colors rounded font-bold text-gray-700"
          to="/"
        >
          HOME
        </Link>
        <Link
          className="hover:bg-blue-400 hover:text-gray-100 py-2 px-4 transition-colors rounded font-bold text-gray-700"
          to="/order"
        >
          ORDER
        </Link>
      </div>
      <div className="gap-4 flex">
        {!currentUser ? (
          <>
            <Link
              className="hover:bg-green-400 hover:text-gray-100 py-2 px-4 transition-colors rounded text-gray-700"
              to="/login"
            >
              Login
            </Link>
            <Link
              className="hover:bg-green-400 hover:text-gray-100 py-2 px-4 transition-colors rounded text-gray-700"
              to="/signup"
            >
              Signup
            </Link>
          </>
        ) : (
          <button
            className="hover:bg-red-400 hover:text-gray-100 py-2 px-4 transition-colors rounded text-gray-700"
            onClick={logout}
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

const ResponsiveNav: React.FC<NavProps> = ({ currentUser, logout }) => {
  return (
    <div className="md:hidden">
      <Link to="/order">Order Now</Link>
    </div>
  );
};

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
        method: "POST",
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

  const logout = async () => {
    const csrfToken = getCsrfToken();
    if (!csrfToken) return null;

    await fetch("/session", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
      },
    });

    navigate("/login");
  };

  return (
    <header className="border-b-2 my-2 p-2 h-14">
      <DesktopNav currentUser={currentUser} logout={logout} />
      <ResponsiveNav currentUser={currentUser} logout={logout} />
    </header>
  );
};

export default HeaderNav;
