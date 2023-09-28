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
Object.defineProperty(exports, "__esModule", { value: true });
exports.state = void 0;
const prisma_1 = require("../db/prisma");
function state(ctx, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = ctx.request.headers.userid;
        if (!userId)
            ctx.throw(403, "User must be logged in");
        if (typeof userId !== "string") {
            ctx.throw(403, "User must be logged in");
        }
        const user = yield prisma_1.db.user.findUnique({
            where: { id: parseInt(userId, 10) },
        });
        if (!user)
            ctx.throw(404, "Could not find user");
        ctx.state.user = user;
        yield next();
    });
}
exports.state = state;
