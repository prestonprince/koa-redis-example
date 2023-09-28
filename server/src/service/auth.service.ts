import { db } from "../db/prisma";

type TLoginData = {
  username: string;
};

type TLogoutData = {
  username: string;
};

export async function loginUser(data: TLoginData) {
  const { username } = data;

  const user = await db.user.findUnique({
    where: {
      username: username,
    },
  });

  if (user) {
    // User not logged in
    if (!user.isLoggedIn) {
      await db.user.update({
        where: { username },
        data: { isLoggedIn: true },
      });

      return { message: "User logged in", user };
    }

    return { message: "User already logged in" };
  }

  const newUser = await db.user.create({
    data: { username: username, isLoggedIn: true },
  });

  return { message: "User logged in", user: newUser };
}

export async function logoutUser(data: TLogoutData) {
  const { username } = data;

  const user = await db.user.findUnique({ where: { username } });
  if (!user) {
    return false;
  }

  await db.user.update({ where: { username }, data: { isLoggedIn: false } });
  return true;
}
