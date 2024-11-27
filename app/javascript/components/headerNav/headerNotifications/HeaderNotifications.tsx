import { faBell, faCircle, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import {
  CurrentUserQuery,
  useCurrentUserNotificationReceivedSubscription,
  useFetchCurrentUserNotificationsQuery,
} from "graphql/types";
import { gql } from "@apollo/client";

export const FETCH_CURRENT_USER_NOTIFICATIONS = gql`
  query FetchCurrentUserNotifications($after: String, $first: Int) {
    currentUserNotifications(after: $after, first: $first) {
      edges {
        node {
          id
          message
          path
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const NotificationsList = () => {
  const { data, fetchMore, refetch, loading } =
    useFetchCurrentUserNotificationsQuery({
      variables: { first: 5 },
    });

  return (
    <div className="relative text-left z-50">
      <div
        id="header-notifications-list"
        className="absolute rounded h-96 w-72 gray-background p-4 md:w-[300px] right-0 top-2  shadow-lg z-50"
      >
        <h3 className="font-bold text-center mb-2">NOTIFICATIONS</h3>
        <div>
          {data?.currentUserNotifications?.edges?.map((node) => (
            <p
              key={node?.node?.id}
              className="rounded mb-2 p-2 blue-background"
            >
              {node?.node?.message}
            </p>
          ))}
        </div>
        {data?.currentUserNotifications?.pageInfo?.hasNextPage && (
          <div className="text-center">
            <button
              id="load-more-notifications"
              className="green-button z-50"
              onClick={() =>
                fetchMore({
                  variables: {
                    after: data?.currentUserNotifications?.pageInfo?.endCursor,
                  },
                })
              }
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export const CURRENT_USER_NOTIFICATION_RECEIVED = gql`
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
    <div
      id="notification-popup"
      className="fixed right-0 top-1/2 transform -translate-y-1/2 p-2 rounded gray-background text-center"
    >
      <p>{notificationMessage}</p>
    </div>
  );
};

const HeaderNotifications = () => {
  const [openList, toggleOpenList] = useState(false);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [showRedDot, setShowRedDot] = useState(false);
  const { data, loading } = useCurrentUserNotificationReceivedSubscription({
    fetchPolicy: "no-cache",
    onData: ({ data, client }) => {
      const newNotification =
        data.data?.currentUserNotificationReceived?.notification;

      // do nothing if data is null, i.e. first render
      if (!newNotification) return;

      client.cache.modify({
        fields: {
          currentUserNotifications: (
            existingRefs,
            { toReference, readField }
          ) => {
            const newReference = toReference(newNotification, true);
            const newEdges = [
              {
                __typename: "NotificationEdge",
                node: newReference,
              },
              ...existingRefs?.edges.filter(
                ({ node }: { node: { __ref: string } }) => {
                  return (
                    readField("id", newReference) !== readField("id", node)
                  );
                }
              ),
            ];

            const newPageInfo = {
              ...existingRefs?.pageInfo,
              endCursor: readField("cursor", newEdges[newEdges.length - 1]),
            };

            return {
              __typename: "NotificationConnection",
              edges: newEdges,
              pageInfo: newPageInfo,
            };
          },
        },
      });
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
    <div className="relative z-50">
      {loading ? (
        <div>
          <FontAwesomeIcon icon={faSpinner} spin />
        </div>
      ) : (
        <div className="flex items-center">
          <FontAwesomeIcon
            id="current-notifications-bell"
            data-testid="current-notifications-bell"
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
              id="new-notifications-dot"
              data-testid="new-notifications-dot"
              icon={faCircle}
              className="text-red-700 text-sm absolute left-[10px] -top-[5px]"
            />
          )}

          {showNotificationPopup && (
            <NotificationPopup
              notificationMessage={
                data?.currentUserNotificationReceived?.notification?.message ||
                ""
              }
            />
          )}

          <div ref={notificationListContainer}>
            {openList && <NotificationsList />}
          </div>
        </div>
      )}
    </div>
  );
};
export default HeaderNotifications;
