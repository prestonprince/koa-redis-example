import { useQuery } from "react-query";
import { get } from "../../../utils/api";

const GET_TEAMS_QUERY_KEY = "GET_TEAMS";

export function GetUserTeams(userId: number) {
  return useQuery(
    [GET_TEAMS_QUERY_KEY, userId],

    () =>
      get(
        "http://localhost:3001/api/user/:id/teams".replace(
          ":id",
          userId.toString()
        )
      ),

    { enabled: Boolean(userId) }
  );
}
