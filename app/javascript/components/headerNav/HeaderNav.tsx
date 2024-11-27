import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import { faBars, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { gql } from "@apollo/client";
import { useCurrentUserLazyQuery } from "graphql/types";
import { useAdminLogin, useLogout } from "hooks/auth";
import HeaderNotifications from "components/headerNav/headerNotifications/HeaderNotifications";
import client from "apolloClient";

export const CURRENT_USER = gql`
  query CurrentUser {
    currentUser {
      id
      email
      admin
    }
  }
`;

const LogoutButton = () => {
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
  return (
    <div>
      {loggingOut ? (
        <FontAwesomeIcon
          data-testid="logging-out"
          icon={faSpinner}
          className="py-2"
        />
      ) : (
        <button
          className="hover:bg-red-700 hover:text-gray-100 py-2 px-4 transition-colors rounded font-bold"
          onClick={handleLogout}
        >
          Logout
        </button>
      )}
    </div>
  );
};

const AdminDemoButton = () => {
  const [
    loginDemoAdmin,
    { loading: loginDemoAdminLoading, data: loginDemoAdminData },
  ] = useAdminLogin();

  return (
    <div>
      {loginDemoAdminLoading ? (
        <FontAwesomeIcon
          icon={faSpinner}
          spin
          className="w-full py-2 text-xl"
        />
      ) : (
        <button
          onClick={async () => loginDemoAdmin()}
          className="hover:bg-green-700 rounded hover:text-gray-100 py-2 px-4 transition-colors font-bold "
        >
          Admin Demo
        </button>
      )}
    </div>
  );
};

const HeaderNavLinks = ({
  currentUserPresent,
  currentUserAdmin,
}: {
  currentUserPresent: boolean;
  currentUserAdmin: boolean;
}) => {
  const [showMenu, toggleShowMenu] = useState(false);
  const location = useLocation();
  useEffect(() => {
    toggleShowMenu(false);
  }, [location.pathname]);
  const hamburgerRef = useRef<SVGSVGElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

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
    <div className="">
      <FontAwesomeIcon
        ref={hamburgerRef}
        icon={faBars}
        size="xl"
        onClick={() => {
          toggleShowMenu(!showMenu);
        }}
        className="md:hidden hover:cursor-pointer hover:text-blue-200"
      />
      <div
        ref={menuRef}
        className={`${
          showMenu ? "" : "hidden"
        } rounded absolute shadow-lg border-2 border-gray-800 w-80 md:border-0 md:drop-shadow-none md:w-full md:static bg-gray-950/90 backdrop-blur right-0 top-10  md:bg-inherit md:flex md:justify-between md:items-center `}
      >
        <div className={`grid text-center md:flex md:col-start-1 md:static`}>
          <NavLink
            className={({ isActive }) =>
              `${
                isActive ? "gray-button" : ""
              } py-2 px-4 hover:gray-button-hover font-bold`
            }
            to="/"
          >
            Home
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `${
                isActive ? "gray-button" : ""
              } py-2 px-4 hover:gray-button-hover font-bold`
            }
            to="/order"
          >
            Order
          </NavLink>
          {currentUserAdmin && (
            <NavLink
              className={({ isActive }) =>
                `${
                  isActive ? "gray-button" : ""
                } py-2 px-4 hover:gray-button-hover font-bold`
              }
              to="/admin/dashboard"
            >
              Dashboard
            </NavLink>
          )}
        </div>
        <div
          className={`grid text-center md:flex md:items-center md:gap-4 md:col-start-3 md:row-start-1 md:justify-self-end ${
            showMenu ? "block" : "hidden"
          }`}
        >
          {currentUserPresent ? (
            <LogoutButton />
          ) : (
            <>
              <AdminDemoButton />
              <NavLink
                className={({ isActive }) =>
                  `${
                    isActive ? "gray-button" : ""
                  } py-2 px-4 font-bold hover:gray-button-hover`
                }
                to="/login"
              >
                Login
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  `${
                    isActive ? "gray-button" : ""
                  } py-2 px-4 font-bold hover:gray-button-hover`
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
  );
};

const HeaderNav = () => {
  const location = useLocation();

  const [getCurrentUser, { loading, data, error }] = useCurrentUserLazyQuery({
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    getCurrentUser();
  }, [location.pathname]);

  return (
    <header className="shadow-md bg-gradient-to-b from-gray-900 to-gray-950 shadow-gray-950 fixed w-full p-2 select-none h-[50px] z-50">
      {error && <span>{error.message}</span>}

      <nav className="relative flex justify-end gap-4 items-center md:static md:grid md:grid-cols-[1fr_auto_auto] md:grid-rows-1 md:justify-between">
        {data?.currentUser && (
          <div className="md:col-start-2 md:row-start-1 md:justify-self-end">
            <HeaderNotifications />
          </div>
        )}
        <HeaderNavLinks
          currentUserPresent={!!data?.currentUser}
          currentUserAdmin={Boolean(data?.currentUser?.admin)}
        />
      </nav>
    </header>
  );
};

export default HeaderNav;
