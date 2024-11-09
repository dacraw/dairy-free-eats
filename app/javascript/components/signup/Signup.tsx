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
        An account will fill in your information to make ordering easier. It
        also helps increase security of your orders, and allows you to
        communicate with us in real-time while ordering
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
          <input className="text-center w-full green-button" type="submit" />
        </form>
      </div>
    </div>
  );
};

export default Signup;
