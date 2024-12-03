import React from "react";
import { screen, render } from "@testing-library/react";
import OrderItem from "components/Order/orderItem/OrderItem";
import CartProvider, { CartContext } from "context/CartProvider";
import NotificationsProvider from "context/NotificationsProvider";
import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { CurrentUserQuery } from "graphql/types";
import { CURRENT_USER } from "components/headerNav/HeaderNav";
import MockCartProvider, { mockAddToCart } from "mockUtil/MockCartProvider";
import userEvent from "@testing-library/user-event";
import MockNotificationsProvider, {
  mockAddNotification,
} from "mockUtil/MockNotificationsProvider";

const { stripePriceId, itemName, description, unitAmount, imageUrl } = {
  stripePriceId: "price_12345",
  itemName: "Best Food Ever",
  description: "Simply going to rock your tastebuds",
  unitAmount: 300,
  imageUrl: "some_test_image_url_location.com",
};

describe("<OrderItem />", () => {
  afterEach(() => jest.resetAllMocks());

  it("renders without errors", async () => {
    render(
      <OrderItem
        stripePriceId={stripePriceId}
        name={itemName}
        description={description}
        unitAmount={unitAmount}
        imageUrl={imageUrl}
      />
    );

    expect(await screen.findByText(itemName)).toBeInTheDocument();
    expect(screen.getByText(description)).toBeInTheDocument();

    const formattedUnitAmount = new Intl.NumberFormat("en-EN", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(Number((unitAmount / 100).toFixed(2)));

    expect(screen.getByText(formattedUnitAmount)).toBeInTheDocument();
  });

  describe("when an item is added to cart", () => {
    it("invokes `addToCart`", async () => {
      render(
        <MockCartProvider>
          <OrderItem
            stripePriceId={stripePriceId}
            name={itemName}
            description={description}
            unitAmount={unitAmount}
            imageUrl={imageUrl}
          />
        </MockCartProvider>
      );

      expect(await screen.findByText(itemName)).toBeInTheDocument();
      const addToCartButton = screen.getByRole("button", {
        name: /Add To Cart/i,
      });
      expect(addToCartButton).toBeInTheDocument();

      const mockQuantity = "1";
      const quantityinput = screen.getByLabelText(/Quantity/i);
      await userEvent.type(quantityinput, mockQuantity);

      await userEvent.click(addToCartButton);

      expect(mockAddToCart).toHaveBeenCalledTimes(1);
      expect(mockAddToCart).toHaveBeenCalledWith({
        description,
        name: itemName,
        unitAmount,
        quantity: parseInt(mockQuantity),
        imageUrl,
        stripePriceId,
      });
    });

    it("invokes `addNotification`", async () => {
      render(
        <MockNotificationsProvider>
          <OrderItem
            stripePriceId={stripePriceId}
            name={itemName}
            description={description}
            unitAmount={unitAmount}
            imageUrl={imageUrl}
          />
        </MockNotificationsProvider>
      );

      expect(await screen.findByText(itemName)).toBeInTheDocument();

      const addToCartButton = screen.getByRole("button", {
        name: /Add To Cart/i,
      });
      expect(addToCartButton).toBeInTheDocument();

      const mockQuantity = "1";
      const quantityinput = screen.getByLabelText(/Quantity/i);
      await userEvent.type(quantityinput, mockQuantity);

      await userEvent.click(addToCartButton);

      const expectedNotificationMessage = `${itemName} x${mockQuantity} has been added to the cart!`;
      expect(mockAddNotification).toHaveBeenCalledTimes(1);
      expect(mockAddNotification).toHaveBeenCalledWith(
        expectedNotificationMessage
      );
    });

    it("resets the input field value", async () => {
      render(
        <MockNotificationsProvider>
          <OrderItem
            stripePriceId={stripePriceId}
            name={itemName}
            description={description}
            unitAmount={unitAmount}
            imageUrl={imageUrl}
          />
        </MockNotificationsProvider>
      );

      expect(await screen.findByText(itemName)).toBeInTheDocument();

      const addToCartButton = screen.getByRole("button", {
        name: /Add To Cart/i,
      });
      expect(addToCartButton).toBeInTheDocument();

      const mockQuantity = "1";
      const quantityinput = screen.getByLabelText(/Quantity/i);
      await userEvent.type(quantityinput, mockQuantity);

      const quantityInputWithValue = screen.getByLabelText(/Quantity/i);
      expect(quantityInputWithValue).toHaveValue(1);

      await userEvent.click(addToCartButton);

      const quantityInputAfterSubmission = screen.getByLabelText(/Quantity/i);
      expect(quantityInputAfterSubmission).toHaveValue(null);
    });
  });
});
