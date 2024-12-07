import React from "react";
import { screen, render } from "@testing-library/react";
import MyOrders from "components/myOrders/MyOrders";
import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { FetchCurrentUserOrdersQuery, OrderStatus } from "graphql/types";
import { FETCH_CURRENT_USER_ORDERS } from "components/orderChatPanels/OrderChatPanels";
import { MemoryRouter } from "react-router";

const incompleteOrder = {
  id: "1",
  amountTotal: 600,
  createdAt: "2024-12-1",
  guestEmail: null,
  updatedAt: "2024-12-5",
  status: OrderStatus.Received,
  completedAt: null,
  stripeCheckoutSessionLineItems: [
    {
      imageUrl: "www.someimage.com",
      name: "Super Tasy Sando",
      quantity: 1,
      unitAmount: 147,
    },
  ],
  user: {
    id: "1",
    email: "userwithincompleteorders@somewhere.com",
  },
};

const withIncompleteOrdersMocks: MockedResponse<FetchCurrentUserOrdersQuery>[] =
  [
    {
      request: { query: FETCH_CURRENT_USER_ORDERS },
      result: {
        data: {
          currentUserOrders: [incompleteOrder],
        },
      },
    },
  ];

const completedOrder = {
  id: "1",
  amountTotal: 600,
  createdAt: "2024-12-1",
  guestEmail: null,
  updatedAt: "2024-12-5",
  status: OrderStatus.Completed,
  completedAt: "2024-12-7",
  stripeCheckoutSessionLineItems: [
    {
      imageUrl: "www.someimage.com",
      name: "Super Tasy Sando",
      quantity: 1,
      unitAmount: 147,
    },
  ],
  user: {
    id: "1",
    email: "userwithincompleteorders@somewhere.com",
  },
};

const withCompleteOrderMocks: MockedResponse<FetchCurrentUserOrdersQuery>[] = [
  {
    request: { query: FETCH_CURRENT_USER_ORDERS },
    result: {
      data: {
        currentUserOrders: [completedOrder],
      },
    },
  },
];

const withNoOrdersMocks: MockedResponse<FetchCurrentUserOrdersQuery>[] = [
  {
    request: { query: FETCH_CURRENT_USER_ORDERS },
    result: {
      data: {
        currentUserOrders: [],
      },
    },
  },
];

describe("<MyOrders />", () => {
  describe("when there are incomplete orders", () => {
    it("renders without errors", async () => {
      render(
        <MockedProvider mocks={withIncompleteOrdersMocks}>
          <MyOrders />
        </MockedProvider>
      );

      expect(await screen.findByText(/My Orders/i)).toBeInTheDocument();
      expect(screen.getByText(incompleteOrder.createdAt)).toBeInTheDocument();
      expect(
        screen.getByText(
          `1 Item - ${new Intl.NumberFormat("en-EN", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
          }).format(Number((incompleteOrder.amountTotal / 100).toFixed(2)))}`
        )
      ).toBeInTheDocument();
    });
  });

  describe("when there is a completed order", () => {
    it("renders without errors", async () => {
      render(
        <MockedProvider mocks={withCompleteOrderMocks}>
          <MyOrders />
        </MockedProvider>
      );

      expect(await screen.findByText(/My Orders/i)).toBeInTheDocument();
      expect(screen.getByText(/Completed on:/i)).toBeInTheDocument();
      expect(screen.getByText(completedOrder.completedAt)).toBeInTheDocument();
    });
  });

  describe("when the user has no orders", () => {
    it("renders without errors", async () => {
      render(
        <MockedProvider mocks={withNoOrdersMocks}>
          <MemoryRouter>
            <MyOrders />
          </MemoryRouter>
        </MockedProvider>
      );

      expect(await screen.findByText(/My Orders/i)).toBeInTheDocument();
      expect(
        screen.getByText((element) =>
          element.includes("You currently have no current or past orders!")
        )
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: /Order Page/i })
      ).toBeInTheDocument();
    });
  });
});
