import { gql } from "@apollo/client";
import React from "react";
import { useForm } from "react-hook-form";
import { startCase } from "lodash";
import { SignupInput, useSignup } from "hooks/user";

const Signup = () => {
  const [signup, { loading, data, errors }] = useSignup();

  const { register, handleSubmit } = useForm<SignupInput>();

  if (!data) return null;

  return (
    <div className="p-4 grid place-content-center h-[calc(100vh-17em)]">
      {loading && <p>Loading</p>}

      <div className="md:max-w-[500px] md:mx-auto md:grid md:place-content-center">
        <h1 className="text-2xl mb-6 text-center">Sign up for an account</h1>

        <form onSubmit={handleSubmit(signup)}>
          <div className="text-center my-2">
            {errors?.map((message, i) => {
              return (
                <p key={i} className="text-red-800">
                  {message}
                </p>
              );
            })}
          </div>
          <div className="md:grid md:grid-cols-1 md:gap-10">
            {/* <div className="mb-2">
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
            </div> */}
            <div className="mb-2">
              {/* <h3 className="font-bold text-lg border-b-2 mb-4 ">
                Contact/Login Information
              </h3> */}
              <div className="grid justify-center">
                {/* <div className="mb-2">
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
                </div> */}
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
            {/* <p>
              Address information, name and phone number will be used to create
              your Stripe Customer account, and is necessary for billing and
              delivery. This information will be required during the Stripe
              Checkout, so it's recommended to fill it out now to save time
              later.
            </p> */}
            {/* <p>
              <strong className="font-bold underline">Note:</strong> Only your
              email and hashed password will be stored by this app for logging
              in, the rest of the information will be stored by Stripe and
              accessed by this app via Stripe API for order delivery purposes
              (including contacting you during the lifetime of an order, as
              necessary).
            </p> */}
            <p className="mb-4">
              Sign up with an email you can receives messages to; alternatively,
              Order as a Guest with an email you can receive messages to.
            </p>
            <p className="mb-4">
              Emails will be sent to the email address used in Stripe Checkout
              (the email will be prefilled if you Signup for an account here).
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
