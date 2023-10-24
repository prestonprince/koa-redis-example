import axios from "axios";
import { AxiosRequestHeaders } from "axios";

export const defaultHeaders = {
  "Content-Type": "application/json",
};

export const apiClient = axios.create({
  headers: defaultHeaders,
});

export const get = async (path: string, headers?: AxiosRequestHeaders) => {
  return apiClient.get(path, {
    headers,
  });
};

export const post = async <TResType, TReqType>(
  path: string,
  params?: TReqType
) => {
  return apiClient.post<TResType>(path, params);
};
