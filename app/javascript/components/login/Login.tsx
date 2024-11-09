import { gql } from "@apollo/client";
import { SessionInput, useCreateSessionMutation } from "graphql/types";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { startCase } from "lodash";

export const CREATE_SESSION = gql`
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

const Login = () => {
  const { register, handleSubmit } = useForm<SessionInput>();
  const [login, { loading, data }] = useCreateSessionMutation();
  const navigate = useNavigate();

  return (
    <div className="grid place-content-center">
      <form
        onSubmit={handleSubmit(async (data) => {
          const mutationData = await login({
            variables: { input: { sessionInput: data } },
          });

          if (!mutationData?.data?.sessionCreate?.errors?.length) {
            navigate("/");
          }
        })}
      >
        {data?.sessionCreate?.errors?.map((error, i) => {
          if (!error.path) return null;

          return (
            <p key={i} className="text-red-700">
              {startCase(error.path[1])} {error.message}
            </p>
          );
        })}
        <h3 className="mb-4 text-2xl">Login</h3>
        <div>
          <label className="block" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            disabled={loading ? true : false}
            className={`mb-2 text-center ${loading ? "blur" : ""}`}
            {...register("email")}
            type="email"
          />
        </div>
        <div>
          <label className="block" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            disabled={loading ? true : false}
            minLength={8}
            className={`mb-2 text-center ${loading ? "blur" : ""}`}
            {...register("password")}
            type="password"
          />
        </div>
        <div>
          <input
            disabled={loading ? true : false}
            type="submit"
            className="w-full col-end-3 green-button"
          />
        </div>
      </form>
    </div>
  );
};

export default Login;
