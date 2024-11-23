import { ApolloProvider } from "@apollo/client";
import client from "apolloClient";
import React from "react";
import AppRoute from "routes";

const App = () => {
  return (
    <ApolloProvider client={client}>
      <AppRoute />
    </ApolloProvider>
  );
};

export default App;
