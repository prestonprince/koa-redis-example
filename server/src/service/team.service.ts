import { db } from "../db/prisma";
import { dataWorker } from "../main";

type TCreateData = {
  userId: number;
  teamName: string;
};

type TJoinData = {
  userId: number;
  teamId: number;
};

type TLeaveData = {
  userId: number;
  teamId: number;
};

export async function createTeam(data: TCreateData) {
  const { userId, teamName } = data;
  const user = await db.user.findUnique({ where: { id: userId } });

  if (!user) throw new Error("User not found");
  if (!user.isLoggedIn) throw new Error("User must be logged in");

  const newTeam = await db.team.create({
    data: {
      name: teamName,
      members: { connect: { id: user.id } },
    },
  });

  await db.user.update({
    where: { id: user.id },
    data: { teams: { connect: { id: newTeam.id } } },
  });

  return newTeam;
}

export async function joinTeam(data: TJoinData) {
  const { userId, teamId } = data;

  const user = await db.user.findUnique({ where: { id: userId } });

  if (!user) throw new Error("User not found");
  if (!user.isLoggedIn) throw new Error("User must be logged in");

  const team = await db.team.findUnique({
    where: { id: teamId },
    include: { members: true },
  });
  if (!team) throw new Error("Team not found");

  let isUserOnTeam = false;
  for (let i = 0; i < team.members.length; ++i) {
    const teamMember = team.members[i];
    if (teamMember.id === userId) {
      isUserOnTeam = true;
      break;
    }
  }

  if (isUserOnTeam) {
    throw new Error("User is on this team already");
  }

  const updatedTeam = await db.team.update({
    where: { id: teamId },
    data: { members: { connect: { id: user.id } } },
  });

  const updatedUser = await db.user.update({
    where: { id: userId },
    data: { teams: { connect: { id: teamId } } },
  });

  return { user: updatedUser, team: updatedTeam };
}

export async function leaveTeam(data: TLeaveData) {
  const { userId, teamId } = data;

  const user = await db.user.findUnique({ where: { id: userId } });

  if (!user) throw new Error("User not found");
  if (!user.isLoggedIn) throw new Error("User must be logged in");

  const team = await db.team.findUnique({
    where: { id: teamId },
    include: { members: true },
  });
  if (!team) throw new Error("Team not found");

  let isUserOnTeam = false;
  for (let i = 0; i < team.members.length; ++i) {
    const teamMember = team.members[i];
    if (teamMember.id === userId) {
      isUserOnTeam = true;
      break;
    }
  }

  if (!isUserOnTeam) {
    throw new Error("User is not on this team");
  }

  const updatedTeam = await db.team.update({
    where: { id: teamId },
    data: { members: { disconnect: { id: user.id } } },
  });

  const updatedUser = await db.user.update({
    where: { id: userId },
    data: { teams: { disconnect: { id: teamId } } },
  });

  return { user: updatedUser, team: updatedTeam };
}

export async function getMessages(userId: number, teamId: number) {
  const team = await db.team.findUnique({
    where: { id: teamId },
    include: { members: true },
  });

  if (!team) throw new Error("Team not found");

  let isUserOnTeam = false;
  for (const user of team.members) {
    if (user.id === userId) {
      isUserOnTeam = true;
      break;
    }
  }

  if (!isUserOnTeam) {
    throw new Error("User not on team");
  }

  const messages: Array<string> = [];
  const teamMessages = await db.teamMessage.findMany({
    where: { teamId: teamId },
    include: { message: true },
  });

  if (teamMessages && teamMessages.length > 0) {
    for (const message of teamMessages) {
      messages.push(message.message.message);
    }
  }

  await dataWorker.lrange(
    `chat:team-${teamId.toString()}:messages`,
    0,
    -1,
    (err, data) => {
      if (err) {
        console.error(err);
        return;
      }

      if (data && data.length > 0) {
        for (const messageData of data) {
          const { message } = JSON.parse(messageData);
          messages.push(message);
        }
      }
    }
  );

  return messages;
}
