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
exports.logoutUser = exports.loginUser = void 0;
const prisma_1 = require("../db/prisma");
function loginUser(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const { username } = data;
        const user = yield prisma_1.db.user.findUnique({
            where: {
                username: username,
            },
        });
        if (user) {
            // User not logged in
            if (!user.isLoggedIn) {
                yield prisma_1.db.user.update({
                    where: { username },
                    data: { isLoggedIn: true },
                });
                return { message: "User logged in", user };
            }
            return { message: "User already logged in" };
        }
        const newUser = yield prisma_1.db.user.create({
            data: { username: username, isLoggedIn: true },
        });
        return { message: "User logged in", user: newUser };
    });
}
exports.loginUser = loginUser;
function logoutUser(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const { username } = data;
        const user = yield prisma_1.db.user.findUnique({ where: { username } });
        if (!user) {
            return false;
        }
        yield prisma_1.db.user.update({ where: { username }, data: { isLoggedIn: false } });
        return true;
    });
}
exports.logoutUser = logoutUser;
