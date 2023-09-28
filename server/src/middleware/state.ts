import Koa from "koa";
import { db } from "../db/prisma";

export async function state(ctx: Koa.Context, next: () => Promise<void>) {
  const userId = ctx.request.headers.userid;
  if (!userId) ctx.throw(403, "User must be logged in");
  if (typeof userId !== "string") {
    ctx.throw(403, "User must be logged in");
  }

  const user = await db.user.findUnique({
    where: { id: parseInt(userId, 10) },
  });
  if (!user) ctx.throw(404, "Could not find user");

  ctx.state.user = user;
  await next();
}
