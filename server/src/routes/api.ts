import Router from "koa-router";
import Koa from "koa";
import { state } from "../middleware/state";
import { AuthRouter } from "./auth.router";
import { TeamRouter } from "./team.router";
import { UserRouter } from "./user.router";

const router = new Router({ prefix: "/api" });

router.get("/healthcheck", async (ctx: Koa.Context) => {
  ctx.status = 200;
  ctx.body = { status: "ok" };
});

router.use("/auth", AuthRouter);

router.use(state);
router.use("/user", UserRouter);
router.use("/team", TeamRouter);

export const ApiRoutes = router.routes();
