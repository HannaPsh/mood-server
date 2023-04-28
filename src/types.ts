export interface IDailyLog {
    date: Date;
    emotions: {
        anger: string[];
        love: string[];
        sadness: string[];
        scared: string[];
        happy: string[];
    };
}

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    dailyLogs: IDailyLog[];
}
