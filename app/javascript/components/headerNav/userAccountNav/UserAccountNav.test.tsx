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
          <UserAccountNav currentUserEmail={currentUserEmail} />
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
          <UserAccountNav currentUserEmail={null} />
        </MemoryRouter>
      );

      expect(screen.getByRole("link", { name: /Login/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /Signup/i })).toBeInTheDocument();
    });
  });
});
