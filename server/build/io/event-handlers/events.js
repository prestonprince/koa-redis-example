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
exports.handleEvents = void 0;
const team_events_1 = require("./team-events");
function handleEvents(socket, limiter, user) {
    // handle team room join
    socket.on("join:tm", (payload) => __awaiter(this, void 0, void 0, function* () { return yield (0, team_events_1.handleJoinTeam)(payload, user, socket); }));
    // handle team message
    socket.on("message:tm", (payload) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield limiter.consume(socket.id); // Consume 1 point per event
        }
        catch (e) {
            socket.emit("too many requests");
            return;
        }
        yield (0, team_events_1.handleTeamMessage)(payload, socket);
    }));
}
exports.handleEvents = handleEvents;
