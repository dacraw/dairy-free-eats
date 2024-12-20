import { Maybe } from "graphql/types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getCsrfToken } from "util/formUtil";

export type LoginInput = {
  email: string;
  password: string;
};

export const useLogin = (): [
  login: (data: LoginInput) => Promise<void>,
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
  const navigate = useNavigate();

  useEffect(() => {
    setCsrfToken(getCsrfToken()!);
  }, []);

  const login = async (data: LoginInput) => {
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

export const useAdminLogin = (): [
  adminLogin: () => Promise<void>,
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
  const navigate = useNavigate();

  useEffect(() => {
    setCsrfToken(getCsrfToken()!);
  }, []);

  const adminLogin = async () => {
    setLoading(true);

    const response = await fetch("/demo_admin_login", {
      method: "POST",
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

  return [adminLogin, { data, error, loading }];
};

export const useLogout = (): [
  logout: () => Promise<void>,
  {
    data: Maybe<{ message: string }>;
    error: Error | null;
    loading: boolean;
  }
] => {
  const [csrfToken, setCsrfToken] = useState("");
  const [data, setData] = useState<Maybe<{ message: string }>>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setCsrfToken(getCsrfToken()!);
  }, []);

  const logout = async () => {
    setLoading(true);

    const response = await fetch("/session", {
      method: "DELETE",
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

  return [logout, { data, error, loading }];
};
