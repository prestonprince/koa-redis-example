import { Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";

import { TUserWithTeams } from "../../utils/types";
import { publishMessage } from "../../redis/publisher/publisher";
import { pubClient } from "../../main";

export async function handleJoinTeam(
  payload: any,
  user: TUserWithTeams,
  socket: Socket
) {
  const { teamId } = payload;
  if (!teamId) return;

  const isUserOnTeam = user?.teams.find((team) => team.id === teamId);
  if (!isUserOnTeam) return;

  const room = `chat:team-${Number(teamId)}:messages`;
  socket.join(room);
  console.log(`user ${user?.id} joined room: ` + room);
}

export async function handleTeamMessage(payload: any, socket: Socket) {
  const { message, teamId, userId } = payload;
  if (!message || !teamId || !userId) {
    return;
  }

  const uniqueId = uuidv4();
  const messageData = JSON.stringify({
    message: message.toString(),
    senderId: socket.id,
    userId,
    uniqueId,
  });

  const channel = `chat:team-${teamId}:messages`;
  await publishMessage(channel, messageData, pubClient);
}
