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
exports.removeUserFromCache = exports.setUserInCache = exports.getUserFromCache = exports.checkListLength = exports.addTeamMessageToList = exports.transferTeamMessages = exports.addRedisDataWorker = void 0;
const ioredis_1 = require("ioredis");
const message_service_1 = require("../../service/message.service");
const teamMessage_servive_1 = require("../../service/teamMessage.servive");
const main_1 = require("../../main");
function addRedisDataWorker() {
    const dataWorker = new ioredis_1.Redis();
    dataWorker.on("error", (err) => {
        console.error(err);
    });
    return dataWorker;
}
exports.addRedisDataWorker = addRedisDataWorker;
function transferTeamMessages(channel, listLength) {
    return __awaiter(this, void 0, void 0, function* () {
        for (let i = 0; i <= listLength; ++i) {
            const messageData = yield main_1.dataWorker.lpop(channel);
            if (messageData) {
                const { message, teamId, userId } = JSON.parse(messageData);
                const createdMessage = yield (0, message_service_1.createMessage)({ userId: +userId, message });
                if (!createdMessage) {
                    throw new Error("could not create message in db");
                }
                const createdTeamMessage = yield (0, teamMessage_servive_1.createTeamMessage)({
                    messageId: createdMessage.id,
                    teamId: +teamId,
                });
                if (!createdTeamMessage) {
                    throw new Error("could not create team message in db");
                }
            }
        }
    });
}
exports.transferTeamMessages = transferTeamMessages;
function addTeamMessageToList(channel, messageData) {
    return __awaiter(this, void 0, void 0, function* () {
        yield main_1.dataWorker.rpush(channel, JSON.stringify(messageData));
    });
}
exports.addTeamMessageToList = addTeamMessageToList;
function checkListLength(listName) {
    return __awaiter(this, void 0, void 0, function* () {
        const listLength = yield main_1.dataWorker.llen(listName);
        return listLength;
    });
}
exports.checkListLength = checkListLength;
function getUserFromCache(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield main_1.dataWorker.get(userId);
        return user;
    });
}
exports.getUserFromCache = getUserFromCache;
function setUserInCache(user) {
    return __awaiter(this, void 0, void 0, function* () {
        if (user) {
            yield main_1.dataWorker.set(String(user.id), JSON.stringify(user), "EX", 60 * 60);
        }
    });
}
exports.setUserInCache = setUserInCache;
function removeUserFromCache(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield main_1.dataWorker.del(userId);
    });
}
exports.removeUserFromCache = removeUserFromCache;
