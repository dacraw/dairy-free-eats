import React from "react";
import { screen, render } from "@testing-library/react";
import UserAccountNav from "components/headerNav/userAccountNav/UserAccountNav";
import { MemoryRouter } from "react-router";

describe("<UserAccountNav />", () => {
  describe("with a current user email", () => {
    const currentUserEmail = "testemail@test.com";

    it("renders without errors", () => {
      render(
        <MemoryRouter>
          <UserAccountNav
            currentUserEmail={currentUserEmail}
            currentUserAdmin={false}
          />
        </MemoryRouter>
      );

      expect(screen.getByText(currentUserEmail)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /Logout/i })
      ).toBeInTheDocument();
    });
  });

  describe("without a current user email", () => {
    it("renders without errors", () => {
      render(
        <MemoryRouter>
          <UserAccountNav currentUserEmail={null} currentUserAdmin={false} />
        </MemoryRouter>
      );

      expect(screen.getByRole("link", { name: /Login/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /Signup/i })).toBeInTheDocument();
    });
  });

  describe("when the current user is an admin", () => {
    it("does not render the `My Orders` link", () => {
      render(
        <MemoryRouter>
          <UserAccountNav
            currentUserEmail="someadmin@test.com"
            currentUserAdmin={true}
          />
        </MemoryRouter>
      );

      expect(screen.getByText(/Logged in as:/i)).toBeInTheDocument();

      expect(
        screen.queryByRole("link", { name: /MyOrders/i })
      ).not.toBeInTheDocument();
    });
  });
});
