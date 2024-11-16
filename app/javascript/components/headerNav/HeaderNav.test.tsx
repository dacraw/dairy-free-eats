import React from "react";
import { screen, render, waitFor, queryByRole } from "@testing-library/react";
import { BrowserRouter, MemoryRouter, Route, Routes } from "react-router-dom";
import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import HeaderNav, { CURRENT_USER } from "components/headerNav/HeaderNav";
import { CurrentUserQuery } from "graphql/types";
import userEvent from "@testing-library/user-event";
import Login from "components/login/Login";
import Home from "components/Home";

// Need to rewrite with mocked fetch for logout

// describe("<HeaderNav />", () => {
//   let currentUserPresentMocks: MockedResponse<CurrentUserQuery>[];

//   describe("when there is a current user", () => {
//     beforeEach(() => {
//       currentUserPresentMocks = [
//         {
//           request: { query: CURRENT_USER },
//           result: {
//             data: {
//               currentUser: {
//                 id: "1",
//                 email: "test@demo.com",
//                 admin: false,
//               },
//             },
//           },
//         },
//         {
//           request: { query: CURRENT_USER },
//           result: {
//             data: {
//               currentUser: null,
//             },
//           },
//         },
//       ];
//     });

//     it("displays the current user's email", async () => {
//       render(
//         <MockedProvider mocks={currentUserPresentMocks} addTypename={false}>
//           <BrowserRouter
//             future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
//           >
//             <HeaderNav />
//           </BrowserRouter>
//         </MockedProvider>
//       );

//       const target = await screen.findAllByText("test@demo.com");

//       expect(target[0]).toBeInTheDocument();
//     });

//     it("does not display the admin dashboard link for non admin", async () => {
//       render(
//         <MockedProvider mocks={currentUserPresentMocks} addTypename={false}>
//           <BrowserRouter
//             future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
//           >
//             <HeaderNav />
//           </BrowserRouter>
//         </MockedProvider>
//       );

//       const target = await screen.findAllByText("test@demo.com");

//       expect(target[0]).toBeInTheDocument();

//       expect(
//         screen.queryAllByRole("link", { name: /ADMIN DASHBOARD/i }).length
//       ).toEqual(0);
//     });

//     it("says 'Logging Out' while logging out", async () => {
//       currentUserPresentMocks[1].delay = Infinity;

//       render(
//         <MockedProvider mocks={currentUserPresentMocks} addTypename={false}>
//           <BrowserRouter
//             future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
//           >
//             <HeaderNav />
//           </BrowserRouter>
//         </MockedProvider>
//       );

//       const target = await screen.findAllByText("test@demo.com");
//       expect(target[0]).toBeInTheDocument();

//       const logoutButton = await screen.findAllByRole("button", {
//         name: "Logout",
//       });
//       expect(logoutButton[0]).toBeInTheDocument();

//       userEvent.click(logoutButton[0]);
//       expect(await screen.findAllByText("Logging Out")).toBeTruthy();
//     });

//     it("clicking logout invokes the session delete mutation and redirects to login page", async () => {
//       render(
//         <MockedProvider mocks={currentUserPresentMocks} addTypename={false}>
//           <MemoryRouter
//             future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
//           >
//             <HeaderNav />
//             <Routes>
//               <Route path="/" element={<Home />} />
//               <Route path="/login" element={<Login />} />
//             </Routes>
//           </MemoryRouter>
//         </MockedProvider>
//       );

//       const target = await screen.findAllByText("test@demo.com");
//       expect(target[0]).toBeInTheDocument();

//       const logoutButton = await screen.findAllByRole("button", {
//         name: "Logout",
//       });
//       expect(logoutButton[0]).toBeInTheDocument();

//       await userEvent.click(logoutButton[0]);

//       await waitFor(() => {
//         const target2 = screen.queryAllByText("test@demo.com");
//         expect(target2.length).toEqual(0);

//         expect(screen.getByLabelText("Email")).toBeInTheDocument();
//         expect(screen.getByLabelText("Password")).toBeInTheDocument();
//       });
//     });

//     describe("when the current user is an admin", () => {
//       it("displays the admin dashboard link", async () => {
//         currentUserPresentMocks = [
//           {
//             request: { query: CURRENT_USER },
//             result: {
//               data: {
//                 currentUser: {
//                   id: "1",
//                   email: "admin@demo.com",
//                   admin: true,
//                 },
//               },
//             },
//           },
//         ];

//         render(
//           <MockedProvider mocks={currentUserPresentMocks} addTypename={false}>
//             <BrowserRouter
//               future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
//             >
//               <HeaderNav />
//             </BrowserRouter>
//           </MockedProvider>
//         );

//         expect(
//           (await screen.findAllByText("admin@demo.com")).length
//         ).toBeTruthy();

//         expect(
//           screen.getAllByRole("link", { name: /ADMIN DASHBOARD/i }).length
//         ).toBeTruthy();
//       });
//     });
//   });

//   describe("when there is no current user", () => {
//     beforeEach(() => {
//       currentUserPresentMocks = [
//         {
//           request: { query: CURRENT_USER },
//           result: {
//             data: {
//               currentUser: null,
//             },
//           },
//         },
//       ];
//     });
//     it("does not show the user email", async () => {
//       render(
//         <MockedProvider mocks={currentUserPresentMocks} addTypename={false}>
//           <BrowserRouter
//             future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
//           >
//             <HeaderNav />
//           </BrowserRouter>
//         </MockedProvider>
//       );

//       expect(screen.queryAllByText("Logging Out")).toHaveLength(0);
//     });
//   });
// });
