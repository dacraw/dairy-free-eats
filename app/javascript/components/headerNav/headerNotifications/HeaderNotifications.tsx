import { faBell, faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import {
  CurrentUserQuery,
  useCurrentUserNotificationReceivedSubscription,
  useFetchCurrentUserNotificationsQuery,
} from "graphql/types";
import { gql } from "@apollo/client";

export const FETCH_CURRENT_USER_NOTIFICATIONS = gql`
  query FetchCurrentUserNotifications {
    currentUserNotifications {
      id
      message
      path
    }
  }
`;

const NotificationsList = () => {
  const { data, loading } = useFetchCurrentUserNotificationsQuery();

  return (
    <div className="relative text-left">
      <div className="absolute rounded h-96 overflow-auto bg-gray-700 p-4 md:w-[300px] right-0 top-2">
        <h3 className="font-bold text-center border-b-2 mb-2 pb-2">
          NOTIFICATIONS
        </h3>
        <div>
          {data?.currentUserNotifications?.map((notification) => (
            <p key={notification.id} className="border-b-2 mb-2 pb-2">
              {notification.message}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

const CURRENT_USER_NOTIFICATION_RECEIVED = gql`
  subscription CurrentUserNotificationReceived {
    currentUserNotificationReceived {
      notification {
        id
        message
        userId
        path
      }
    }
  }
`;

const NotificationPopup = ({
  notificationMessage,
}: {
  notificationMessage: string;
}) => {
  return (
    <div className="fixed right-0 top-1/2 transform -translate-y-1/2 p-2 rounded bg-gray-700">
      <p>{notificationMessage}</p>
    </div>
  );
};

const HeaderNotifications = ({
  currentUser,
}: {
  currentUser: CurrentUserQuery["currentUser"];
}) => {
  const [openList, toggleOpenList] = useState(false);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [showRedDot, setShowRedDot] = useState(false);
  const { data } = useCurrentUserNotificationReceivedSubscription({
    onData: ({ data, client }) => {
      const newNotification =
        data.data?.currentUserNotificationReceived?.notification;

      // do nothing if data is null, i.e. first render
      if (!newNotification) return;

      // add the new notification to the existing query if it exists
      // otherwise, the notifications will be up to date when the user clicks the notifications icon
      const readQuery = client.readQuery({
        query: FETCH_CURRENT_USER_NOTIFICATIONS,
      });

      if (readQuery) {
        client.cache.modify({
          fields: {
            currentUserNotifications: (
              existingRefs,
              { toReference, readField }
            ) => {
              const newReference = toReference(newNotification, true);

              return [
                newReference,
                ...existingRefs.filter((ref: { __ref: string }) => {
                  return readField("id", newReference) !== readField("id", ref);
                }),
              ];
            },
          },
        });
      }
    },
  });

  const notificationListContainer = useRef<HTMLDivElement>(null);
  const toggleNotificationListIcon = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (data?.currentUserNotificationReceived && !openList) {
      setShowNotificationPopup(true);

      if (!openList) {
        setShowRedDot(true);
      }

      const timeoutId = setTimeout(() => {
        setShowNotificationPopup(false);
      }, 3000);

      return () => clearTimeout(timeoutId);
    }
  }, [data]);

  const hideNotificationList = (e: MouseEvent) => {
    if (
      notificationListContainer.current &&
      toggleNotificationListIcon.current
    ) {
      if (
        !notificationListContainer.current.contains(e.target as HTMLElement) &&
        !toggleNotificationListIcon.current.contains(e.target as HTMLElement)
      ) {
        toggleOpenList(false);
      }
    }
  };

  useEffect(() => {
    document.addEventListener("click", hideNotificationList);

    return () => document.removeEventListener("click", hideNotificationList);
  }, []);

  return (
    <div className="relative">
      <FontAwesomeIcon
        onClick={() => {
          if (!openList) {
            setShowRedDot(false);
          }
          toggleOpenList(!openList);
        }}
        ref={toggleNotificationListIcon}
        className={`cursor-pointer hover:text-blue-200 text-xl`}
        icon={faBell}
      />

      {showRedDot && (
        <FontAwesomeIcon
          icon={faCircle}
          className="text-red-700 text-sm absolute left-[10px] -top-[5px]"
        />
      )}

      {showNotificationPopup && (
        <NotificationPopup
          notificationMessage={
            data?.currentUserNotificationReceived?.notification?.message || ""
          }
        />
      )}

      <div ref={notificationListContainer}>
        {openList && <NotificationsList />}
      </div>
    </div>
  );
};
export default HeaderNotifications;
