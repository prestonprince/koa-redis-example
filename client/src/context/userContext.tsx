import { createContext, useState } from "react";

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

export const UserContext = createContext<TUserContextProps>({
  user: null,
  setUser: () => {
    return;
  },
});

export const UserContextProvider = (
  props: UserContextProviderProps
): React.ReactElement => {
  const [user, setUser] = useState<TUser | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {props.children}
    </UserContext.Provider>
  );
};
