import { faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import consumer from "channels/consumer";
import { CurrentUserQuery } from "graphql/types";

const NotificationsList = () => {
  return (
    <div className="relative">
      <div className="absolute rounded bg-gray-700 p-4 md:w-[300px] right-0 top-2">
        <h3 className="font-bold text-center">NOTIFICATIONS</h3>
        <p>hey</p>
      </div>
    </div>
  );
};

const HeaderNotifications = ({
  currentUser,
}: {
  currentUser: CurrentUserQuery["currentUser"];
}) => {
  const [openList, toggleOpenList] = useState(false);

  useEffect(() => {
    consumer.subscriptions.create("NotificationsChannel", {
      connected() {
        console.log("connected in header notifications");
        // Called when the subscription is ready for use on the server
      },

      disconnected() {
        // Called when the subscription has been terminated by the server
      },

      received(data) {
        // Called when there's incoming data on the websocket for this channel
        console.log(data);
      },
    });
  }, []);

  return (
    <div>
      <FontAwesomeIcon
        onClick={() => toggleOpenList(!openList)}
        className="cursor-pointer hover:text-blue-200"
        icon={faBell}
      />

      {openList && <NotificationsList />}
    </div>
  );
};
export default HeaderNotifications;
