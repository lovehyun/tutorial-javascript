// src/routes/paymentRoutes.js

import express from 'express';
import { confirmPayment } from '../controllers/paymentController.js';

const router = express.Router();

// 결제 승인 엔드포인트
router.post('/confirm', confirmPayment);

export default router;
