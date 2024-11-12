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
    <div className="p-4">
      {loading && <p>Loading</p>}
      <h1 className="text-2xl mb-2">Sign up for an account</h1>
      <p className="mb-4">
        An account will fill in your information to make ordering easier.
      </p>

      <div className="md:w-[500px] md:mx-auto md:grid md:place-content-center">
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
          <div>
            {data?.userCreate?.errors?.map((error, i) => {
              if (!error.path) return null;

              return (
                <p className="text-red-800" key={i}>
                  {startCase(error.path[1])} {error.message}
                </p>
              );
            })}
          </div>
          <div className="md:grid md:grid-cols-2 md:gap-10">
            <div className="mb-2">
              <h3 className="font-bold text-lg border-b-2 mb-4 ">
                Address Information
              </h3>

              <div className="grid justify-center md:block">
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
                    placeholder="ex: NV, CO, NY, AL"
                    {...register("address.state")}
                  />
                </div>
              </div>
            </div>
            <div className="mb-2">
              <h3 className="font-bold text-lg border-b-2 mb-4 ">
                Contact/Login Information
              </h3>
              <div className="grid justify-center md:block">
                <div className="mb-2">
                  <label className="block" htmlFor="phone">
                    Phone
                  </label>
                  <input
                    className="border-2 border-gray-600 p-2"
                    id="phone"
                    type="tel"
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
          <div className="text-xs mb-4">
            <p>
              Address information, name and phone number will be used to create
              your Stripe Customer account, and is necessary for billing and
              delivery. This information will be required during the Stripe
              Checkout, so it's recommended to fill it out now to save time
              later.
            </p>
            <p>
              <strong className="font-bold underline">Note:</strong> Only your
              email and password will be stored by this app for logging in, the
              rest of the information will be stored by Stripe and accessed by
              this app via Stripe API for order delivery purposes (including
              contacting you during the lifetime of an order, as necessary).
            </p>
          </div>
          <input
            className="text-center w-full green-button col-span-2"
            type="submit"
            value="Create Account"
          />
        </form>
      </div>
    </div>
  );
};

export default Signup;
