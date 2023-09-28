import Router from "koa-router";
import Koa from "koa";
import {
  createTeam,
  getMessages,
  joinTeam,
  leaveTeam,
} from "../service/team.service";

const router = new Router();

router.post("/", async (ctx: Koa.Context) => {
  const { userId, teamName } = ctx.request.body;

  if (typeof userId !== "number" || typeof teamName !== "string") {
    ctx.throw(400, "userId must be a number and teamName must be a string");
  }

  const newTeam = await createTeam({ userId, teamName });

  ctx.status = 201;
  ctx.body = newTeam;
});

router.post("/:id/join", async (ctx: Koa.Context) => {
  const { userId } = ctx.request.body;
  const teamId = parseInt(ctx.params.id, 10);

  if (typeof userId !== "number" || typeof teamId !== "number") {
    ctx.throw(400, "userId and teamId must be a number");
  }

  try {
    const response = await joinTeam({ userId, teamId });
    ctx.status = 200;
    ctx.body = response;
  } catch (e: any) {
    ctx.throw(500, e.message);
  }
});

router.post("/:id/leave", async (ctx: Koa.Context) => {
  const { userId } = ctx.request.body;
  const teamId = parseInt(ctx.params.id, 10);

  if (typeof userId !== "number" || typeof teamId !== "number") {
    ctx.throw(400, "userId and teamId must be a number");
  }

  try {
    const response = await leaveTeam({ userId, teamId });
    ctx.status = 200;
    ctx.body = response;
  } catch (e: any) {
    ctx.throw(500, e.message);
  }
});

router.get("/:id/messages", async (ctx: Koa.Context) => {
  const userId = ctx.state.user.id;
  const teamId = parseInt(ctx.params.id, 10);
  const messages = await getMessages(+userId, teamId);

  ctx.status = 200;
  ctx.body = { messages };
});

export const TeamRouter = router.routes();
