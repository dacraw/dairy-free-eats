import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import {
  faBars,
  faBell,
  faCartShopping,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { Link, NavLink, useLocation } from "react-router-dom";
import { gql } from "@apollo/client";
import { useCurrentUserLazyQuery } from "graphql/types";
import HeaderNotifications, {
  NotificationsList,
} from "components/headerNav/headerNotifications/HeaderNotifications";
import ShoppingCart from "components/shoppingCart/ShoppingCart";
import HeaderModal from "components/headerModal/HeaderModal";
import UserAccountNav from "components/headerNav/userAccountNav/UserAccountNav";

export const CURRENT_USER = gql`
  query CurrentUser {
    currentUser {
      id
      email
      admin
    }
  }
`;

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
    <div>
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
        ></div>
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
    <header className="shadow-md bg-gradient-to-b from-gray-900 to-gray-950 shadow-gray-950 fixed w-full p-2 select-none h-[50px] z-[100]">
      <nav className="relative gap-4 items-center my-2 mx-4 md:static grid grid-cols-[1fr_auto_auto] md:grid-rows-1 md:justify-between max-w-screen-lg md:mx-auto">
        {error && <span>{error.message}</span>}
        <Link to="/" className="md:hidden justify-self-start font-bold">
          Dairy Free Eats
        </Link>

        <div className="md:col-start-2 md:row-start-1 justify-self-end grid gap-4 grid-cols-3">
          {data?.currentUser && (
            <HeaderModal
              headerText="Notifications"
              TriggerElement={({ visible }) => (
                <HeaderNotifications visible={visible} />
              )}
            >
              <NotificationsList />
            </HeaderModal>
          )}

          {!Boolean(data?.currentUser?.admin) && (
            <HeaderModal
              headerText="Your Cart"
              TriggerElement={() => (
                <FontAwesomeIcon
                  data-testid="shopping-cart-icon"
                  icon={faCartShopping}
                />
              )}
            >
              <ShoppingCart />
            </HeaderModal>
          )}

          <HeaderModal
            basic={true}
            headerText="Account Options"
            TriggerElement={() => (
              <FontAwesomeIcon data-testid="user-account-icon" icon={faUser} />
            )}
          >
            <UserAccountNav
              currentUserEmail={data?.currentUser?.email || null}
            />
          </HeaderModal>
        </div>

        <HeaderNavLinks
          currentUserPresent={!!data?.currentUser}
          currentUserAdmin={Boolean(data?.currentUser?.admin)}
        />
      </nav>
    </header>
  );
};

export default HeaderNav;
