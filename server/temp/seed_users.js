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
const database_1 = require("../src/database");
const generateData = (num) => {
    const users = [];
    const messages = [];
    try {
        users.push({
            _id: "112830123241869383734",
            token: "75fbd593b9b2afba716f08ee246bd612",
            name: "Anh Than",
            avatar: "https://lh3.googleusercontent.com/a/AATXAJxi_2t2ID6KZBEDMGJ9tCCA_5KncN...",
            contact: "athan@bates.edu",
            isAdmin: true,
        });
        for (let index = 0; index < num; index++) {
            const i = `${index}`;
            users.push({
                _id: i,
                token: i,
                name: i,
                avatar: "https://lh3.googleusercontent.com/a-/AOh14GgbwOMDsJ21KYB26DIbk25MLMmYz...",
                contact: i + "@gmail.com",
                isAdmin: false,
                registering: true,
            });
            messages.push({
                id: i,
                user_id: i,
                avatar: "https://lh3.googleusercontent.com/a/AATXAJwl0WM6RpTdoIFjvzC4QBONMMrMAP...",
                isAdmin: false,
                organization_id: i,
                organization_name: i,
                content: "Thành viên hội người mù xin được cấp quyền từ admin",
            });
        }
        return {
            messages,
            users
        };
    }
    catch (e) {
        throw e;
    }
};
const seed = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { messages, users } = generateData(20);
        console.log('[seed-user] : running...');
        const db = yield database_1.connectDatabase();
        for (const user of users) {
            yield db.users.insertOne(user);
        }
        for (const message of messages) {
            yield db.messages.insertOne(message);
        }
        console.log('[seed-user] : completed');
    }
    catch (_a) {
        throw new Error("failed to seed db");
    }
});
seed();
