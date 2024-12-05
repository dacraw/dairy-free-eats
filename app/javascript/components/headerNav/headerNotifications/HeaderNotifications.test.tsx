import React from "react";
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import HeaderNotifications, {
  CURRENT_USER_NOTIFICATION_RECEIVED,
  FETCH_CURRENT_USER_NOTIFICATIONS,
  NotificationsList,
} from "components/headerNav/headerNotifications/HeaderNotifications";
import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import {
  CurrentUserNotificationReceivedSubscription,
  FetchCurrentUserNotificationsQuery,
} from "graphql/types";
import { cache } from "apolloClient";
import userEvent from "@testing-library/user-event";
import NotificationsProvider from "context/NotificationsProvider";

describe("<HeaderNotifications />", () => {
  it("renders without errors", async () => {
    const mocks: MockedResponse<CurrentUserNotificationReceivedSubscription>[] =
      [
        {
          request: {
            query: CURRENT_USER_NOTIFICATION_RECEIVED,
          },
          result: {
            data: {
              currentUserNotificationReceived: null,
            },
          },
        },
      ];
    render(
      <MockedProvider mocks={mocks} cache={cache}>
        <HeaderNotifications />
      </MockedProvider>
    );
    expect(
      await screen.findByTestId("current-notifications-bell")
    ).toBeInTheDocument();
  });
  it("shows the red dot when a new notification is received", async () => {
    const mocks: MockedResponse<CurrentUserNotificationReceivedSubscription>[] =
      [
        {
          request: {
            query: CURRENT_USER_NOTIFICATION_RECEIVED,
          },
          result: {
            data: {
              currentUserNotificationReceived: {
                notification: {
                  id: "1",
                  message: "heyo",
                  userId: 1,
                  path: null,
                },
              },
            },
          },
        },
      ];
    render(
      <MockedProvider mocks={mocks} cache={cache}>
        <HeaderNotifications />
      </MockedProvider>
    );
    expect(
      await screen.findByTestId("new-notifications-dot")
    ).toBeInTheDocument();
  });
  it("flashes the new notification on the screen", async () => {
    const notificationMessage = "heyo";
    const mocks: MockedResponse<CurrentUserNotificationReceivedSubscription>[] =
      [
        {
          request: {
            query: CURRENT_USER_NOTIFICATION_RECEIVED,
          },
          result: {
            data: {
              currentUserNotificationReceived: {
                notification: {
                  id: "1",
                  message: notificationMessage,
                  userId: 1,
                  path: null,
                },
              },
            },
          },
        },
      ];
    render(
      <MockedProvider mocks={mocks} cache={cache}>
        <NotificationsProvider>
          <HeaderNotifications />
        </NotificationsProvider>
      </MockedProvider>
    );
    expect(
      await screen.findByTestId("current-notifications-bell")
    ).toBeInTheDocument();
    expect(await screen.findByText(notificationMessage)).toBeInTheDocument();
    await waitForElementToBeRemoved(
      () => screen.getByText(notificationMessage),
      { timeout: 6000 }
    );
  }, 7000);
});

describe("<NotificationsList />", () => {
  it("renders without errors", async () => {
    const notificationMessage = "hey this is a notification";

    const mocks: MockedResponse<FetchCurrentUserNotificationsQuery>[] = [
      {
        request: {
          query: FETCH_CURRENT_USER_NOTIFICATIONS,
          variables: {
            first: 5,
          },
        },
        result: {
          data: {
            currentUserNotifications: {
              edges: [
                {
                  node: {
                    id: "1",
                    message: notificationMessage,
                    path: null,
                  },
                },
              ],
              pageInfo: {
                hasNextPage: false,
                endCursor: "Mq",
              },
            },
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={mocks}>
        <NotificationsList />
      </MockedProvider>
    );

    expect(await screen.findByText(notificationMessage)).toBeInTheDocument();
  });
});
