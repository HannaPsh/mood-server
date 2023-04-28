import express from 'express';
import controller from '../controllers/User';
import { Schemas, ValidateJoi } from '../middleware/Joi';

const router = express.Router();

router.post('/create', ValidateJoi(Schemas.user.createUser), controller.createUser);
router.get('/get/:userId', controller.readUser);
router.get('/allusers', controller.readAll);
router.patch('/update/:userId', ValidateJoi(Schemas.user.updateUser), controller.updateUser);
router.delete('/delete/:userId', controller.deleteUser);
router.patch('/update-dailylog/:userId/:date', ValidateJoi(Schemas.user.updateDailyLog), controller.updateDailyLog);

export = router;
