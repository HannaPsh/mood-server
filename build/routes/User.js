"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const User_1 = __importDefault(require("../controllers/User"));
const Joi_1 = require("../middleware/Joi");
const router = express_1.default.Router();
router.post('/create', (0, Joi_1.ValidateJoi)(Joi_1.Schemas.user.createUser), User_1.default.createUser);
router.post('/login', (0, Joi_1.ValidateJoi)(Joi_1.Schemas.user.login), User_1.default.login);
router.get('/get/:userId', User_1.default.readUser);
router.get('/allMoodUsers', User_1.default.readAll);
router.patch('/update/:userId', (0, Joi_1.ValidateJoi)(Joi_1.Schemas.user.updateUser), User_1.default.updateUser);
router.delete('/delete/:userId', User_1.default.deleteUser);
router.patch('/update-dailylog/:userId/:category' /* , ValidateJoi(Schemas.user.updateDailyLog) */, User_1.default.updateDailyLog);
router.get('/emotions/:userId/:category', User_1.default.getEmotionsByCategory);
router.get('/dailylog/:userId', User_1.default.getDailyLog);
module.exports = router;
