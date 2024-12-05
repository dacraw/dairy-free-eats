import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getCsrfToken } from "util/formUtil";

export type PasswordResetInput = {
  email: string;
};

export const usePasswordReset = (): [
  passwordReset: (data: PasswordResetInput) => Promise<void>,
  {
    data: { message: string };
    error: Error | null;
    loading: boolean;
  }
] => {
  const [csrfToken, setCsrfToken] = useState("");
  const [data, setData] = useState<{ message: string }>({ message: "" });
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCsrfToken(getCsrfToken()!);
  }, []);

  const passwordReset = async (data: PasswordResetInput) => {
    setLoading(true);

    const response = await fetch("/passwords", {
      method: "POST",
      body: JSON.stringify({
        password: { email_address: data?.email },
      }),
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
      },
    });
    const responseData = await response.json();

    setLoading(false);
    setData(responseData);

    if (!response.ok) {
      setError(new Error(responseData.error));
      return;
    }
  };

  return [passwordReset, { data, error, loading }];
};

export type CreateNewPasswordInput = {
  password: string;
  passwordConfirmation: string;
};

export const useCreateNewPassword = (): [
  createNewPassword: (data: CreateNewPasswordInput) => Promise<void>,
  {
    data: { message: string };
    error: Error | null;
    loading: boolean;
  }
] => {
  const [csrfToken, setCsrfToken] = useState("");
  const [data, setData] = useState<{ message: string }>({ message: "" });
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    setCsrfToken(getCsrfToken()!);
  }, []);

  if (!token)
    return [
      () => Promise.resolve(undefined),
      { data: { message: "no token present" }, error: null, loading: true },
    ];

  const createNewPassword = async (data: CreateNewPasswordInput) => {
    setLoading(true);

    const response = await fetch(`/passwords/${token}`, {
      method: "PATCH",
      body: JSON.stringify({
        password: data?.password,
        password_confirmation: data?.passwordConfirmation,
      }),
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
      },
    });
    const responseData = await response.json();

    setLoading(false);
    setData(responseData);

    if (!response.ok) {
      setError(new Error(responseData.error));
      return;
    }

    navigate(responseData.redirect_url);
  };

  return [createNewPassword, { data, error, loading }];
};
