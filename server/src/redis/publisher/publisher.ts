import { Redis } from "ioredis";

export function addRedisPublisher(url: string) {
  const pubClient = new Redis(url);
  pubClient.on("error", (err) => {
    console.log(err);
  });

  return pubClient;
}

export async function publishMessage(
  channel: string,
  data: string,
  pubClient: Redis
) {
  await pubClient.publish(channel, data);
}
