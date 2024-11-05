import React from "react";
import { useForm } from "react-hook-form";
import { getCsrfToken } from "../util/formUtil";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const csrfToken = getCsrfToken();

    if (!csrfToken) return null;

    const url = "/session";
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({ session: data }),
      headers: {
        "X-CSRF-Token": csrfToken,
        "Content-Type": "application/json",
      },
    });

    const responseData = await response.json();
    navigate("/");
  };
  return (
    <div className="grid place-content-center">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h3 className="mb-4 text-2xl">Login</h3>
        <div>
          <label className="block ">Email</label>
          <input
            className="mb-2 text-center"
            {...register("email")}
            type="email"
          />
        </div>
        <div>
          <label className="block ">Password</label>
          <input
            className="mb-2 text-center"
            {...register("password")}
            type="password"
          />
        </div>
        <div>
          <input type="submit" className="w-full border-2 col-end-3" />
        </div>
      </form>
    </div>
  );
};

export default Login;
