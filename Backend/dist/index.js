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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userSchema_1 = __importDefault(require("./userSchema"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("./config");
const middleware_1 = require("./middleware");
const contentSchema_1 = __importDefault(require("./contentSchema"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post("/api/v1/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const userExist = yield userSchema_1.default.findOne({ username });
    if (userExist) {
        res.status(403).json("User already exist");
    }
    const salt = yield bcryptjs_1.default.genSalt(10);
    const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
    const newUser = yield userSchema_1.default.create({
        username: username,
        password: hashedPassword
    });
    try {
        yield newUser.save();
        const token = jsonwebtoken_1.default.sign({
            id: newUser._id
        }, config_1.JWT_SECRET_KEY);
        res.json({
            message: "User successfully created"
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error saving user",
            error: error.message
        });
    }
}));
app.post("/api/v1/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const salt = yield bcryptjs_1.default.genSalt(10);
    const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
    const existingUser = yield userSchema_1.default.findOne({ username });
    if (!existingUser) {
        res.json({
            message: "User does not exist"
        });
    }
    else {
        const compare = yield bcryptjs_1.default.compare(password, existingUser.password);
        if (compare) {
            const token = jsonwebtoken_1.default.sign({
                id: existingUser._id
            }, config_1.JWT_SECRET_KEY);
            res.json({
                token: token,
                message: "Login successful"
            });
        }
        else {
            res.json({
                message: "Incorrect Password"
            });
        }
    }
}));
//@ts-ignore
app.post("/api/v1/content", middleware_1.userAuthorization, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { link, type, title } = req.body;
    const userId = req.userId;
    const content = yield contentSchema_1.default.create({
        link: link,
        type: type,
        title: title,
        userId,
        tags: []
    });
    yield content.save();
    res.json({
        message: "content added"
    });
}));
//@ts-ignore
app.get("/api/v1/content", middleware_1.userAuthorization, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const content = yield contentSchema_1.default.find({
        userId: userId
    });
    res.json({
        content
    });
}));
app.listen(3000);
