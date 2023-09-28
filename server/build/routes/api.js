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
exports.ApiRoutes = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
const auth_router_1 = require("./auth.router");
const team_router_1 = require("./team.router");
const state_1 = require("../middleware/state");
const router = new koa_router_1.default({ prefix: "/api" });
router.get("/healthcheck", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.status = 200;
    ctx.body = { status: "ok" };
}));
router.use("/auth", auth_router_1.AuthRouter);
router.use(state_1.state);
router.use("/team", team_router_1.TeamRouter);
exports.ApiRoutes = router.routes();
