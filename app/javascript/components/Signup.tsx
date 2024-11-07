import { gql, useMutation } from "@apollo/client";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { startCase } from "lodash";

const CREATE_USER = gql`
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
  const [createUser, { loading, data }] = useMutation(CREATE_USER);
  const { register, handleSubmit } = useForm();

  if (loading) return <p>Loading....</p>;

  const onSubmit = async (data: { [key: string]: string }) => {
    createUser({ variables: { input: { userInput: data } } });

    navigate("/order");
  };

  return (
    <div>
      <h1 className="text-2xl mb-2">Sign up for an account</h1>
      <p className="mb-4">
        An account will fill in your information to make ordering easier. It
        also helps increase security of your orders, and allows you to
        communicate with us in real-time while ordering
      </p>

      <div className="w-1/2 grid place-content-center mx-auto">
        {data?.userCreate?.errors?.map((error, i) => (
          <p className="text-red-800" key={i}>
            {startCase(error.path[1])} {error.message}
          </p>
        ))}
        <form onSubmit={handleSubmit(onSubmit)}>
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
            <label className="block" htmlFor="password_confirmation">
              Confirm Password
            </label>
            <input
              className="border-2 border-gray-600 p-2"
              id="password_confirmation"
              type="password"
              minLength={8}
              {...register("passwordConfirmation")}
            />
          </div>
          <input
            className="text-center border-2 border-gray-700 p-2 w-full"
            type="submit"
          />
        </form>
      </div>
    </div>
  );
};

export default Signup;
