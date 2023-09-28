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
exports.TeamRouter = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
const team_service_1 = require("../service/team.service");
const router = new koa_router_1.default();
router.post("/", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, teamName } = ctx.request.body;
    if (typeof userId !== "number" || typeof teamName !== "string") {
        ctx.throw(400, "userId must be a number and teamName must be a string");
    }
    const newTeam = yield (0, team_service_1.createTeam)({ userId, teamName });
    ctx.status = 201;
    ctx.body = newTeam;
}));
router.post("/:id/join", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = ctx.request.body;
    const teamId = parseInt(ctx.params.id, 10);
    if (typeof userId !== "number" || typeof teamId !== "number") {
        ctx.throw(400, "userId and teamId must be a number");
    }
    try {
        const response = yield (0, team_service_1.joinTeam)({ userId, teamId });
        ctx.status = 200;
        ctx.body = response;
    }
    catch (e) {
        ctx.throw(500, e.message);
    }
}));
router.post("/:id/leave", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = ctx.request.body;
    const teamId = parseInt(ctx.params.id, 10);
    if (typeof userId !== "number" || typeof teamId !== "number") {
        ctx.throw(400, "userId and teamId must be a number");
    }
    try {
        const response = yield (0, team_service_1.leaveTeam)({ userId, teamId });
        ctx.status = 200;
        ctx.body = response;
    }
    catch (e) {
        ctx.throw(500, e.message);
    }
}));
router.get("/:id/messages", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = ctx.state.user.id;
    const teamId = parseInt(ctx.params.id, 10);
    const messages = yield (0, team_service_1.getMessages)(+userId, teamId);
    ctx.status = 200;
    ctx.body = { messages };
}));
exports.TeamRouter = router.routes();
