import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** An ISO 8601-encoded datetime */
  ISO8601DateTime: { input: any; output: any; }
  /** Represents untyped JSON */
  JSON: { input: any; output: any; }
};

export type AddressInput = {
  city: Scalars['String']['input'];
  country: Scalars['String']['input'];
  line1: Scalars['String']['input'];
  line2?: InputMaybe<Scalars['String']['input']>;
  postalCode: Scalars['String']['input'];
  state: Scalars['String']['input'];
};

export type AutomaticTax = {
  __typename?: 'AutomaticTax';
  enabled: Scalars['Boolean']['output'];
  liability?: Maybe<Scalars['JSON']['output']>;
  status?: Maybe<Scalars['String']['output']>;
};

/** Based on https://docs.stripe.com/api/checkout/sessions/object */
export type CheckoutSession = {
  __typename?: 'CheckoutSession';
  amountSubtotal?: Maybe<Scalars['Int']['output']>;
  amountTotal?: Maybe<Scalars['Int']['output']>;
  automaticTax: AutomaticTax;
  billingAddressCollection?: Maybe<Scalars['String']['output']>;
  cancelUrl?: Maybe<Scalars['String']['output']>;
  clientReferenceId?: Maybe<Scalars['String']['output']>;
  created: Scalars['ISO8601DateTime']['output'];
  currency?: Maybe<Scalars['String']['output']>;
  customer?: Maybe<Scalars['String']['output']>;
  customerDetails?: Maybe<CustomerDetails>;
  customerEmail?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  livemode: Scalars['Boolean']['output'];
  locale?: Maybe<Scalars['String']['output']>;
  metadata?: Maybe<Scalars['JSON']['output']>;
  mode: Scalars['String']['output'];
  paymentIntent?: Maybe<Scalars['String']['output']>;
  paymentMethodCollection?: Maybe<Scalars['String']['output']>;
  paymentMethodTypes: Array<Scalars['String']['output']>;
  paymentStatus: Scalars['String']['output'];
  stripeObject: Scalars['String']['output'];
  successUrl: Scalars['String']['output'];
  totalDetails: TotalDetails;
  url: Scalars['String']['output'];
};

export type CustomerAddress = {
  __typename?: 'CustomerAddress';
  city?: Maybe<Scalars['String']['output']>;
  country?: Maybe<Scalars['String']['output']>;
  line1?: Maybe<Scalars['String']['output']>;
  line2?: Maybe<Scalars['String']['output']>;
  postalCode?: Maybe<Scalars['String']['output']>;
  state?: Maybe<Scalars['String']['output']>;
};

export type CustomerDetails = {
  __typename?: 'CustomerDetails';
  address?: Maybe<CustomerAddress>;
  email?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  taxExempt?: Maybe<Scalars['String']['output']>;
  taxIds?: Maybe<Array<Scalars['JSON']['output']>>;
};

/** Generic error type */
export type Error = {
  __typename?: 'Error';
  message: Scalars['String']['output'];
  path?: Maybe<Array<Scalars['String']['output']>>;
};

export type ListObject = {
  __typename?: 'ListObject';
  data?: Maybe<Array<Product>>;
  hasMore: Scalars['Boolean']['output'];
  stripeObject: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Creates a new session */
  sessionCreate?: Maybe<SessionCreatePayload>;
  /** Logs the current user out */
  sessionDelete?: Maybe<SessionDeletePayload>;
  /** Creates a new stripe_checkout_session */
  stripeCheckoutSessionCreate?: Maybe<StripeCheckoutSessionCreatePayload>;
  /** Creates a new user */
  userCreate?: Maybe<UserCreatePayload>;
};


export type MutationSessionCreateArgs = {
  input: SessionCreateInput;
};


export type MutationSessionDeleteArgs = {
  input: SessionDeleteInput;
};


export type MutationStripeCheckoutSessionCreateArgs = {
  input: StripeCheckoutSessionCreateInput;
};


export type MutationUserCreateArgs = {
  input: UserCreateInput;
};

export type OrderPageInput = {
  price: Scalars['String']['input'];
  quantity?: InputMaybe<Scalars['Int']['input']>;
};

