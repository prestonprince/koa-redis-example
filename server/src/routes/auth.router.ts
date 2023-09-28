import Router from "koa-router";
import Koa from "koa";
import { loginUser, logoutUser } from "../service/auth.service";

const router = new Router();

router.post("/login", async (ctx: Koa.Context) => {
  const { username } = ctx.request.body;

  if (typeof username !== "string") {
    ctx.throw(400, "Username must be a string");
  }

  const response = await loginUser({ username });

  if (response.user) {
    ctx.cookies.set("userId", String(response.user.id), { httpOnly: true });
  }

  ctx.status = 200;
  ctx.body = response;
});

router.post("/logout", async (ctx: Koa.Context) => {
  const { username } = ctx.request.body;

  if (typeof username !== "string") {
    ctx.throw(400, "Username must be a string");
  }

  const isLoggedOut = await logoutUser({ username });

  if (!isLoggedOut) ctx.throw(500, "Something went wrong");

  ctx.cookies.set("userId");
  ctx.state.user = null;
  ctx.status = 200;
  ctx.body = { message: "User logged out successfully" };
});

export const AuthRouter = router.routes();
