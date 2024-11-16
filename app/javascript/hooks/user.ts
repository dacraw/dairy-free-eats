import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCsrfToken } from "util/formUtil";

export const useSignup = (): [
  signup: (data: {
    email: string;
    password: string;
    passwordConfirmation: string;
  }) => Promise<void>,
  {
    data: { message: string };
    errors: string[] | null;
    loading: boolean;
  }
] => {
  const [csrfToken, setCsrfToken] = useState("");
  const [data, setData] = useState<{ message: string }>({ message: "" });
  const [errors, setErrors] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setCsrfToken(getCsrfToken()!);
  }, []);

  const signup = async (data: {
    email: string;
    password: string;
    passwordConfirmation: string;
  }) => {
    setLoading(true);

    const response = await fetch("/api/v1/users", {
      method: "POST",
      body: JSON.stringify({
        user: {
          email_address: data?.email,
          password: data?.password,
          password_confirmation: data?.passwordConfirmation,
        },
      }),
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
      },
    });

    const responseData = await response.json();

    setLoading(false);
    setData(responseData.message);

    if (!response.ok) {
      setErrors(responseData.errors);
      return;
    }

    navigate(responseData.redirect_url);
  };

  return [signup, { data, errors, loading }];
};
