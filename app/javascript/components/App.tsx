import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import Footer from "components/footer/Footer";
import HeaderNav from "components/headerNav/HeaderNav";
import React from "react";
import AppRoute from "routes";
import { getCsrfToken } from "util/formUtil";

const csrfToken = getCsrfToken()!;

const client = new ApolloClient({
  link: new HttpLink({
    credentials: "same-origin",
    headers: { "X-CSRF-Token": csrfToken },
  }),
  cache: new InMemoryCache(),
});

const App = () => {
  return (
    <ApolloProvider client={client}>
      <AppRoute header={<HeaderNav />} footer={<Footer />} />
    </ApolloProvider>
  );
};

export default App;
