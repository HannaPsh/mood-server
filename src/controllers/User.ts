import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import User from '../models/User';
import { IDailyLog } from '../types';

const createUser = async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({ message: 'Email already exists' });
        }

        const user = new User({
            _id: new mongoose.Types.ObjectId(),
            name,
            email,
            password
        });

        const savedUser = await user.save();

        res.status(201).json({ user: savedUser });
    } catch (error) {
        res.status(500).json({ error });
    }
};
//TODO: add token
const login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'User is not registered' });
        }

        if (user.password !== password) {
            return res.status(401).json({ message: 'Wrong password' });
        }

        const { _id, name, dailyLogs } = user;

        res.status(200).json({ message: 'Auth successful', user: { id: _id, name: name, email: email, password: password, dailyLogs: dailyLogs } }); //TODO:add JWT instead!!!!
    } catch (error) {
        res.status(500).json({ error });
    }
};

const readUser = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ error });
    }
};

const readAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await User.find();

        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ error });
    }
};

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.set(req.body);

        const savedUser = await user.save();

        res.status(200).json({ user: savedUser });
    } catch (error) {
        res.status(500).json({ error });
    }
};

const updateDailyLog = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;
    const category = req.params.category; /* as keyof IDailyLog['emotions'] */
    const dateToday = new Date().toISOString().slice(0, 10);

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let dailyLog: IDailyLog | undefined = user.dailyLogs.find((log: IDailyLog) => log.date.toString().slice(0, 10) === dateToday);

        const emotionsList = req.body as string[];

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

        const updatedEmotions = { ...dailyLog.emotions, [category]: emotionsList };
        dailyLog.emotions = updatedEmotions;

        const savedUser = await user.save();

        res.status(200).json({ user: savedUser });
    } catch (error) {
        res.status(500).json({ error });
    }
};

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.userId;

        const user = await User.findByIdAndDelete(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(201).json({ user, message: 'Deleted' });
    } catch (error) {
        return res.status(500).json({ error });
    }
};

const getEmotionsByCategory = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;
    const category = req.params.category;
    const dateToday = new Date().toISOString().slice(0, 10); // Get today's date

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const dailyLogs = user.dailyLogs;
        const emotionsList = dailyLogs.reduce((result: string[], log: IDailyLog) => {
            // Check if the log's date matches today's date and retrieve the emotions by category
            if (log.date.toString().slice(0, 10) === dateToday) {
                return result.concat(log.emotions[category as keyof typeof log.emotions]);
            }
            return result;
        }, []);

        res.status(200).json({ emotions: emotionsList });
    } catch (error) {
        res.status(500).json({ error });
    }
};
const getDailyLog = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;
    const date = req.query.date as string;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let dailyLog = user.dailyLogs.find((log: IDailyLog) => log.date === date);

        if (!dailyLog) {
            // Create a new daily log with empty arrays for each category
            dailyLog = { date, emotions: { anger: [], love: [], sadness: [], scared: [], happy: [] } };
            user.dailyLogs.push(dailyLog);
            await user.save();
        }

        res.status(200).json({ dailyLog });
    } catch (error) {
        res.status(500).json({ error });
    }
};

const getDailyLogDates = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const dailyLogs = user.dailyLogs;
        const dates = dailyLogs.map((log: IDailyLog) => log.date);

        res.status(200).json({ dates });
    } catch (error) {
        res.status(500).json({ error });
    }
};

export default { createUser, readUser, readAll, updateUser, deleteUser, updateDailyLog, login, getEmotionsByCategory, getDailyLog, getDailyLogDates };
