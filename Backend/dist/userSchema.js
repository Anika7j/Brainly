"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.connect("mongodb+srv://anikajain1307:u8qzPK05it3Lr2Py@cluster1.oeq3xfw.mongodb.net/");
const userSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
