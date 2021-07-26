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
require("dotenv").config();
const index_1 = require("../src/database/index");
const clear = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('[clear]: running.....');
        const db = yield index_1.connectDatabase();
        const members = yield db.members.find({}).toArray();
        const admins = yield db.users.find({}).toArray();
        const organizations = yield db.organizations.find({}).toArray();
        if (members.length > 0) {
            yield db.members.drop();
        }
        if (admins.length > 0) {
            yield db.users.drop();
        }
        if (organizations.length > 0) {
            yield db.organizations.drop();
        }
        console.log("[clear] successfully");
    }
    catch (_a) {
        throw new Error('failed to clear database');
    }
});
clear();