export type Product = {
  __typename?: 'Product';
  active: Scalars['Boolean']['output'];
  attributes: Array<Maybe<Scalars['String']['output']>>;
  created: Scalars['ISO8601DateTime']['output'];
  defaultPrice: Scalars['String']['output'];
  description: Scalars['String']['output'];
  id: Scalars['String']['output'];
  images: Array<Maybe<Scalars['String']['output']>>;
  livemode: Scalars['Boolean']['output'];
  marketingFeatures: Scalars['JSON']['output'];
  metadata: Scalars['JSON']['output'];
  name: Scalars['String']['output'];
  packageDimensions?: Maybe<Scalars['JSON']['output']>;
  shippable?: Maybe<Scalars['Boolean']['output']>;
  statementDescriptor?: Maybe<Scalars['String']['output']>;
  stripeObject: Scalars['String']['output'];
  taxCode: Scalars['String']['output'];
  type: Scalars['String']['output'];
  unitLabel?: Maybe<Scalars['String']['output']>;
  updated: Scalars['ISO8601DateTime']['output'];
  url?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  currentUser?: Maybe<User>;
  listProducts: ListObject;
  retrieveProduct?: Maybe<Product>;
};


export type QueryRetrieveProductArgs = {
  productId: Scalars['String']['input'];
};

/** Autogenerated input type of SessionCreate */
export type SessionCreateInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  sessionInput: SessionInput;
};

/** Autogenerated return type of SessionCreate. */
export type SessionCreatePayload = {
  __typename?: 'SessionCreatePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  errors: Array<Error>;
  user?: Maybe<User>;
};

/** Autogenerated input type of SessionDelete */
export type SessionDeleteInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

/** Autogenerated return type of SessionDelete. */
export type SessionDeletePayload = {
  __typename?: 'SessionDeletePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  errors: Array<Error>;
  user?: Maybe<User>;
};

export type SessionInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

/** Autogenerated input type of StripeCheckoutSessionCreate */
export type StripeCheckoutSessionCreateInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  stripeCheckoutSessionInput: StripeCheckoutSessionInput;
};

/** Autogenerated return type of StripeCheckoutSessionCreate. */
export type StripeCheckoutSessionCreatePayload = {
  __typename?: 'StripeCheckoutSessionCreatePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  errors: Array<Error>;
  stripeCheckoutSession?: Maybe<CheckoutSession>;
};

export type StripeCheckoutSessionInput = {
  lineItems: Array<OrderPageInput>;
};

export type TotalDetails = {
  __typename?: 'TotalDetails';
  amountDiscount: Scalars['Int']['output'];
  amountShipping: Scalars['Int']['output'];
  amountTax: Scalars['Int']['output'];
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['ISO8601DateTime']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  stripeCustomerId?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['ISO8601DateTime']['output'];
};

/** Autogenerated input type of UserCreate */
export type UserCreateInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  userInput: UserInput;
};

/** Autogenerated return type of UserCreate. */
export type UserCreatePayload = {
  __typename?: 'UserCreatePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  errors: Array<Error>;
  user?: Maybe<User>;
};

export type UserInput = {
  address: AddressInput;
  email: Scalars['String']['input'];
  id?: InputMaybe<Scalars['ID']['input']>;
  /** The full name of the user */
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
  passwordConfirmation: Scalars['String']['input'];
  phone: Scalars['String']['input'];
  stripeCustomerId?: InputMaybe<Scalars['String']['input']>;
};

export type GetProductsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetProductsQuery = { __typename?: 'Query', listProducts: { __typename?: 'ListObject', stripeObject: string, hasMore: boolean, url: string, data?: Array<{ __typename?: 'Product', defaultPrice: string, description: string, name: string }> | null } };

export type StripeCheckoutSessionCreateMutationVariables = Exact<{
  input: StripeCheckoutSessionCreateInput;
}>;


export type StripeCheckoutSessionCreateMutation = { __typename?: 'Mutation', stripeCheckoutSessionCreate?: { __typename?: 'StripeCheckoutSessionCreatePayload', stripeCheckoutSession?: { __typename?: 'CheckoutSession', url: string } | null, errors: Array<{ __typename?: 'Error', message: string }> } | null };

export type CurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserQuery = { __typename?: 'Query', currentUser?: { __typename?: 'User', id: string, email: string } | null };

