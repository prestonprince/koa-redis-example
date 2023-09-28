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
exports.io = exports.dataWorker = exports.subClient = exports.pubClient = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const koa_1 = __importDefault(require("koa"));
const koa_body_1 = __importDefault(require("koa-body"));
const cors_1 = __importDefault(require("@koa/cors"));
const koa_json_1 = __importDefault(require("koa-json"));
const http_1 = __importDefault(require("http"));
const publisher_1 = require("./redis/publisher/publisher");
const subscriber_1 = require("./redis/subscriber/subscriber");
const api_1 = require("./routes/api");
const socket_1 = require("./io/socket");
const redis_data_1 = require("./redis/data/redis.data");
dotenv_1.default.config();
const PORT = parseInt(process.env.PORT || "3001", 10);
exports.pubClient = (0, publisher_1.addRedisPublisher)();
exports.subClient = (0, subscriber_1.addRedisSubscriber)();
exports.dataWorker = (0, redis_data_1.addRedisDataWorker)();
const app = new koa_1.default();
app.use((0, cors_1.default)());
app.use((0, koa_body_1.default)({
    formLimit: "1mb",
    includeUnparsed: true,
    multipart: true,
    formidable: {
        maxFileSize: 200 * 1024 * 1024,
        keepExtensions: true, // Extensions to save images
    },
}));
app.use((0, koa_json_1.default)());
app.use(api_1.ApiRoutes);
const server = http_1.default.createServer(app.callback());
exports.io = (0, socket_1.addSocketIO)(server);
server.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
process.on("beforeExit", () => __awaiter(void 0, void 0, void 0, function* () {
    yield Promise.all([
        exports.pubClient.disconnect(),
        exports.subClient.disconnect(),
        exports.dataWorker.disconnect(),
    ]);
}));
