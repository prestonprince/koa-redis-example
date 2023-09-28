import { db } from "../db/prisma";

export async function createTeamMessage(data: {
  messageId: number;
  teamId: number;
}) {
  const createdTeamMessage = await db.teamMessage.create({ data });
  return createdTeamMessage;
}
