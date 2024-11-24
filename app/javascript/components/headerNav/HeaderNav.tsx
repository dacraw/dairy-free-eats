import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { gql } from "@apollo/client";
import { CurrentUserQuery, useCurrentUserLazyQuery } from "graphql/types";
import { useAdminLogin, useLogout } from "hooks/auth";
import HeaderNotifications from "components/headerNav/headerNotifications/HeaderNotifications";
import client from "apolloClient";

type NavProps = {
  currentUser: CurrentUserQuery["currentUser"];
  logout: () => void;
  loggingOut: boolean;
  demoAdminLogin: () => Promise<void>;
};

const DesktopNav: React.FC<NavProps> = ({
  currentUser,
  demoAdminLogin,
  logout,
  loggingOut,
}) => {
  return (
    <nav className="hidden justify-between md:flex mx-4 ">
      <div className="gap-4 flex">
        <NavLink
          className={({ isActive }) =>
            `${
              isActive ? "blue-button" : ""
            } hover:bg-blue-700  hover:text-gray-100 py-2 px-4 transition-colors rounded font-bold`
          }
          to="/"
        >
          HOME
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `${
              isActive ? "blue-button" : ""
            } hover:bg-blue-700  hover:text-gray-100 py-2 px-4 transition-colors rounded font-bold`
          }
          to="/order"
        >
          ORDER
        </NavLink>
        {currentUser?.admin && (
          <NavLink
            className={({ isActive }) =>
              `${
                isActive ? "blue-button" : ""
              } hover:bg-blue-700  hover:text-gray-100 py-2 px-4 transition-colors rounded font-bold`
            }
            to="/admin/dashboard"
          >
            ADMIN DASHBOARD
          </NavLink>
        )}
      </div>
      <div className="gap-4 flex items-center ">
        {!currentUser ? (
          <>
            <button
              onClick={async () => demoAdminLogin()}
              className="hover:bg-green-700 rounded hover:text-gray-100 py-2 px-4 transition-colors "
            >
              Admin Demo
            </button>
            <NavLink
              className={({ isActive }) =>
                `${
                  isActive ? "green-button" : ""
                } hover:bg-green-700 rounded hover:text-gray-100 py-2 px-4 transition-colors`
              }
              to="/login"
            >
              Login
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `${
                  isActive ? "green-button" : ""
                } hover:bg-green-700 rounded hover:text-gray-100 py-2 px-4 transition-colors`
              }
              to="/signup"
            >
              Signup
            </NavLink>
          </>
        ) : (
          <>
            <p>
              {loggingOut ? (
                <>Logging Out</>
              ) : (
                <>
                  Logged in as:{" "}
                  <strong className="font-bold">{currentUser?.email}</strong>
                </>
              )}
            </p>

            <button
              className="hover:bg-red-700 hover:text-gray-100 py-2 px-4 transition-colors rounded "
              onClick={() => logout()}
            >
              Logout
            </button>
            <HeaderNotifications />
          </>
        )}
      </div>
    </nav>
  );
};

const ResponsiveNav: React.FC<NavProps> = ({
  currentUser,
  demoAdminLogin,
  logout,
  loggingOut,
}) => {
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
        <NavLink
          className="rounded py-2 px-4 bg-blue-700 text-gray-100 font-bold"
          to="/order"
        >
          Order Now
        </NavLink>

        <div className="text-right flex gap-x-4 items-center">
          {currentUser && <HeaderNotifications />}
          <div>
            <FontAwesomeIcon
              ref={hamburgerRef}
              icon={faBars}
              size="2xl"
              onClick={() => {
                toggleShowMenu(!showMenu);
              }}
            />
            <div className="relative z-10" ref={menuRef}>
              <div
                className={`absolute overflow-hidden bg-gray-600 rounded shadow w-64 right-0 top-2 text-center transition-all duration-500 ease-in-out ${
                  showMenu ? "max-h-60" : "max-h-0"
                }`}
              >
                <NavLink
                  className={({ isActive }) =>
                    `${isActive ? "blue-button" : ""} block py-1`
                  }
                  to="/"
                >
                  Home
                </NavLink>
                <NavLink
                  className={({ isActive }) =>
                    `${isActive ? "blue-button" : ""} block py-1`
                  }
                  to="/order"
                >
                  Order
                </NavLink>
                {currentUser?.admin && (
                  <NavLink
                    className={({ isActive }) =>
                      `${isActive ? "blue-button" : ""} block py-1`
                    }
                    to="/admin/dashboard"
                  >
                    Admin Dashboard
                  </NavLink>
                )}
                {currentUser ? (
                  <>
                    <button className="mb-4" onClick={() => logout()}>
                      Logout
                    </button>
                    <p>
                      {loggingOut ? (
                        <>Logging Out</>
                      ) : (
                        <>
                          Logged in as:{" "}
                          <strong className="font-bold">
                            {currentUser?.email}
                          </strong>
                        </>
                      )}
                    </p>
                  </>
                ) : (
                  <>
                    <button
                      onClick={async () => demoAdminLogin()}
                      className=" rounded hover:text-gray-100 py-2 px-4 transition-colors "
                    >
                      Admin Demo
                    </button>
                    <NavLink
                      className={({ isActive }) =>
                        `${isActive ? "green-button" : ""} block py-1`
                      }
                      to="/login"
                    >
                      Login
                    </NavLink>
                    <NavLink
                      className={({ isActive }) =>
                        `${isActive ? "green-button" : ""} block py-1`
                      }
                      to="/signup"
                    >
                      Signup
                    </NavLink>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export const CURRENT_USER = gql`
  query CurrentUser {
    currentUser {
      id
      email
      admin
    }
  }
`;

const HeaderNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [getCurrentUser, { loading, data, error }] = useCurrentUserLazyQuery({
    fetchPolicy: "network-only",
  });

  const [
    logout,
    { loading: loggingOut, data: logoutData, error: logoutError },
  ] = useLogout();

  const handleLogout = () => {
    // Ideally, evicting the current user would clear out any fields related to it
    // This is a TODO
    client.cache.evict({ fieldName: "currentUserNotifications" });
    logout();
  };

  const [
    loginDemoAdmin,
    { loading: loginDemoAdminLoading, data: loginDemoAdminData },
  ] = useAdminLogin();

  useEffect(() => {
    getCurrentUser();
  }, [location.pathname]);

  return (
    <header className="border-b-2 mb-4 p-2 select-none">
      {error && <span>{error.message}</span>}
      <DesktopNav
        currentUser={data?.currentUser}
        logout={handleLogout}
        demoAdminLogin={loginDemoAdmin}
        loggingOut={loggingOut}
      />
      <ResponsiveNav
        currentUser={data?.currentUser}
        demoAdminLogin={loginDemoAdmin}
        logout={handleLogout}
        loggingOut={loggingOut}
      />
    </header>
  );
};

export default HeaderNav;
