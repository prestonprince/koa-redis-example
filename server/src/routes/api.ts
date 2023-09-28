import Router from "koa-router";
import Koa from "koa";
import { AuthRouter } from "./auth.router";
import { TeamRouter } from "./team.router";
import { state } from "../middleware/state";

const router = new Router({ prefix: "/api" });

router.get("/healthcheck", async (ctx: Koa.Context) => {
  ctx.status = 200;
  ctx.body = { status: "ok" };
});

router.use("/auth", AuthRouter);

router.use(state);
router.use("/team", TeamRouter);

export const ApiRoutes = router.routes();
