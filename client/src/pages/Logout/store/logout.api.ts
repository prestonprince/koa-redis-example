import { useMutation } from "react-query";

import { post } from "../../../utils/api";

export interface TLogoutResp {
  message: string;
}

export interface TLogoutParams {
  username: string;
}

export function useLogout() {
  return useMutation((params: TLogoutParams) =>
    post<TLogoutResp, TLogoutParams>(
      "http://localhost:3001/api/auth/logout",
      params
    )
  );
}
