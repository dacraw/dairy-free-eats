import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CreateNewPasswordInput, useCreateNewPassword } from "hooks/passwords";
import React from "react";
import { useForm } from "react-hook-form";

const CreateNewPassword = () => {
  const { register, handleSubmit } = useForm<CreateNewPasswordInput>();

  const [createNewPassword, { data, loading, error }] = useCreateNewPassword();

  return (
    <div className="grid justify-center">
      <div className="w-[300px]">
        {loading ? (
          <>
            <FontAwesomeIcon icon={faSpinner} className="text-5xl" />
            <p>Updating password...</p>
          </>
        ) : (
          <div>
            <h3 className="text-2xl mb-8">Create New Password</h3>
            <form onSubmit={handleSubmit(createNewPassword)}>
              {error && (
                <p className="text-red-700 my-4 text-center">{error.message}</p>
              )}
              <div className="grid mb-4">
                <label htmlFor="password">New Password</label>
                <input
                  id="password"
                  className="p-2"
                  minLength={8}
                  type="password"
                  {...register("password")}
                />
              </div>
              <div className="grid mb-4">
                <label htmlFor="passwordConfirmation">
                  Confirm New Password
                </label>
                <input
                  id="passwordConfirmation"
                  className="p-2"
                  minLength={8}
                  type="password"
                  {...register("passwordConfirmation")}
                />
              </div>
              <input
                type="submit"
                value="Update Password"
                className="blue-button py-2"
              />
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateNewPassword;
