import { ApolloProvider } from "@apollo/client";
import client from "apolloClient";
import CartProvider from "context/CartProvider";
import NotificationsProvider from "context/NotificationsProvider";
import React from "react";
import AppRoute from "routes";
import { ErrorBoundary } from "react-error-boundary";

const App = () => {
  return (
    <ErrorBoundary
      fallback={
        <p>
          Sorry, something went wrong. Please contact{" "}
          <a href="mailto:doug.a.crawford@gmail.com">
            doug.a.crawford@gmail.com
          </a>{" "}
          to report this issue.
        </p>
      }
    >
      <ApolloProvider client={client}>
        <CartProvider>
          <NotificationsProvider>
            <AppRoute />
          </NotificationsProvider>
        </CartProvider>
      </ApolloProvider>
    </ErrorBoundary>
  );
};

export default App;
