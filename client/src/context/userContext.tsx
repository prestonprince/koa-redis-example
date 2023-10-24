import { createContext, useState, useEffect } from "react";

export interface TUser {
  id: number;
  username: string;
  isLoggedIn: boolean;
}

type TUserContextProps = {
  user: TUser | null;
  setUser: (value: TUser | null) => void;
};

type UserContextProviderProps = {
  children: React.ReactElement;
};

function useLocalStorage(key: string, defaultValue: TUser | null) {
  const data = window.localStorage.getItem(key);

  if (!data) {
    return defaultValue;
  }

  return JSON.parse(data);
}

export const UserContext = createContext<TUserContextProps>({
  user: null,
  setUser: () => {
    return;
  },
});

export const UserContextProvider = (
  props: UserContextProviderProps
): React.ReactElement => {
  const [user, setUser] = useState<TUser | null>(useLocalStorage("user", null));

  useEffect(() => {
    if (user !== null) {
      window.localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {props.children}
    </UserContext.Provider>
  );
};
