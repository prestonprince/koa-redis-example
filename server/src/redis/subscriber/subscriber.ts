import {
  TEAM_PATTERN,
  MESSAGE_LIST_LIMIT,
  PRESENCE_PATTERN,
} from "../../utils/constants";
import { addTeamMessageToList } from "../data/redis.data";
import { io, pubClient } from "../../main";

export function addRedisSubscriber() {
  const subClient = pubClient.duplicate();
  // handle errors
  subClient.on("error", (err) => console.error(err));

  // subscribe to team messages
  subClient.psubscribe(TEAM_PATTERN, (err, count) =>
    handleSubscribeError(err, count, "team")
  );

  // subscribe to presence messages
  subClient.psubscribe(PRESENCE_PATTERN, (err, count) =>
    handleSubscribeError(err, count, "presence")
  );

  // handle message patterns
  subClient.on(
    "pmessage",
    async (pattern, channel, payload) =>
      await handleMessagePatterns(pattern, channel, payload)
  );

  return subClient;
}

export async function handleSubscribeError(
  err: Error | null | undefined,
  count: unknown,
  type: string
) {
  if (err) {
    console.error(`Error subscribing to ${type} channels`);
    return;
  }

  console.log(`${count} clients subscribed to ${type} channels`);
}

export async function handleMessagePatterns(
  pattern: string,
  channel: string,
  payload: string
) {
  switch (pattern) {
    // handle team messages
    case TEAM_PATTERN:
      await handleRedisTeamMessage(channel, payload);
      break;
    case PRESENCE_PATTERN:
      await handlePresenceMessage(channel, payload);
      break;
    // add more cases as needed
  }
}

export async function handleRedisTeamMessage(channel: string, payload: string) {
  const teamId = channel.split("-")[1].split(":")[0];
  const { message, senderId, userId, uniqueId, createdAt } =
    JSON.parse(payload);

  console.log("GOT TEAM MESSAGE IN SUBSCRIBER! MESSAGE: ", message);

  const messageData = {
    message,
    teamId,
    userId,
    uniqueId,
    createdAt,
  };

  await addTeamMessageToList(channel, messageData);

  const room = io.of("/").adapter.rooms.get(channel);
  if (room) {
    room.forEach((socketId) => {
      if (socketId !== senderId) {
        io.to(socketId).emit("message:tm", { message, teamId, userId });
      }
    });
  }
}

export async function handlePresenceMessage(channel: string, payload: string) {
  const data = JSON.parse(payload);
  io.emit(channel, data);
}
