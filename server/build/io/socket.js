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
exports.addSocketIO = void 0;
const socket_io_1 = require("socket.io");
const rate_limiter_flexible_1 = require("rate-limiter-flexible");
const redis_adapter_1 = require("@socket.io/redis-adapter");
const main_1 = require("../main");
const redis_data_1 = require("../redis/data/redis.data");
const socket_middleware_1 = require("./middleware/socket.middleware");
const events_1 = require("./event-handlers/events");
function addSocketIO(server) {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: "*",
        },
    });
    io.adapter((0, redis_adapter_1.createAdapter)(main_1.pubClient, main_1.subClient));
    // middleware
    io.use((socket, next) => (0, socket_middleware_1.attachUserId)(socket, next));
    io.use((socket, next) => __awaiter(this, void 0, void 0, function* () { return yield (0, socket_middleware_1.attachUserObject)(socket, next); }));
    io.on("connection", (socket) => __awaiter(this, void 0, void 0, function* () {
        const user = socket.user;
        if (!user) {
            console.error("no user");
            socket.disconnect(true);
            return;
        }
        console.log(`User with id ${user.id} connected`);
        const limiter = new rate_limiter_flexible_1.RateLimiterMemory({
            points: 5,
            duration: 1, // per second
        });
        (0, events_1.handleEvents)(socket, limiter, user);
        socket.on("disconnect", () => __awaiter(this, void 0, void 0, function* () {
            yield (0, redis_data_1.removeUserFromCache)(String(user.id));
            console.log("user disconnected");
        }));
    }));
    return io;
}
exports.addSocketIO = addSocketIO;
