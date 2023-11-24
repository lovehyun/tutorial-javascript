// src/routes/paymentRoutes.js
const express = require('express');
const paymentController = require('../controllers/paymentController');

const router = express.Router();

router.post('/toss-payment', paymentController.processPayment);

module.exports = router;
