import Joi, { ObjectSchema } from 'joi';
import { NextFunction, Request, Response } from 'express';
import Logging from '../library/Logging';

export const ValidateJoi = (schema: ObjectSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.validateAsync(req.body);

            next();
        } catch (error) {
            Logging.error(error);

            return res.status(422).json({ error });
        }
    };
};

export const Schemas = {
    user: {
        createUser: Joi.object({
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().required()
        }),
        readUser: Joi.object({
            userId: Joi.string().required()
        }),
        readAll: Joi.object({}),
        updateUser: Joi.object({
            name: Joi.string().required(),
            email: Joi.string().email().required()
        }),
        deleteUser: Joi.object({
            userId: Joi.string().required()
        }),
        /*  updateDailyLog: Joi.object({
            emotions: Joi.array().items(Joi.string()).required()
        }), */
        login: Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().required()
        })
    }
};
