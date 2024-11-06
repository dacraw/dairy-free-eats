import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import {} from "@fortawesome/free-regular-svg-icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getCsrfToken } from "util/formUtil";
import { gql, useLazyQuery } from "@apollo/client";

type CurrentUser = {
  id: number;
};

type NavProps = {
  currentUser: CurrentUser | null;
  logout: () => Promise<null | undefined>;
};

const DesktopNav: React.FC<NavProps> = ({ currentUser, logout }) => {
  return (
    <nav className="hidden justify-between md:flex">
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
    </nav>
  );
};

const ResponsiveNav: React.FC<NavProps> = ({ currentUser, logout }) => {
  const [showMenu, toggleShowMenu] = useState(false);
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const hamburgerRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    toggleShowMenu(false);
  }, [location.pathname]);

  useEffect(() => {
    const checkCloseMenu = (e: MouseEvent) => {
      // allow hamburger icon to toggle menu status if it is clicked
      if (
        hamburgerRef.current &&
        hamburgerRef.current.contains(e.target as Node)
      ) {
        return;
      }

      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        toggleShowMenu(false);
      }
    };
    document.addEventListener("mousedown", checkCloseMenu);

    return () => document.removeEventListener("mousedown", checkCloseMenu);
  }, []);

  return (
    <nav>
      <div className="flex justify-between items-center md:hidden">
        <Link
          className="rounded py-2 px-4 bg-blue-400 text-gray-100 font-bold"
          to="/order"
        >
          Order Now
        </Link>

        <div className="text-right">
          <FontAwesomeIcon
            ref={hamburgerRef}
            icon={faBars}
            size="2xl"
            onClick={() => {
              toggleShowMenu(!showMenu);
            }}
          />
          <div className="relative w-28 z-10" ref={menuRef}>
            <div
              className={`absolute overflow-hidden bg-white shadow w-full text-center transition-all duration-500 ease-in-out ${
                showMenu ? "max-h-60" : "max-h-0"
              }`}
            >
              <Link className="block py-1" to="/">
                Home
              </Link>
              <Link className="block py-1" to="/order">
                Order
              </Link>
              {currentUser ? (
                <button onClick={logout}>Logout</button>
              ) : (
                <>
                  <Link className="block py-1" to="/login">
                    Login
                  </Link>
                  <Link className="block py-1" to="/signup">
                    Signup
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

const FETCH_CURRENT_USER = gql`
  query CurrentUser {
    currentUser {
      id
      email
    }
  }
`;

const HeaderNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [getCurrentUser, { loading, data, error }] = useLazyQuery(
    FETCH_CURRENT_USER,
    { fetchPolicy: "network-only" }
  );

  useEffect(() => {
    getCurrentUser();
  }, [location.pathname]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const logout = async () => {
    const csrfToken = getCsrfToken();
    if (!csrfToken) return null;

    await fetch("/api/v1/session", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
      },
    });

    navigate("/login");
  };

  return (
    <header className="border-b-2 mb-4 p-2">
      <p onClick={() => getCurrentUser()}>
        Logged in as: {data?.currentUser?.email}{" "}
      </p>
      <DesktopNav currentUser={data?.currentUser} logout={logout} />
      <ResponsiveNav currentUser={data?.currentUser} logout={logout} />
    </header>
  );
};

export default HeaderNav;
