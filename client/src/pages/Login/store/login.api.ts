import { useMutation } from "react-query";
import { post } from "../../../utils/api";

import { TUser } from "../../../context/userContext";

export interface TLoginParams {
  username: string;
}

export interface TLoginResponse {
  message: string;
  user: TUser;
}

export function useLogin() {
  return useMutation((params: TLoginParams) =>
    post<TLoginResponse, TLoginParams>(
      "http://localhost:3001/api/auth/login",
      params
    )
  );
}
