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
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = __importDefault(require("../models/User"));
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    try {
        const existingUser = yield User_1.default.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'Email already exists' });
        }
        const user = new User_1.default({
            _id: new mongoose_1.default.Types.ObjectId(),
            name,
            email,
            password
        });
        const savedUser = yield user.save();
        res.status(201).json({ user: savedUser });
    }
    catch (error) {
        res.status(500).json({ error });
    }
});
//TODO: add token
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'User is not registered' });
        }
        if (user.password !== password) {
            return res.status(401).json({ message: 'Wrong password' });
        }
        const { _id, name, dailyLogs } = user;
        res.status(200).json({ message: 'Auth successful', user: { id: _id, name: name, email: email, password: password, dailyLogs: dailyLogs } }); //TODO:add JWT instead!!!!
    }
    catch (error) {
        res.status(500).json({ error });
    }
});
const readUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    try {
        const user = yield User_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ user });
    }
    catch (error) {
        res.status(500).json({ error });
    }
});
const readAll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.default.find();
        res.status(200).json({ users });
    }
    catch (error) {
        res.status(500).json({ error });
    }
});
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    try {
        const user = yield User_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.set(req.body);
        const savedUser = yield user.save();
        res.status(200).json({ user: savedUser });
    }
    catch (error) {
        res.status(500).json({ error });
    }
});
const updateDailyLog = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    const category = req.params.category; /* as keyof IDailyLog['emotions'] */
    const dateToday = new Date().toISOString().slice(0, 10);
    try {
        const user = yield User_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        let dailyLog = user.dailyLogs.find((log) => log.date.toString().slice(0, 10) === dateToday);
        const emotionsList = req.body;
        if (!dailyLog) {
            dailyLog = {
                date: dateToday,
                emotions: {
                    anger: [],
                    love: [],
                    sadness: [],
                    scared: [],
                    happy: []
                }
            };
            user.dailyLogs.push(dailyLog);
        }
        const updatedEmotions = Object.assign(Object.assign({}, dailyLog.emotions), { [category]: emotionsList });
        dailyLog.emotions = updatedEmotions;
        const savedUser = yield user.save();
        res.status(200).json({ user: savedUser });
    }
    catch (error) {
        res.status(500).json({ error });
    }
});
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const user = yield User_1.default.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(201).json({ user, message: 'Deleted' });
    }
    catch (error) {
        return res.status(500).json({ error });
    }
});
const getEmotionsByCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    const category = req.params.category;
    const dateToday = new Date().toISOString().slice(0, 10); // Get today's date
    try {
        const user = yield User_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const dailyLogs = user.dailyLogs;
        const emotionsList = dailyLogs.reduce((result, log) => {
            // Check if the log's date matches today's date and retrieve the emotions by category
            if (log.date.toString().slice(0, 10) === dateToday) {
                return result.concat(log.emotions[category]);
            }
            return result;
        }, []);
        res.status(200).json({ emotions: emotionsList });
    }
    catch (error) {
        res.status(500).json({ error });
    }
});
const getDailyLog = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    const date = req.query.date;
    try {
        const user = yield User_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const dailyLog = user.dailyLogs.find((log) => log.date === date);
        if (!dailyLog) {
            return res.status(404).json({ message: 'Daily log not found' });
        }
        res.status(200).json({ dailyLog });
    }
    catch (error) {
        res.status(500).json({ error });
    }
});
exports.default = { createUser, readUser, readAll, updateUser, deleteUser, updateDailyLog, login, getEmotionsByCategory, getDailyLog };
