import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { getCsrfToken } from "util/formUtil";

const Login = () => {
  const { register, handleSubmit } = useForm<{
    email: string;
    password: string;
  }>();
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const onSubmit = handleSubmit(async (data) => {
    const csrfToken = getCsrfToken();

    if (!csrfToken) return null;

    const response = await fetch("api/v1/session", {
      method: "POST",
      body: JSON.stringify({ session: data }),
      headers: {
        "X-CSRF-Token": csrfToken,
        "Content-Type": "application/json",
      },
    });

    const responseData = await response.json();

    console.log(responseData);
    if (!response.ok) {
      setError(responseData.message);
    }

    // navigate("/");
  });

  return (
    <div className="grid place-content-center">
      <form onSubmit={onSubmit}>
        {error && <p className="text-red-700">{error}</p>}
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
            minLength={8}
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
