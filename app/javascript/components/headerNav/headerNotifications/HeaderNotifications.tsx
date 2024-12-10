import { faBell, faCircle, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  useCurrentUserNotificationReceivedSubscription,
  useFetchCurrentUserNotificationsQuery,
} from "graphql/types";
import { gql } from "@apollo/client";
import { NotificationsContext } from "context/NotificationsProvider";
import useModalStore from "stores/modalStore";
import { Link } from "react-router";

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
        {data?.currentUserNotifications?.edges?.map((node) =>
          node?.node?.path ? (
            <Link
              to={node.node.path}
              key={node?.node?.id}
              className="block rounded mb-2 p-2 blue-button"
            >
              {node?.node?.message}
            </Link>
          ) : (
            <p
              key={node?.node?.id}
              className="rounded mb-2 p-2 blue-background"
            >
              {node?.node?.message}
            </p>
          )
        )}
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

const HeaderNotifications = () => {
  const {
    modalVisibility: { notifications: visible },
  } = useModalStore();
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
    <div>
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
            className={`cursor-pointer text-xl`}
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
