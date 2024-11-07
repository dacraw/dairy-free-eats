import App from "components/App";
import React from "react";
import { createRoot } from "react-dom/client";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
  HttpLink,
} from "@apollo/client";
import { getCsrfToken } from "util/formUtil";

const csrfToken = getCsrfToken()!;

const client = new ApolloClient({
  // uri: "http://localhost:3000/graphql/",
  link: new HttpLink({
    credentials: "same-origin",
    headers: { "X-CSRF-Token": csrfToken },
  }),
  cache: new InMemoryCache(),
});

document.addEventListener("turbo:load", () => {
  const rootElement = document.createElement("div");
  const root = createRoot(document.body.appendChild(rootElement));

  root.render(
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  );
});
