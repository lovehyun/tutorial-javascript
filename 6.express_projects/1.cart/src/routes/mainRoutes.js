// src/routes/mainRoutes.js

const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController');

router.get('/', mainController.home);
router.get('/home', mainController.home);
router.get('/products', mainController.products);
router.get('/cart', mainController.cart);

module.exports = router;
