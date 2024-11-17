import React from "react";
import { screen, render, waitFor } from "@testing-library/react";
import ConfirmButton from "components/confirmButton/ConfirmButton";
import userEvent from "@testing-library/user-event";

describe("<ConfirmButton />", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("renders action and button text in the components", () => {
    const actionText = "Complete this test on the first try";
    const buttonText = "We Have Liftoff";

    render(
      <ConfirmButton
        action={jest.fn()}
        actionText={actionText}
        buttonText={buttonText}
      />
    );

    expect(screen.getByText(actionText)).toBeInTheDocument();
    expect(screen.getByText(buttonText)).toBeInTheDocument();
  });

  describe("when a button classname is provided", () => {
    it("applies it to the button", () => {
      const buttonClassName = "super-amazing-tailwind-style";
      const buttonText = "We Have Liftoff";

      render(
        <ConfirmButton
          action={jest.fn()}
          actionText="Complete this test on the first try"
          buttonClassName={buttonClassName}
          buttonText={buttonText}
        />
      );

      expect(screen.getByText(buttonText)).toHaveClass(buttonClassName);
    });
  });

  it("hides the modal by default", () => {
    render(
      <ConfirmButton
        action={jest.fn()}
        actionText="Complete this test on the first try"
        buttonText="We Have Liftoff"
      />
    );

    expect(screen.getByTestId("confirm-button-modal")).toHaveClass("hidden");
  });

  it("shows the modal when the button is clicked", async () => {
    const buttonText = "We Have Liftoff";

    render(
      <ConfirmButton
        action={jest.fn()}
        actionText="Complete this test on the first try"
        buttonText={buttonText}
      />
    );

    userEvent.click(screen.getByText(buttonText));

    await waitFor(() => {
      expect(screen.getByTestId("confirm-button-modal")).toHaveClass("fixed");
    });
  });

  describe("when the 'Confirm' button is clicked", () => {
    it("calls the action", async () => {
      const action = jest.fn();

      render(
        <ConfirmButton
          action={action}
          actionText="Complete this test on the first try"
          buttonText="We Have Liftoff"
        />
      );

      userEvent.click(screen.getByText("Confirm"));

      await waitFor(() => {
        expect(screen.getByTestId("confirm-button-modal")).toHaveClass(
          "hidden"
        );
        expect(action).toHaveBeenCalled();
      });
    });
  });

  describe("when the 'Cancel' button is clicked", () => {
    it("closes the modal", async () => {
      render(
        <ConfirmButton
          action={jest.fn()}
          actionText="Complete this test on the first try"
          buttonText="We Have Liftoff"
        />
      );

      userEvent.click(screen.getByText("Cancel"));

      await waitFor(() => {
        expect(screen.getByTestId("confirm-button-modal")).toHaveClass(
          "hidden"
        );
      });
    });

    it("does not call the action", async () => {
      const action = jest.fn();

      render(
        <ConfirmButton
          action={action}
          actionText="Complete this test on the first try"
          buttonText="We Have Liftoff"
        />
      );

      userEvent.click(screen.getByText("Cancel"));

      await waitFor(() => {
        expect(action).not.toHaveBeenCalled();
      });
    });
  });
});
