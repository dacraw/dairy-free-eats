import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState<{
    message: string;
    errors: string[];
  } | null>(null);
  const onSubmit = async (data: { [key: string]: string }) => {
    const url = "/users";
    const csrfToken = document
      .querySelector('meta[name="csrf-token"]')
      ?.getAttribute("content");

    if (!csrfToken) return null;

    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({ user: data }),
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
      },
    });

    const responseData = await response.json();

    if (response.status !== 200) {
      setError(responseData);
      return;
    }

    localStorage.setItem("jwt-token", responseData.token);

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
        {error && error.errors.map((error, i) => <p key={i}>{error}</p>)}
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
              {...register("password_confirmation")}
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
