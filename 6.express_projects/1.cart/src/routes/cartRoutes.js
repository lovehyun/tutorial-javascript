// src/routes/cartRoutes.js

import express from 'express';
import { getCart, addToCart, updateCartItem, removeFromCart } from '../controllers/cartController.js';
import { checkLogin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use('/', checkLogin);

router.get('/', getCart);
router.post('/:productId', addToCart);
router.put('/:productId', updateCartItem);
router.delete('/:productId', removeFromCart);

export default router;
