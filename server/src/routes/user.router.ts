import Router from "koa-router";
import Koa from "koa";
import { getUserWithTeams } from "../service/user.service";

const router = new Router();

router.get("/me", async (ctx: Koa.Context) => {
  ctx.status = 200;
  ctx.body = ctx.state.user;
});

router.get("/:id/teams", async (ctx: Koa.Context) => {
  const userId = parseInt(ctx.params.id, 10);
  if (!userId) ctx.throw(400, "userId must be present");

  const user = await getUserWithTeams(userId);

  if (!user) {
    ctx.throw(500, "something went really wrong... oops");
  }

  ctx.status = 200;
  ctx.body = user.teams;
});

export const UserRouter = router.routes();
