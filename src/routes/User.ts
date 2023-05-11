import express from 'express';
import controller from '../controllers/User';
import { Schemas, ValidateJoi } from '../middleware/Joi';

const router = express.Router();

router.post('/create', ValidateJoi(Schemas.user.createUser), controller.createUser);
router.post('/login', ValidateJoi(Schemas.user.login), controller.login);
router.get('/get/:userId', controller.readUser);
router.get('/allMoodUsers', controller.readAll);
router.patch('/update/:userId', ValidateJoi(Schemas.user.updateUser), controller.updateUser);
router.delete('/delete/:userId', controller.deleteUser);
router.patch('/update-dailylog/:userId/:category' /* , ValidateJoi(Schemas.user.updateDailyLog) */, controller.updateDailyLog);
router.get('/emotions/:userId/:category', controller.getEmotionsByCategory);
router.get('/dailylog/:userId', controller.getDailyLog);
export = router;
