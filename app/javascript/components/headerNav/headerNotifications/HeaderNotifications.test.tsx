import React from "react";
import {
  render,
  screen,
  waitFor,
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

// describe("<HeaderNotifications />", () => {
//   it("renders without errors", async () => {
//     const mocks: MockedResponse<CurrentUserNotificationReceivedSubscription>[] =
//       [
//         {
//           request: {
//             query: CURRENT_USER_NOTIFICATION_RECEIVED,
//           },
//           result: {
//             data: {
//               currentUserNotificationReceived: null,
//             },
//           },
//         },
//       ];

//     render(
//       <MockedProvider mocks={mocks} cache={cache}>
//         <HeaderNotifications />
//       </MockedProvider>
//     );

//     expect(
//       await screen.findByTestId("current-notifications-bell")
//     ).toBeInTheDocument();
//   });

//   it("shows the red dot when a new notification is received", async () => {
//     const mocks: MockedResponse<CurrentUserNotificationReceivedSubscription>[] =
//       [
//         {
//           request: {
//             query: CURRENT_USER_NOTIFICATION_RECEIVED,
//           },
//           result: {
//             data: {
//               currentUserNotificationReceived: {
//                 notification: {
//                   id: "1",
//                   message: "heyo",
//                   userId: 1,
//                   path: null,
//                 },
//               },
//             },
//           },
//         },
//       ];

//     render(
//       <MockedProvider mocks={mocks} cache={cache}>
//         <HeaderNotifications />
//       </MockedProvider>
//     );

//     expect(
//       await screen.findByTestId("new-notifications-dot")
//     ).toBeInTheDocument();
//   });

//   it("flashes the new notification on the screen", async () => {
//     const notificationMessage = "heyo";
//     const mocks: MockedResponse<CurrentUserNotificationReceivedSubscription>[] =
//       [
//         {
//           request: {
//             query: CURRENT_USER_NOTIFICATION_RECEIVED,
//           },
//           result: {
//             data: {
//               currentUserNotificationReceived: {
//                 notification: {
//                   id: "1",
//                   message: notificationMessage,
//                   userId: 1,
//                   path: null,
//                 },
//               },
//             },
//           },
//         },
//       ];

//     render(
//       <MockedProvider mocks={mocks} cache={cache}>
//         <HeaderNotifications />
//       </MockedProvider>
//     );

//     expect(await screen.findByText(notificationMessage)).toBeInTheDocument();

//     await waitForElementToBeRemoved(
//       () => screen.getByText(notificationMessage),
//       { timeout: 6000 }
//     );
//   });

//   it("shows the notification list when the bell is clicked", async () => {
//     const notificationMessage = "this is a notification";
//     const mocks: MockedResponse<
//       | CurrentUserNotificationReceivedSubscription
//       | FetchCurrentUserNotificationsQuery
//     >[] = [
//       {
//         request: {
//           query: CURRENT_USER_NOTIFICATION_RECEIVED,
//         },
//         result: {
//           data: {
//             currentUserNotificationReceived: {
//               notification: {
//                 id: "1",
//                 message: notificationMessage,
//                 userId: 1,
//                 path: null,
//               },
//             },
//           },
//         },
//       },
//       {
//         request: {
//           query: FETCH_CURRENT_USER_NOTIFICATIONS,
//           variables: {
//             first: 5,
//           },
//         },
//         result: {
//           data: {
//             currentUserNotifications: {
//               edges: [
//                 {
//                   node: {
//                     id: "1",
//                     message: "heyo",
//                     path: null,
//                   },
//                 },
//               ],
//               pageInfo: {
//                 hasNextPage: false,
//                 endCursor: "MQ",
//               },
//             },
//           },
//         },
//       },
//     ];

//     render(
//       <MockedProvider mocks={mocks} cache={cache}>
//         <HeaderNotifications />
//       </MockedProvider>
//     );

//     const notificationsBell = await screen.findByTestId(
//       "current-notifications-bell"
//     );

//     expect(notificationsBell).toBeInTheDocument();

//     await userEvent.click(notificationsBell);

//     expect(screen.getByText(notificationMessage)).toBeInTheDocument();
//   });
// });

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

    expect(await screen.findByText("NOTIFICATIONS")).toBeInTheDocument();
  });
});
