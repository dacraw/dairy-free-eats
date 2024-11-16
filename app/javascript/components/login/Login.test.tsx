import React from "react";
import { screen, render } from "@testing-library/react";
import Login from "components/login/Login";
import { BrowserRouter, MemoryRouter, Route, Routes } from "react-router-dom";
import { MockedProvider } from "@apollo/client/testing";
import userEvent from "@testing-library/user-event";
import Home from "components/Home";

// Need to rewrite w/ fetch login

// describe("<Login />", () => {
//   it("renders", () => {
//     render(
//       <MockedProvider>
//         <BrowserRouter
//           future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
//         >
//           <Login />
//         </BrowserRouter>
//       </MockedProvider>
//     );

//     expect(screen.getByText("Login")).toBeInTheDocument();
//   });

//   it("disables and blurs input elements while submitting", async () => {
//     render(
//       <MockedProvider>
//         <BrowserRouter
//           future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
//         >
//           <Login />
//         </BrowserRouter>
//       </MockedProvider>
//     );

//     await userEvent.type(screen.getByLabelText("Email"), "test@fakeemail.com");
//     await userEvent.type(screen.getByLabelText("Password"), "notARealPassword");
//     await userEvent.click(screen.getByRole("button", { name: /submit/i }));

//     const disabledEmail = screen.getByLabelText("Email");
//     expect(disabledEmail).toBeDisabled();
//     expect(disabledEmail).toHaveClass("blur");

//     const disabledPassword = screen.getByLabelText("Password");
//     expect(disabledPassword).toBeDisabled();
//     expect(disabledPassword).toHaveClass("blur");

//     const disabledSubmit = screen.getByRole("button", { name: /submit/i });
//     expect(disabledSubmit).toBeDisabled();
//   });

//   describe("with valid params", () => {
//     it("allows submission and redirects to the index page", async () => {
//       render(
//         <MockedProvider>
//           <MemoryRouter
//             initialEntries={["/login"]}
//             future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
//           >
//             <Routes>
//               <Route path="/login" element={<Login />} />
//               <Route path="/" element={<Home />} />
//             </Routes>
//           </MemoryRouter>
//         </MockedProvider>
//       );

//       await userEvent.type(
//         screen.getByLabelText("Email"),
//         "test@fakeemail.com"
//       );
//       await userEvent.type(
//         screen.getByLabelText("Password"),
//         "notARealPassword"
//       );
//       await userEvent.click(screen.getByRole("button", { name: /submit/i }));

//       expect(
//         await screen.findByText(
//           "Order lactose-free food that is tasty and affordable."
//         )
//       ).toBeInTheDocument();
//     });
//   });

//   describe("with invalid params", () => {
//     it("renders validation errors and does not redirect", async () => {
//       render(
//         <MockedProvider>
//           <MemoryRouter
//             initialEntries={["/login"]}
//             future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
//           >
//             <Routes>
//               <Route path="/login" element={<Login />} />
//             </Routes>
//           </MemoryRouter>
//         </MockedProvider>
//       );

//       await userEvent.type(
//         screen.getByLabelText("Email"),
//         "test@fakeemail.com"
//       );
//       await userEvent.type(screen.getByLabelText("Password"), "wrongPassword");
//       await userEvent.click(screen.getByRole("button", { name: /submit/i }));

//       expect(screen.getByText("Credentials invalid")).toBeInTheDocument();
//       expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
//       expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
//     });
//   });
// });
