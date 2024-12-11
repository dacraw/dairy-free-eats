import React from "react";
import { screen, render } from "@testing-library/react";
import OrderItem from "components/Order/orderItem/OrderItem";
import MockCartProvider, { mockAddToCart } from "mockUtil/MockCartProvider";
import userEvent from "@testing-library/user-event";
import MockNotificationsProvider, {
  mockAddNotification,
} from "mockUtil/MockNotificationsProvider";
import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import {
  FetchCurrentUserOrdersQuery,
  FetchCurrentUserOrdersQueryVariables,
  OrderStatus,
} from "graphql/types";
import { FETCH_CURRENT_USER_ORDERS } from "components/orderChatPanels/OrderChatPanels";

const { stripePriceId, itemName, description, unitAmount, imageUrl } = {
  stripePriceId: "price_12345",
  itemName: "Best Food Ever",
  description: "Simply going to rock your tastebuds",
  unitAmount: 300,
  imageUrl: "some_test_image_url_location.com",
};

const noOrdersMocks: MockedResponse<
  FetchCurrentUserOrdersQuery,
  FetchCurrentUserOrdersQueryVariables
>[] = [
  {
    request: {
      query: FETCH_CURRENT_USER_ORDERS,
      variables: { incomplete: true },
    },
    result: {
      data: {
        currentUserOrders: [],
      },
    },
  },
];

const twoOrdersMocks: MockedResponse<
  FetchCurrentUserOrdersQuery,
  FetchCurrentUserOrdersQueryVariables
>[] = [
  {
    request: {
      query: FETCH_CURRENT_USER_ORDERS,
      variables: { incomplete: true },
    },
    result: {
      data: {
        currentUserOrders: [
          {
            id: "1",
            amountTotal: 600,
            createdAt: "createdat",
            guestEmail: null,
            updatedAt: "updatedat",
            status: OrderStatus.InTransit,
            completedAt: null,
            stripeCheckoutSessionLineItems: [
              {
                imageUrl: "image",
                name: "name",
                quantity: 1,
                unitAmount: 600,
              },
            ],
            user: {
              id: "1",
              email: "useremail",
            },
          },
          {
            id: "2",
            amountTotal: 600,
            createdAt: "createdat",
            guestEmail: null,
            updatedAt: "updatedat",
            status: OrderStatus.InTransit,
            completedAt: null,
            stripeCheckoutSessionLineItems: [
              {
                imageUrl: "image",
                name: "name",
                quantity: 1,
                unitAmount: 600,
              },
            ],
            user: {
              id: "1",
              email: "useremail",
            },
          },
        ],
      },
    },
  },
];

describe("<OrderItem />", () => {
  afterEach(() => jest.resetAllMocks());

  describe("when the current user has less than two orders", () => {
    it("renders without errors", async () => {
      render(
        <MockedProvider mocks={noOrdersMocks}>
          <OrderItem
            currentUserPresent={true}
            currentUserIsAdmin={false}
            stripePriceId={stripePriceId}
            name={itemName}
            description={description}
            unitAmount={unitAmount}
            imageUrl={imageUrl}
          />
        </MockedProvider>
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

    it("doesn't render the quantity input nor 'Add To Cart' button", async () => {
      render(
        <MockedProvider mocks={noOrdersMocks}>
          <OrderItem
            currentUserPresent={true}
            currentUserIsAdmin={true}
            stripePriceId={stripePriceId}
            name={itemName}
            description={description}
            unitAmount={unitAmount}
            imageUrl={imageUrl}
          />
        </MockedProvider>
      );

      expect(await screen.findByText(itemName)).toBeInTheDocument();
      expect(screen.queryByLabelText(/Quantity/)).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: /Add To Cart/i })
      ).not.toBeInTheDocument();
    });

    describe("when an item is added to cart", () => {
      it("invokes `addToCart`", async () => {
        render(
          <MockedProvider mocks={noOrdersMocks}>
            <MockCartProvider>
              <OrderItem
                currentUserPresent={true}
                currentUserIsAdmin={false}
                stripePriceId={stripePriceId}
                name={itemName}
                description={description}
                unitAmount={unitAmount}
                imageUrl={imageUrl}
              />
            </MockCartProvider>
          </MockedProvider>
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
          <MockedProvider mocks={noOrdersMocks}>
            <MockNotificationsProvider>
              <OrderItem
                currentUserPresent={true}
                currentUserIsAdmin={false}
                stripePriceId={stripePriceId}
                name={itemName}
                description={description}
                unitAmount={unitAmount}
                imageUrl={imageUrl}
              />
            </MockNotificationsProvider>
          </MockedProvider>
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
          <MockedProvider mocks={noOrdersMocks}>
            <MockNotificationsProvider>
              <OrderItem
                currentUserPresent={true}
                currentUserIsAdmin={false}
                stripePriceId={stripePriceId}
                name={itemName}
                description={description}
                unitAmount={unitAmount}
                imageUrl={imageUrl}
              />
            </MockNotificationsProvider>
          </MockedProvider>
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

  describe("when the current has has two incomplete orders", () => {
    it("does not render the 'Add to Cart' elements", async () => {
      render(
        <MockedProvider mocks={twoOrdersMocks}>
          <MockNotificationsProvider>
            <OrderItem
              currentUserPresent={true}
              currentUserIsAdmin={false}
              stripePriceId={stripePriceId}
              name={itemName}
              description={description}
              unitAmount={unitAmount}
              imageUrl={imageUrl}
            />
          </MockNotificationsProvider>
        </MockedProvider>
      );

      expect(await screen.findByText(itemName)).toBeInTheDocument();

      const addToCartButton = screen.queryByRole("button", {
        name: /Add To Cart/i,
      });
      expect(addToCartButton).not.toBeInTheDocument();

      const quantityinput = screen.queryByLabelText(/Quantity/i);
      expect(quantityinput).not.toBeInTheDocument();
    });
  });
});
