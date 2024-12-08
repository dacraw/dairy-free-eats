import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import client from "apolloClient";
import { FETCH_CURRENT_USER_ORDERS } from "components/orderChatPanels/OrderChatPanels";
import { Maybe, User } from "graphql/types";
import { useAdminLogin, useLogout } from "hooks/auth";
import React from "react";
import { Link } from "react-router";

const AdminDemoButton = () => {
  const [
    loginDemoAdmin,
    { loading: loginDemoAdminLoading, data: loginDemoAdminData },
  ] = useAdminLogin();

  return loginDemoAdminLoading ? (
    <FontAwesomeIcon icon={faSpinner} spin className="w-full py-2 text-xl" />
  ) : (
    <button onClick={async () => loginDemoAdmin()} className="blue-button">
      Admin Demo
    </button>
  );
};

const LogoutButton = () => {
  const [
    logout,
    { loading: loggingOut, data: logoutData, error: logoutError },
  ] = useLogout();

  const handleLogout = async () => {
    // Remove every cached object on logout
    client.cache.evict({});

    client.cache.gc();

    logout();
  };
  return loggingOut ? (
    <FontAwesomeIcon
      data-testid="logging-out"
      icon={faSpinner}
      className="py-2"
    />
  ) : (
    <button
      className="
            py-2 px-4 red-button transition-colors rounded font-bold
            "
      onClick={async () => await handleLogout()}
    >
      Logout
    </button>
  );
};

const UserAccountNav: React.FC<{
  currentUserAdmin: boolean;
  currentUserEmail: Maybe<User["email"]>;
}> = ({ currentUserAdmin, currentUserEmail }) => {
  return (
    <div
      className="
        grid gap-2
        md:w-52
    "
    >
      {currentUserEmail ? (
        <>
          {!currentUserAdmin && (
            <Link className="blue-button text-center" to="my_orders">
              My Orders
            </Link>
          )}
          <div className="text-sm mb-2 text-center">
            <p>Logged in as:</p>
            <p className="font-bold">{currentUserEmail}</p>
          </div>
          <LogoutButton />
        </>
      ) : (
        <>
          <Link
            className={`
              blue-button block text-center 
              `}
            to="/login"
          >
            Login
          </Link>
          <Link
            className={`
              blue-button block text-center 
              `}
            to="/signup"
          >
            Signup
          </Link>
          <AdminDemoButton />
        </>
      )}
    </div>
  );
};

export default UserAccountNav;
