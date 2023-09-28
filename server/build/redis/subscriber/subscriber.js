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
exports.handleRedisTeamMessage = exports.handleMessagePatterns = exports.handleSubscribeError = exports.addRedisSubscriber = void 0;
const constants_1 = require("../../utils/constants");
const redis_data_1 = require("../data/redis.data");
const redis_data_2 = require("../data/redis.data");
const main_1 = require("../../main");
function addRedisSubscriber() {
    const subClient = main_1.pubClient.duplicate();
    // handle errors
    subClient.on("error", (err) => console.error(err));
    // subscribe to team messages
    subClient.psubscribe(constants_1.TEAM_PATTERN, (err, count) => handleSubscribeError(err, count));
    // handle message patterns
    subClient.on("pmessage", (pattern, channel, payload) => __awaiter(this, void 0, void 0, function* () { return yield handleMessagePatterns(pattern, channel, payload); }));
    return subClient;
}
exports.addRedisSubscriber = addRedisSubscriber;
function handleSubscribeError(err, count) {
    return __awaiter(this, void 0, void 0, function* () {
        if (err) {
            console.error(`Error subscribing to team channels`);
            return;
        }
        console.log(`${count} clients subscribed to team channels`);
    });
}
exports.handleSubscribeError = handleSubscribeError;
function handleMessagePatterns(pattern, channel, payload) {
    return __awaiter(this, void 0, void 0, function* () {
        switch (pattern) {
            // handle team messages
            case constants_1.TEAM_PATTERN:
                yield handleRedisTeamMessage(channel, payload);
                break;
            // add more cases as needed
        }
    });
}
exports.handleMessagePatterns = handleMessagePatterns;
function handleRedisTeamMessage(channel, payload) {
    return __awaiter(this, void 0, void 0, function* () {
        const teamId = channel.split("-")[1].split(":")[0];
        const { message, senderId, userId } = JSON.parse(payload);
        const messageListLength = yield (0, redis_data_1.checkListLength)(channel);
        if (messageListLength >= constants_1.MESSAGE_LIST_LIMIT) {
            yield (0, redis_data_2.transferTeamMessages)(channel, messageListLength);
        }
        yield (0, redis_data_2.addTeamMessageToList)(channel, { message, teamId, userId });
        const room = main_1.io.of("/").adapter.rooms.get(channel);
        if (room) {
            room.forEach((socketId) => {
                if (socketId !== senderId) {
                    main_1.io.to(socketId).emit("message:tm", { message, teamId, userId });
                }
            });
        }
    });
}
exports.handleRedisTeamMessage = handleRedisTeamMessage;
