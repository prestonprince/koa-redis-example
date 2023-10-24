import "./Login.scss";
import React, { useState } from "react";

import { TLoginResponse, useLogin } from "./store/login.api";
import { useUserContext } from "../../context/util";
import { AxiosResponse } from "axios";

export const Login = () => {
  const [username, setUsername] = useState<string>("");
  const { setUser } = useUserContext();

  const { mutate, isLoading } = useLogin();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const successCallback = (data: AxiosResponse<TLoginResponse, unknown>) => {
      setUser(data.data.user);
    };

    if (username.length <= 3) {
      window.alert("username must be longer than three characters");
      return;
    }

    await mutate({ username }, { onSuccess: successCallback });
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
