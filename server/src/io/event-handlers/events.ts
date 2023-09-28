import { RateLimiterMemory } from "rate-limiter-flexible";
import { Socket } from "socket.io";
import { handleJoinTeam, handleTeamMessage } from "./team-events";
import { TUserWithTeams } from "../../utils/types";

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
    try {
      await limiter.consume(socket.id); // Consume 1 point per event
    } catch (e) {
      socket.emit("too many requests");
      return;
    }

    await handleTeamMessage(payload, socket);
  });
}
