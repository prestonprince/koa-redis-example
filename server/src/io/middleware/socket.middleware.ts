import { Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

import { getUserFromCache, setUserInCache } from "../../redis/data/redis.data";
import { TUserWithTeams } from "../../utils/types";
import { getUserWithTeams } from "../../service/user.service";

export function attachUserId(
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  next: (err?: ExtendedError | undefined) => void
) {
  const userId = socket.handshake.query.userid;

  if (!userId) {
    next(new Error("unauthorized"));
    return;
  }

  (socket as any).userId = userId;
  next();
}

export async function attachUserObject(
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  next: (err?: ExtendedError | undefined) => void
) {
  const userId = (socket as any).userId;
  if (!userId) {
    next(new Error("unauthorized"));
    return;
  }

  const userFromCache = await getUserFromCache(userId);
  let user: TUserWithTeams;

  if (userFromCache) {
    user = JSON.parse(userFromCache);
  } else {
    user = await getUserWithTeams(+userId);

    if (!user) {
      next(new Error("user not found"));
      return;
    }

    await setUserInCache(user);
  }

  (socket as any).user = user;
  next();
}
