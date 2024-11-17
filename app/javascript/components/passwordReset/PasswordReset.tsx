import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PasswordResetInput, usePasswordReset } from "hooks/passwords";
import React from "react";
import { useForm } from "react-hook-form";

const PasswordReset = () => {
  const { register, handleSubmit } = useForm<PasswordResetInput>();
  const [passwordReset, { data, loading, error }] = usePasswordReset();

  return (
    <div className="grid justify-center h-[calc(100vh-17em)] p-4">
      <div className="md:w-[300px]">
        {loading ? (
          <>
            <FontAwesomeIcon icon={faSpinner} spin />
            <p className="my-6">Sending reset instructions...</p>
          </>
        ) : (
          <div>
            <h3 className="text-3xl mb-2">Password Reset</h3>
            <p className="mb-4">
              If you've lost your password, you can reset it using the form
              below.
            </p>
            <form
              onSubmit={handleSubmit(passwordReset)}
              className="grid p-4 bg-gray-700 rounded"
            >
              <div className="">
                {data?.message && (
                  <p className="text-green-700">{data.message}</p>
                )}
              </div>
              <div className="grid mb-4">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  className="p-2"
                  {...register("email")}
                />
              </div>
              <input
                type="submit"
                value="Email Reset Instructions"
                className="blue-button"
              />
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default PasswordReset;
