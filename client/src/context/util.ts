import { useContext } from "react";
import { UserContext } from "./userContext";

export const useUserContext = () => {
  const userContext = useContext(UserContext);

  if (userContext === undefined) {
    throw new Error("hook must be within provider");
  }

  return userContext;
};
