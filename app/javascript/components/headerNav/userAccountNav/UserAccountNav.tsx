import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import client from "apolloClient";
import { useLogout } from "hooks/auth";
import React from "react";
import { Link } from "react-router-dom";

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
          className="
            py-2 px-4 blue-button transition-colors rounded font-bold
            "
          onClick={handleLogout}
        >
          Logout
        </button>
      )}
    </div>
  );
};

const UserAccountNav = () => {
  return (
    <div
      className="
        grid justify-center 
        md:w-52
    "
    >
      <LogoutButton />
    </div>
  );
};

export default UserAccountNav;
