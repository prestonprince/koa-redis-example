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
exports.publishMessage = exports.addRedisPublisher = void 0;
const ioredis_1 = require("ioredis");
function addRedisPublisher() {
    const pubClient = new ioredis_1.Redis();
    pubClient.on("error", (err) => {
        console.log(err);
    });
    return pubClient;
}
exports.addRedisPublisher = addRedisPublisher;
function publishMessage(channel, data, pubClient) {
    return __awaiter(this, void 0, void 0, function* () {
        yield pubClient.publish(channel, data);
    });
}
exports.publishMessage = publishMessage;
