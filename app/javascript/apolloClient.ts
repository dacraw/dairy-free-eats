import { getCsrfToken } from "util/formUtil";
import { createConsumer } from "@rails/actioncable";
import ActionCableLink from "graphql-ruby-client/subscriptions/ActionCableLink";
import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  Operation,
} from "@apollo/client";
import { relayStylePagination } from "@apollo/client/utilities";

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
    (def) =>
      def.kind === "OperationDefinition" && def.operation === "subscription"
  );
};

const link = ApolloLink.split(
  hasSubscriptionOperation,
  new ActionCableLink({ cable }),
  httpLink
);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          currentUserNotifications: relayStylePagination(),
        },
      },
    },
  }),
});

export default client;
