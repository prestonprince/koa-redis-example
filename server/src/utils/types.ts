export type TUserWithTeams =
  | ({
      teams: {
        id: number;
        name: string;
      }[];
    } & {
      id: number;
      username: string;
      isLoggedIn: boolean;
    })
  | null;
