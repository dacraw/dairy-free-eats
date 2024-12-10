import React from "react";
import { screen, render } from "@testing-library/react";
import OrderShow from "components/orderShow/OrderShow";
import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import {
  CurrentUserQuery,
  FetchCurrentUserOrdersQuery,
  FetchCurrentUserOrdersQueryVariables,
  FetchOrderQuery,
  FetchOrderQueryVariables,
  OrderStatus,
} from "graphql/types";
import { CURRENT_USER } from "components/headerNav/HeaderNav";
import { MemoryRouter, Route, Routes } from "react-router";
import { FETCH_ORDER } from "components/admin/dashboard/order/AdminDashboardOrder";
import { formatIntegerToMoney } from "util/stringUtil";
import MyOrders from "components/myOrders/MyOrders";
import { FETCH_CURRENT_USER_ORDERS } from "components/orderChatPanels/OrderChatPanels";
import { startCase } from "lodash";

const currentUser = {
  currentUser: {
    id: "1",
    email: "currentuseremail@email.com",
    admin: false,
  },
};

const order = {
  id: "1",
  user: {
    id: "1",
    email: "someemail.com",
  },
  status: OrderStatus.Received,
  stripePaymentIntentId: "12345",
  createdAt: "2024-01-55",
  updatedAt: "2024-12-7",
  amountTotal: 2100,
  stripeCheckoutSessionLineItems: [
    {
      name: "Great item",
      quantity: 7,
      imageUrl: "image",
      unitAmount: 300,
    },
  ],
  guestEmail: null,
};

const validMocks: MockedResponse<
  CurrentUserQuery | FetchOrderQuery,
  FetchOrderQueryVariables
>[] = [
  {
    request: { query: CURRENT_USER },
    result: {
      data: currentUser,
    },
    delay: 30,
  },
  {
    request: { query: FETCH_ORDER, variables: { id: "1" } },
    result: {
      data: {
        order,
      },
    },
    delay: 30,
  },
];

const currentUserNotOrderUser = {
  currentUser: {
    id: "2",
    email: "currentuseremail@email.com",
    admin: false,
  },
};

const userNotOrderUserMocks: MockedResponse<
  CurrentUserQuery | FetchOrderQuery | FetchCurrentUserOrdersQuery,
  FetchOrderQueryVariables | FetchCurrentUserOrdersQueryVariables
>[] = [
  {
    request: { query: CURRENT_USER },
    result: {
      data: currentUserNotOrderUser,
    },
    delay: 30,
  },
  {
    request: { query: FETCH_ORDER, variables: { id: "1" } },
    result: {
      data: {
        order,
      },
    },
    delay: 30,
  },
  {
    request: {
      query: FETCH_CURRENT_USER_ORDERS,
      variables: { incomplete: false },
    },
    result: {
      data: {
        currentUserOrders: [
          {
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
          },
        ],
      },
    },
  },
];

describe("<OrderShow />", () => {
  describe("when the order exists", () => {
    describe("when the user has created the order", () => {
      it("renders without errors", async () => {
        render(
          <MockedProvider mocks={validMocks} addTypename={false}>
            <MemoryRouter initialEntries={[`/orders/${order.id}`]}>
              <Routes>
                <Route path="orders/:id" element={<OrderShow />} />
              </Routes>
            </MemoryRouter>
          </MockedProvider>
        );

        expect(await screen.findByText(/Your Order/i)).toBeInTheDocument();
        expect(
          screen.getByText(new RegExp(`Order # ${order.id}`, "i"))
        ).toBeInTheDocument();

        expect(
          screen.getByText(`${startCase(order.status)}`)
        ).toBeInTheDocument();

        const orderLineItem = order.stripeCheckoutSessionLineItems[0];
        expect(
          screen.getByText(`${orderLineItem.quantity}x`)
        ).toBeInTheDocument();
        expect(screen.getByText(orderLineItem.name)).toBeInTheDocument();
        expect(
          screen.getByText(formatIntegerToMoney(orderLineItem.unitAmount))
        ).toBeInTheDocument();
        expect(
          screen.getByText(formatIntegerToMoney(order.amountTotal))
        ).toBeInTheDocument();

        const myOrdersLink = screen.getByRole("link", {
          name: /Back to My Orders/i,
        });
        expect(myOrdersLink).toBeInTheDocument();
        expect(myOrdersLink).toHaveAttribute("href", "/my_orders");
      });
    });

    describe("when the user is not the one who created the order", () => {
      it("redirects to the My Orders page", async () => {
        render(
          <MockedProvider mocks={userNotOrderUserMocks} addTypename={false}>
            <MemoryRouter initialEntries={[`/orders/${order.id}`]}>
              <Routes>
                <Route path="/my_orders" element={<MyOrders />} />
                <Route path="orders/:id" element={<OrderShow />} />
              </Routes>
            </MemoryRouter>
          </MockedProvider>
        );

        expect(await screen.findByText(/My Orders/i)).toBeInTheDocument();
      });
    });
  });
});
