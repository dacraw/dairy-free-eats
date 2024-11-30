import { ApolloProvider } from "@apollo/client";
import client from "apolloClient";
import CartProvider from "context/CartProvider";
import React from "react";
import AppRoute from "routes";

const App = () => {
  return (
    <ApolloProvider client={client}>
      <CartProvider>
        <AppRoute />
      </CartProvider>
    </ApolloProvider>
  );
};

export default App;
