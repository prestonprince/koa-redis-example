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
exports.getMessages = exports.leaveTeam = exports.joinTeam = exports.createTeam = void 0;
const prisma_1 = require("../db/prisma");
const main_1 = require("../main");
function createTeam(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId, teamName } = data;
        const user = yield prisma_1.db.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new Error("User not found");
        if (!user.isLoggedIn)
            throw new Error("User must be logged in");
        const newTeam = yield prisma_1.db.team.create({
            data: {
                name: teamName,
                members: { connect: { id: user.id } },
            },
        });
        yield prisma_1.db.user.update({
            where: { id: user.id },
            data: { teams: { connect: { id: newTeam.id } } },
        });
        return newTeam;
    });
}
exports.createTeam = createTeam;
function joinTeam(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId, teamId } = data;
        const user = yield prisma_1.db.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new Error("User not found");
        if (!user.isLoggedIn)
            throw new Error("User must be logged in");
        const team = yield prisma_1.db.team.findUnique({
            where: { id: teamId },
            include: { members: true },
        });
        if (!team)
            throw new Error("Team not found");
        let isUserOnTeam = false;
        for (let i = 0; i < team.members.length; ++i) {
            const teamMember = team.members[i];
            if (teamMember.id === userId) {
                isUserOnTeam = true;
                break;
            }
        }
        if (isUserOnTeam) {
            throw new Error("User is on this team already");
        }
        const updatedTeam = yield prisma_1.db.team.update({
            where: { id: teamId },
            data: { members: { connect: { id: user.id } } },
        });
        const updatedUser = yield prisma_1.db.user.update({
            where: { id: userId },
            data: { teams: { connect: { id: teamId } } },
        });
        return { user: updatedUser, team: updatedTeam };
    });
}
exports.joinTeam = joinTeam;
function leaveTeam(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId, teamId } = data;
        const user = yield prisma_1.db.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new Error("User not found");
        if (!user.isLoggedIn)
            throw new Error("User must be logged in");
        const team = yield prisma_1.db.team.findUnique({
            where: { id: teamId },
            include: { members: true },
        });
        if (!team)
            throw new Error("Team not found");
        let isUserOnTeam = false;
        for (let i = 0; i < team.members.length; ++i) {
            const teamMember = team.members[i];
            if (teamMember.id === userId) {
                isUserOnTeam = true;
                break;
            }
        }
        if (!isUserOnTeam) {
            throw new Error("User is not on this team");
        }
        const updatedTeam = yield prisma_1.db.team.update({
            where: { id: teamId },
            data: { members: { disconnect: { id: user.id } } },
        });
        const updatedUser = yield prisma_1.db.user.update({
            where: { id: userId },
            data: { teams: { disconnect: { id: teamId } } },
        });
        return { user: updatedUser, team: updatedTeam };
    });
}
exports.leaveTeam = leaveTeam;
function getMessages(userId, teamId) {
    return __awaiter(this, void 0, void 0, function* () {
        const team = yield prisma_1.db.team.findUnique({
            where: { id: teamId },
            include: { members: true },
        });
        if (!team)
            throw new Error("Team not found");
        let isUserOnTeam = false;
        for (const user of team.members) {
            if (user.id === userId) {
                isUserOnTeam = true;
                break;
            }
        }
        if (!isUserOnTeam) {
            throw new Error("User not on team");
        }
        const messages = [];
        const teamMessages = yield prisma_1.db.teamMessage.findMany({
            where: { teamId: teamId },
            include: { message: true },
        });
        if (teamMessages && teamMessages.length > 0) {
            for (const message of teamMessages) {
                messages.push(message.message.message);
            }
        }
        yield main_1.dataWorker.lrange(`chat:team-${teamId.toString()}:messages`, 0, -1, (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            if (data && data.length > 0) {
                for (const messageData of data) {
                    const { message } = JSON.parse(messageData);
                    messages.push(message);
                }
            }
        });
        return messages;
    });
}
exports.getMessages = getMessages;
