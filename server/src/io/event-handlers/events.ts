import { RateLimiterMemory } from "rate-limiter-flexible";
import { Socket } from "socket.io";
import { handleJoinTeam, handleTeamMessage } from "./team-events";
import { TUserWithTeams } from "../../utils/types";
import { handleHeartbeat } from "./heartbeat";

async function consumePoint(limiter: RateLimiterMemory, socket: Socket) {
  try {
    await limiter.consume(socket.id); // Consume 1 point per event
  } catch (e) {
    socket.emit("too many requests");
    return;
  }
}

export function handleEvents(
  socket: Socket,
  limiter: RateLimiterMemory,
  user: TUserWithTeams
) {
  // handle team room join
  socket.on(
    "join:tm",
    async (payload) => await handleJoinTeam(payload, user, socket)
  );

  // handle team message
  socket.on("message:tm", async (payload) => {
    await consumePoint(limiter, socket);
    await handleTeamMessage(payload, socket);
    await handleHeartbeat((socket as any).user);
  });
}
