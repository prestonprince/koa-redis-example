import "./Login.scss";
import React, { useState, useEffect } from "react";

import { TLoginResponse, useLogin } from "./store/login.api";
import { useUserContext } from "../../context/util";
import { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [username, setUsername] = useState<string>("");
  const { user, setUser } = useUserContext();

  const { mutate, isLoading } = useLogin();

  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.isLoggedIn) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const successCallback = async (
      data: AxiosResponse<TLoginResponse, unknown>
    ) => {
      setUser(data.data.user);
      navigate("/", { replace: true });
    };

    if (username.length <= 3) {
      window.alert("username must be longer than three characters");
      return;
    }

    mutate({ username }, { onSuccess: successCallback });
  };
  return (
    <section>
      <form className="login" onSubmit={handleSubmit}>
        <div className="login-container">
          <label>username</label>
          <input
            aria-label="username"
            type="text"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <button type="submit" disabled={isLoading}>
          login
        </button>
      </form>
    </section>
  );
};
