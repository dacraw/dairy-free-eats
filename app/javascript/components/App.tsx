import { ApolloProvider } from "@apollo/client";
import client from "apolloClient";
import CartProvider from "context/CartProvider";
import NotificationsProvider from "context/NotificationsProvider";
import React from "react";
import AppRoute from "routes";

const App = () => {
  return (
    <ApolloProvider client={client}>
      <CartProvider>
        <NotificationsProvider>
          <AppRoute />
        </NotificationsProvider>
      </CartProvider>
    </ApolloProvider>
  );
};

export default App;
