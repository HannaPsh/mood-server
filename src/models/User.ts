import mongoose, { Model, Schema } from 'mongoose';
import { IDailyLog, IUser } from '../types';

const DailyLogSchema = new Schema<IDailyLog>(
    {
        date: { type: Date, required: true },
        emotions: {
            anger: [{ type: String }],
            love: [{ type: String }],
            sadness: [{ type: String }],
            scared: [{ type: String }],
            happy: [{ type: String }]
        }
    },
    { _id: false }
);

const UserSchema: Schema<IUser> = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    dailyLogs: [{ type: DailyLogSchema }]
});

const UserModel: Model<IUser> = mongoose.model<IUser>('User', UserSchema);

export default UserModel;
