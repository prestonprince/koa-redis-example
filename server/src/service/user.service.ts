import { db } from "../db/prisma";

export async function getUserWithTeams(id: number) {
  const user = await db.user.findUnique({
    where: { id },
    include: { teams: true },
  });

  return user;
}
