import { Message } from "@prisma/client";
import { db } from "../db/prisma";

export async function createMessage(data: {
  userId: number;
  message: string;
}): Promise<Message> {
  const { userId, message } = data;
  const createdMessage = await db.message.create({ data: { userId, message } });
  return createdMessage;
}
