import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
  Operation,
} from "@apollo/client";
import Footer from "components/footer/Footer";
import HeaderNav from "components/headerNav/HeaderNav";
import React from "react";
import AppRoute from "routes";
import { getCsrfToken } from "util/formUtil";
import { createConsumer } from "@rails/actioncable";
import ActionCableLink from "graphql-ruby-client/subscriptions/ActionCableLink";

const cable = createConsumer();

const csrfToken = getCsrfToken()!;

const httpLink = new HttpLink({
  uri: "/graphql",
  credentials: "include",
  headers: { "X-CSRF-Token": csrfToken },
});

const hasSubscriptionOperation = ({
  query: { definitions },
}: Operation): boolean => {
  return definitions.some(
    ({ kind, operation }) =>
      kind === "OperationDefinition" && operation === "subscription"
  );
};

const link = ApolloLink.split(
  hasSubscriptionOperation,
  new ActionCableLink({ cable }),
  httpLink
);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

const App = () => {
  return (
    <ApolloProvider client={client}>
      <AppRoute />
    </ApolloProvider>
  );
};

export default App;
