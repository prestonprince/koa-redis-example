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
exports.handleTeamMessage = exports.handleJoinTeam = void 0;
const publisher_1 = require("../../redis/publisher/publisher");
const main_1 = require("../../main");
function handleJoinTeam(payload, user, socket) {
    return __awaiter(this, void 0, void 0, function* () {
        const { teamId } = payload;
        if (!teamId)
            return;
        const isUserOnTeam = user === null || user === void 0 ? void 0 : user.teams.find((team) => team.id === teamId);
        if (!isUserOnTeam)
            return;
        const room = `chat:team-${Number(teamId)}:messages`;
        socket.join(room);
        console.log(`user ${user === null || user === void 0 ? void 0 : user.id} joined room: ` + room);
    });
}
exports.handleJoinTeam = handleJoinTeam;
function handleTeamMessage(payload, socket) {
    return __awaiter(this, void 0, void 0, function* () {
        const { message, teamId, userId } = payload;
        if (!message || !teamId || !userId) {
            return;
        }
        const messageData = JSON.stringify({
            message: message.toString(),
            senderId: socket.id,
            userId,
        });
        const channel = `chat:team-${teamId}:messages`;
        yield (0, publisher_1.publishMessage)(channel, messageData, main_1.pubClient);
    });
}
exports.handleTeamMessage = handleTeamMessage;
