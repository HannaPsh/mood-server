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
    const dateToday = new Date().toISOString().slice(0, 10);
    console.log(dateToday);

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let dailyLog = user.dailyLogs.find((log) => log.date.toString().slice(0, 10) === dateToday);
        /* let log = user.dailyLogs.find((log) => console.log(log.date.toString().slice(0, 10))); */
        const { emotions } = req.body;

        if (!dailyLog) {
            dailyLog = {
                date: dateToday,
                emotions: emotions
            };
            user.dailyLogs.push(dailyLog);
        } else {
            dailyLog.emotions = {
                ...dailyLog.emotions,
                ...emotions
            };
        }

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
export default { createUser, readUser, readAll, updateUser, deleteUser, updateDailyLog, login };
