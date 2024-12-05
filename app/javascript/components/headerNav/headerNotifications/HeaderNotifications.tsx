import { faBell, faCircle, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  useCurrentUserNotificationReceivedSubscription,
  useFetchCurrentUserNotificationsQuery,
} from "graphql/types";
import { gql } from "@apollo/client";
import { NotificationsContext } from "context/NotificationsProvider";

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
  const { data, fetchMore, loading } = useFetchCurrentUserNotificationsQuery({
    variables: { first: 5 },
  });

  return (
    <div className="relative text-left z-50">
      <div>
        {data?.currentUserNotifications?.edges?.map((node) => (
          <p key={node?.node?.id} className="rounded mb-2 p-2 blue-background">
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

const HeaderNotifications: React.FC<{ visible: boolean }> = ({ visible }) => {
  const { addNotification } = useContext(NotificationsContext);
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

  useEffect(() => {
    const newNotification =
      data?.currentUserNotificationReceived?.notification?.message;

    if (!newNotification) return;

    addNotification(newNotification);

    if (data?.currentUserNotificationReceived && !visible) {
      if (!visible) {
        setShowRedDot(true);
      }
    }
  }, [data]);

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
              if (!visible) {
                setShowRedDot(false);
              }
            }}
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
        </div>
      )}
    </div>
  );
};
export default HeaderNotifications;
