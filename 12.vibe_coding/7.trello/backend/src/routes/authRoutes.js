
import express from 'express';
import { authController } from '../controllers/authController.js';
import { authRequired } from '../middlewares/auth.js';

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/sample', authController.sample);
router.get('/me', authRequired, authController.me);

export default router;
