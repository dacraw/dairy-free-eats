import { gql } from "@apollo/client";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { startCase } from "lodash";
import { UserInput, useCreateUserMutation } from "graphql/types";

export const CREATE_USER = gql`
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

const Signup = () => {
  const navigate = useNavigate();
  const [createUser, { loading, data, error }] = useCreateUserMutation();
  const { register, handleSubmit } = useForm<UserInput>();

  return (
    <div>
      {loading && <p>Loading</p>}
      <h1 className="text-2xl mb-2">Sign up for an account</h1>
      <p className="mb-4">
        An account will fill in your information to make ordering easier.
      </p>

      <div className="w-1/2 grid place-content-center mx-auto">
        {data?.userCreate?.errors?.map((error, i) => {
          if (!error.path) return null;

          return (
            <p className="text-red-800" key={i}>
              {startCase(error.path[1])} {error.message}
            </p>
          );
        })}
        <form
          onSubmit={handleSubmit(async (formData) => {
            const mutationData = await createUser({
              variables: { input: { userInput: formData } },
            });

            if (!mutationData?.data?.userCreate?.errors?.length) {
              navigate("/order");
            }
          })}
        >
          <div className="md:flex md:gap-2">
            <div className="mb-2">
              <h3>Address</h3>

              <div className="mb-2">
                <label className="block" htmlFor="address.city">
                  City
                </label>
                <input
                  className="border-2 border-gray-600 p-2"
                  id="address.city"
                  {...register("address.city")}
                />
              </div>
              <div className="mb-2">
                <label className="block" htmlFor="address.country">
                  Country
                </label>
                <input
                  className="border-2 border-gray-600 p-2"
                  id="address.country"
                  defaultValue="USA"
                  {...register("address.country")}
                />
              </div>
              <div className="mb-2">
                <label className="block" htmlFor="address.line1">
                  Address 1
                </label>
                <input
                  className="border-2 border-gray-600 p-2"
                  id="address.line1"
                  placeholder="ex: 123 Main St."
                  {...register("address.line1")}
                />
              </div>
              <div className="mb-2">
                <label className="block" htmlFor="address.line2">
                  Address 2
                </label>
                <input
                  className="border-2 border-gray-600 p-2"
                  id="address.line2"
                  placeholder="ex: Unit 123, Apt 567"
                  {...register("address.line2")}
                />
              </div>
              <div className="mb-2">
                <label className="block" htmlFor="address.postalCode">
                  Postal Code
                </label>
                <input
                  className="border-2 border-gray-600 p-2"
                  id="address.postalCode"
                  {...register("address.postalCode")}
                />
              </div>
              <div className="mb-2">
                <label className="block" htmlFor="address.state">
                  State
                </label>
                <input
                  className="border-2 border-gray-600 p-2"
                  id="address.state"
                  placeholder="ex: Unit 123, Apt 567"
                  {...register("address.state")}
                />
              </div>
              <div className="text-xs">
                <p>
                  This information will be used to create your Stripe Customer
                  account, and is necessary for billing and delivery.{" "}
                </p>
                <p>
                  <strong className="font-bold">IMPORTANT:</strong> This
                  information will not be persisted in this app's database, but
                  will instead be stored by Stripe.
                </p>
              </div>
            </div>
            <div className="mb-2">
              <h3>Contact/Login Information</h3>
              <div className="mb-2">
                <div className="mb-2">
                  <label className="block" htmlFor="name">
                    Full Name
                  </label>
                  <input
                    className="border-2 border-gray-600 p-2"
                    id="name"
                    placeholder="ex: Alex Orion"
                    {...register("name")}
                  />
                </div>
                <div className="mb-2">
                  <label className="block" htmlFor="phone">
                    Phone
                  </label>
                  <input
                    className="border-2 border-gray-600 p-2"
                    id="phone"
                    placeholder="ex: 555-123-4567"
                    {...register("phone")}
                  />
                </div>
                <div className="mb-2">
                  <label className="block" htmlFor="email">
                    Email
                  </label>
                  <input
                    className="border-2 border-gray-600 p-2"
                    id="email"
                    {...register("email")}
                    type="email"
                  />
                </div>
                <div className="mb-2">
                  <label className="block" htmlFor="password">
                    Password
                  </label>
                  <input
                    className="border-2 border-gray-600 p-2"
                    id="password"
                    type="password"
                    {...register("password")}
                    minLength={8}
                  />
                </div>
                <div className="mb-2">
                  <label className="block" htmlFor="passwordConfirmation">
                    Confirm Password
                  </label>
                  <input
                    className="border-2 border-gray-600 p-2"
                    id="passwordConfirmation"
                    type="password"
                    minLength={8}
                    {...register("passwordConfirmation")}
                  />
                </div>
              </div>
            </div>
          </div>
          <input className="text-center w-full green-button" type="submit" />
        </form>
      </div>
    </div>
  );
};

export default Signup;
