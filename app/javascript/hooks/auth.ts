import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCsrfToken } from "util/formUtil";

export const useLogin = (): [
  login: (data: { email: string; password: string }) => Promise<void>,
  {
    data: { message: string };
    error: Error | null;
    loading: Boolean;
  }
] => {
  const [csrfToken, setCsrfToken] = useState("");
  const [data, setData] = useState<{ message: string }>({ message: "" });
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setCsrfToken(getCsrfToken()!);
  }, []);

  const login = async (data: { email: string; password: string }) => {
    setLoading(true);

    const response = await fetch("/session", {
      method: "POST",
      body: JSON.stringify({
        session: { email_address: data?.email, password: data?.password },
      }),
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
      },
    });
    const responseData = await response.json();

    setLoading(false);
    setData(responseData);

    if (!response.ok) setError(new Error(responseData.error));

    navigate(responseData.redirect_url);
  };

  return [login, { data, error, loading }];
};
