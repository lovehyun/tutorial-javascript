// src/routes/mainRoutes.js

import express from 'express';
import { home, products, cart } from '../controllers/mainController.js';

const router = express.Router();

router.get('/', home);
router.get('/home', home);
router.get('/products', products);
router.get('/cart', cart);

export default router;
