import { Redis } from "ioredis";
import { createMessage } from "../../service/message.service";
import { createTeamMessage } from "../../service/teamMessage.servive";
import { TUserWithTeams } from "../../utils/types";
import { dataWorker } from "../../main";

export function addRedisDataWorker(url: string) {
  const dataWorker = new Redis(url);
  dataWorker.on("error", (err) => {
    console.error(err);
  });

  return dataWorker;
}

export async function transferTeamMessages(
  channel: string,
  listLength: number
) {
  for (let i = 0; i <= listLength; ++i) {
    const messageData = await dataWorker.lpop(channel);
    if (messageData) {
      const { message, teamId, userId, uniqueId, createdAt } =
        JSON.parse(messageData);

      const createdMessage = await createMessage({ userId: +userId, message });
      if (!createdMessage) {
        throw new Error("could not create message in db");
      }

      const createdTeamMessage = await createTeamMessage({
        messageId: createdMessage.id,
        teamId: +teamId,
      });
      if (!createdTeamMessage) {
        throw new Error("could not create team message in db");
      }
    }
  }
}

export async function addTeamMessageToList(
  channel: string,
  messageData: {
    message: string;
    teamId: string;
    userId: string;
    uniqueId: string;
    createdAt: string;
  }
) {
  await dataWorker.rpush(channel, JSON.stringify(messageData));
}

export async function checkListLength(listName: string) {
  const listLength = await dataWorker.llen(listName);
  return listLength;
}

export async function getUserFromCache(userId: string) {
  const user = await dataWorker.get(userId);
  return user;
}

export async function setUserInCache(user: TUserWithTeams) {
  if (user) {
    await dataWorker.set(String(user.id), JSON.stringify(user), "EX", 60 * 60);
  }
}

export async function removeUserFromCache(userId: string) {
  await dataWorker.del(userId);
}
