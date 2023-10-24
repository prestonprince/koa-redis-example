import Router from "koa-router";
import Koa from "koa";

const router = new Router();

router.get("/me", async (ctx: Koa.Context) => {
  ctx.status = 200;
  ctx.body = ctx.state.user;
});

export const UserRouter = router.routes();
