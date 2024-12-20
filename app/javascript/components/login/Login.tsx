import { gql } from "@apollo/client";
import React from "react";
import { useForm } from "react-hook-form";
import { startCase } from "lodash";
import { LoginInput, useLogin } from "hooks/auth";
import { Link } from "react-router";

const Login = () => {
  const { register, handleSubmit } = useForm<LoginInput>();
  const [login, { data, loading, error }] = useLogin();

  if (!data) return null;

  return (
    <div className="grid align-top justify-center">
      <div>
        <form onSubmit={handleSubmit(login)} className="mb-12">
          {error && <p className="text-red-700">{startCase(error.message)}</p>}
          <h3 className="page-title">Login</h3>
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

        <div className="text-center">
          <Link to="/password_reset">Forgot Password?</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
