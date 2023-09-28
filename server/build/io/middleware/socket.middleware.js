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
exports.attachUserObject = exports.attachUserId = void 0;
const redis_data_1 = require("../../redis/data/redis.data");
const user_service_1 = require("../../service/user.service");
function attachUserId(socket, next) {
    // replace with jwt token
    const userId = socket.request.headers.userid;
    if (!userId) {
        next(new Error("unauthorized"));
        return;
    }
    socket.userId = userId;
    next();
}
exports.attachUserId = attachUserId;
function attachUserObject(socket, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = socket.userId;
        if (!userId) {
            next(new Error("unauthorized"));
            return;
        }
        const userFromCache = yield (0, redis_data_1.getUserFromCache)(userId);
        let user;
        if (userFromCache) {
            user = JSON.parse(userFromCache);
        }
        else {
            user = yield (0, user_service_1.getUserWithTeams)(+userId);
            if (!user) {
                next(new Error("user not found"));
                return;
            }
            yield (0, redis_data_1.setUserInCache)(user);
        }
        socket.user = user;
        next();
    });
}
exports.attachUserObject = attachUserObject;
