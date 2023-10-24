import { TUserWithTeams } from "../../utils/types";
import { updateHeartbeat } from "../../redis/data/redis.data";
import { pubClient } from "../../main";
import { publishMessage } from "../../redis/publisher/publisher";

export async function handleHeartbeat(user: TUserWithTeams) {
  if (user) {
    await publishMessage(
      `presence:user-${String(user.id)}`,
      JSON.stringify({ heartbeat: Date.now() }),
      pubClient
    );
    await updateHeartbeat(user);
  }
}
