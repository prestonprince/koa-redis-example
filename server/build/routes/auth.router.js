"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRouter = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
const auth_service_1 = require("../service/auth.service");
const router = new koa_router_1.default();
router.post("/login", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = ctx.request.body;
    if (typeof username !== "string") {
        ctx.throw(400, "Username must be a string");
    }
    const response = yield (0, auth_service_1.loginUser)({ username });
    if (response.user) {
        ctx.cookies.set("userId", String(response.user.id), { httpOnly: true });
    }
    ctx.status = 200;
    ctx.body = response;
}));
router.post("/logout", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = ctx.request.body;
    if (typeof username !== "string") {
        ctx.throw(400, "Username must be a string");
    }
    const isLoggedOut = yield (0, auth_service_1.logoutUser)({ username });
    if (!isLoggedOut)
        ctx.throw(500, "Something went wrong");
    ctx.cookies.set("userId");
    ctx.state.user = null;
    ctx.status = 200;
    ctx.body = { message: "User logged out successfully" };
}));
exports.AuthRouter = router.routes();
