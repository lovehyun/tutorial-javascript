// src/routes/authRoutes.js

import express from 'express';
import { login, logout, checkLogin } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login);
router.get('/logout', logout);
router.get('/check-login', checkLogin);

export default router;