export type SessionDeleteMutationVariables = Exact<{ [key: string]: never; }>;


export type SessionDeleteMutation = { __typename?: 'Mutation', sessionDelete?: { __typename?: 'SessionDeletePayload', user?: { __typename?: 'User', id: string } | null, errors: Array<{ __typename?: 'Error', message: string, path?: Array<string> | null }> } | null };

export type CreateSessionMutationVariables = Exact<{
  input: SessionCreateInput;
}>;


export type CreateSessionMutation = { __typename?: 'Mutation', sessionCreate?: { __typename?: 'SessionCreatePayload', user?: { __typename?: 'User', id: string } | null, errors: Array<{ __typename?: 'Error', message: string, path?: Array<string> | null }> } | null };

export type CreateUserMutationVariables = Exact<{
  input: UserCreateInput;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', userCreate?: { __typename?: 'UserCreatePayload', user?: { __typename?: 'User', id: string, email: string } | null, errors: Array<{ __typename?: 'Error', message: string, path?: Array<string> | null }> } | null };


export const GetProductsDocument = gql`
    query GetProducts {
  listProducts {
    stripeObject
    hasMore
    url
    data {
      defaultPrice
      description
      name
    }
  }
}
    `;

/**
 * __useGetProductsQuery__
 *
 * To run a query within a React component, call `useGetProductsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProductsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProductsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetProductsQuery(baseOptions?: Apollo.QueryHookOptions<GetProductsQuery, GetProductsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetProductsQuery, GetProductsQueryVariables>(GetProductsDocument, options);
      }
export function useGetProductsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProductsQuery, GetProductsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetProductsQuery, GetProductsQueryVariables>(GetProductsDocument, options);
        }
export function useGetProductsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetProductsQuery, GetProductsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetProductsQuery, GetProductsQueryVariables>(GetProductsDocument, options);
        }
export type GetProductsQueryHookResult = ReturnType<typeof useGetProductsQuery>;
export type GetProductsLazyQueryHookResult = ReturnType<typeof useGetProductsLazyQuery>;
export type GetProductsSuspenseQueryHookResult = ReturnType<typeof useGetProductsSuspenseQuery>;
export type GetProductsQueryResult = Apollo.QueryResult<GetProductsQuery, GetProductsQueryVariables>;
export const StripeCheckoutSessionCreateDocument = gql`
    mutation StripeCheckoutSessionCreate($input: StripeCheckoutSessionCreateInput!) {
  stripeCheckoutSessionCreate(input: $input) {
    stripeCheckoutSession {
      url
    }
    errors {
      message
    }
  }
}
    `;
export type StripeCheckoutSessionCreateMutationFn = Apollo.MutationFunction<StripeCheckoutSessionCreateMutation, StripeCheckoutSessionCreateMutationVariables>;

/**
 * __useStripeCheckoutSessionCreateMutation__
 *
 * To run a mutation, you first call `useStripeCheckoutSessionCreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useStripeCheckoutSessionCreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [stripeCheckoutSessionCreateMutation, { data, loading, error }] = useStripeCheckoutSessionCreateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useStripeCheckoutSessionCreateMutation(baseOptions?: Apollo.MutationHookOptions<StripeCheckoutSessionCreateMutation, StripeCheckoutSessionCreateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<StripeCheckoutSessionCreateMutation, StripeCheckoutSessionCreateMutationVariables>(StripeCheckoutSessionCreateDocument, options);
      }
export type StripeCheckoutSessionCreateMutationHookResult = ReturnType<typeof useStripeCheckoutSessionCreateMutation>;
export type StripeCheckoutSessionCreateMutationResult = Apollo.MutationResult<StripeCheckoutSessionCreateMutation>;
export type StripeCheckoutSessionCreateMutationOptions = Apollo.BaseMutationOptions<StripeCheckoutSessionCreateMutation, StripeCheckoutSessionCreateMutationVariables>;
export const CurrentUserDocument = gql`
    query CurrentUser {
  currentUser {
    id
    email
  }
}
    `;

/**
 * __useCurrentUserQuery__
 *
 * To run a query within a React component, call `useCurrentUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useCurrentUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCurrentUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useCurrentUserQuery(baseOptions?: Apollo.QueryHookOptions<CurrentUserQuery, CurrentUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CurrentUserQuery, CurrentUserQueryVariables>(CurrentUserDocument, options);
      }
export function useCurrentUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CurrentUserQuery, CurrentUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CurrentUserQuery, CurrentUserQueryVariables>(CurrentUserDocument, options);
        }
export function useCurrentUserSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<CurrentUserQuery, CurrentUserQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<CurrentUserQuery, CurrentUserQueryVariables>(CurrentUserDocument, options);
        }
export type CurrentUserQueryHookResult = ReturnType<typeof useCurrentUserQuery>;
export type CurrentUserLazyQueryHookResult = ReturnType<typeof useCurrentUserLazyQuery>;
export type CurrentUserSuspenseQueryHookResult = ReturnType<typeof useCurrentUserSuspenseQuery>;
export type CurrentUserQueryResult = Apollo.QueryResult<CurrentUserQuery, CurrentUserQueryVariables>;
export const SessionDeleteDocument = gql`
    mutation SessionDelete {
  sessionDelete(input: {}) {
    user {
      id
    }
    errors {
      message
      path
    }
  }
}
    `;
export type SessionDeleteMutationFn = Apollo.MutationFunction<SessionDeleteMutation, SessionDeleteMutationVariables>;

/**
 * __useSessionDeleteMutation__
 *
 * To run a mutation, you first call `useSessionDeleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSessionDeleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sessionDeleteMutation, { data, loading, error }] = useSessionDeleteMutation({
 *   variables: {
 *   },
 * });
 */
export function useSessionDeleteMutation(baseOptions?: Apollo.MutationHookOptions<SessionDeleteMutation, SessionDeleteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SessionDeleteMutation, SessionDeleteMutationVariables>(SessionDeleteDocument, options);
      }
export type SessionDeleteMutationHookResult = ReturnType<typeof useSessionDeleteMutation>;
export type SessionDeleteMutationResult = Apollo.MutationResult<SessionDeleteMutation>;
export type SessionDeleteMutationOptions = Apollo.BaseMutationOptions<SessionDeleteMutation, SessionDeleteMutationVariables>;
export const CreateSessionDocument = gql`
    mutation CreateSession($input: SessionCreateInput!) {
  sessionCreate(input: $input) {
    user {
      id
    }
    errors {
      message
      path
    }
  }
}
    `;
export type CreateSessionMutationFn = Apollo.MutationFunction<CreateSessionMutation, CreateSessionMutationVariables>;

/**
 * __useCreateSessionMutation__
 *
 * To run a mutation, you first call `useCreateSessionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSessionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSessionMutation, { data, loading, error }] = useCreateSessionMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateSessionMutation(baseOptions?: Apollo.MutationHookOptions<CreateSessionMutation, CreateSessionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateSessionMutation, CreateSessionMutationVariables>(CreateSessionDocument, options);
      }
export type CreateSessionMutationHookResult = ReturnType<typeof useCreateSessionMutation>;
export type CreateSessionMutationResult = Apollo.MutationResult<CreateSessionMutation>;
export type CreateSessionMutationOptions = Apollo.BaseMutationOptions<CreateSessionMutation, CreateSessionMutationVariables>;
export const CreateUserDocument = gql`
    mutation CreateUser($input: UserCreateInput!) {
  userCreate(input: $input) {
    user {
      id
      email
    }
    errors {
      message
      path
    }
  }
}
    `;
export type CreateUserMutationFn = Apollo.MutationFunction<CreateUserMutation, CreateUserMutationVariables>;

/**
 * __useCreateUserMutation__
 *
 * To run a mutation, you first call `useCreateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUserMutation, { data, loading, error }] = useCreateUserMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateUserMutation(baseOptions?: Apollo.MutationHookOptions<CreateUserMutation, CreateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateUserMutation, CreateUserMutationVariables>(CreateUserDocument, options);
      }
export type CreateUserMutationHookResult = ReturnType<typeof useCreateUserMutation>;
export type CreateUserMutationResult = Apollo.MutationResult<CreateUserMutation>;
export type CreateUserMutationOptions = Apollo.BaseMutationOptions<CreateUserMutation, CreateUserMutationVariables>;