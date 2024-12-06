import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import client from "apolloClient";
import {
  CurrentUserQuery,
  CurrentUserQueryResult,
  Maybe,
  User,
} from "graphql/types";
import { useAdminLogin, useLogout } from "hooks/auth";
import React from "react";
import { NavLink } from "react-router";

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

  const handleLogout = () => {
    // Ideally, evicting the current user would clear out any fields related to it
    // This is a TODO
    client.cache.evict({ fieldName: "currentUserNotifications" });
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
            py-2 px-4 blue-button transition-colors rounded font-bold
            "
      onClick={handleLogout}
    >
      Logout
    </button>
  );
};

const UserAccountNav: React.FC<{
  currentUserEmail: Maybe<User["email"]>;
}> = ({ currentUserEmail }) => {
  return (
    <div
      className="
        grid gap-2
        md:w-52
    "
    >
      {currentUserEmail ? (
        <>
          <NavLink to="my_orders">My Orders</NavLink>
          <div className="text-sm mb-2 text-center">
            <p>Logged in as:</p>
            <p className="font-bold">{currentUserEmail}</p>
          </div>
          <LogoutButton />
        </>
      ) : (
        <>
          <NavLink
            className={`
              blue-button block text-center 
              `}
            to="/login"
          >
            Login
          </NavLink>
          <NavLink
            className={`
              blue-button block text-center 
              `}
            to="/signup"
          >
            Signup
          </NavLink>
          <AdminDemoButton />
        </>
      )}
    </div>
  );
};

export default UserAccountNav;
