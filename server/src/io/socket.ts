import { Server } from "socket.io";
import { RateLimiterMemory } from "rate-limiter-flexible";
import { createAdapter } from "@socket.io/redis-adapter";
import http from "http";

import { subClient, pubClient } from "../main";
import { TUserWithTeams } from "../utils/types";
import { removeUserFromCache } from "../redis/data/redis.data";
import { attachUserId, attachUserObject } from "./middleware/socket.middleware";
import { handleEvents } from "./event-handlers/events";

export function addSocketIO(
  server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>
) {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.adapter(createAdapter(pubClient, subClient));

  // middleware
  io.use((socket, next) => attachUserId(socket, next));
  io.use(async (socket, next) => await attachUserObject(socket, next));

  io.on("connection", async (socket) => {
    const user: TUserWithTeams = (socket as any).user;
    if (!user) {
      console.error("no user");
      socket.disconnect(true);
      return;
    }

    console.log(`User with id ${user.id} connected`);

    const limiter = new RateLimiterMemory({
      points: 5, // 5 points
      duration: 1, // per second
    });

    handleEvents(socket, limiter, user);

    socket.on("disconnect", async () => {
      await removeUserFromCache(String(user.id));
      console.log("user disconnected");
    });
  });

  return io;
}
