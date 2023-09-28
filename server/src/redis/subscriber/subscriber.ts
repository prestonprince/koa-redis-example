import { TEAM_PATTERN, MESSAGE_LIST_LIMIT } from "../../utils/constants";
import AWS from "aws-sdk";
import { addTeamMessageToList } from "../data/redis.data";
import { io, pubClient } from "../../main";

AWS.config.update({ region: "us-east-1" });
const sqs = new AWS.SQS({ apiVersion: "2012-11-05" });

export function addRedisSubscriber() {
  const subClient = pubClient.duplicate();
  // handle errors
  subClient.on("error", (err) => console.error(err));

  // subscribe to team messages
  subClient.psubscribe(TEAM_PATTERN, (err, count) =>
    handleSubscribeError(err, count)
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
  count: unknown
) {
  if (err) {
    console.error(`Error subscribing to team channels`);
    return;
  }

  console.log(`${count} clients subscribed to team channels`);
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
    // add more cases as needed
  }
}

export async function handleRedisTeamMessage(channel: string, payload: string) {
  const teamId = channel.split("-")[1].split(":")[0];
  const { message, senderId, userId, uniqueId, createdAt } =
    JSON.parse(payload);

  const messageData = {
    message,
    teamId,
    userId,
    uniqueId,
    createdAt,
  };

  // Send to SQS
  const params = {
    MessageBody: JSON.stringify(messageData),
    QueueUrl: process.env.AWS_SQS_URL ?? "",
  };
  sqs.sendMessage(params, (err, data) => {
    if (err) {
      console.error(err);
    }
  });

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
