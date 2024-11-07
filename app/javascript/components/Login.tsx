import { gql } from "@apollo/client";
import { SessionInput, useCreateSessionMutation } from "graphql/types";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

gql`
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
          await login({ variables: { input: { sessionInput: data } } });

          navigate("/");
        })}
      >
        <h3 className="mb-4 text-2xl">Login</h3>
        <div>
          <label className="block ">Email</label>
          <input
            disabled={loading ? true : false}
            className={`mb-2 text-center ${loading ? "blur" : ""}`}
            {...register("email")}
            type="email"
          />
        </div>
        <div>
          <label className="block ">Password</label>
          <input
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
            className="w-full border-2 col-end-3"
          />
        </div>
      </form>
    </div>
  );
};

export default Login;
