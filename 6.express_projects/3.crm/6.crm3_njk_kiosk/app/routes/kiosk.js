// routes/kiosk.js
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { Item, Order, OrderItem } = require('../database');

// 상품 목록 페이지
router.get('/', async (req, res) => {
    try {
        const items = await new Item().executeQuery(`SELECT * FROM items`);
        res.render('kiosk', { items });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// 주문 처리 페이지
router.post('/order', async (req, res) => {
    try {
        const { items } = req.body; // 선택된 상품 정보
        const newOrder = new Order();
        const orderId = uuidv4(); // 고유한 주문 ID 생성

        // 주문 및 주문 항목 추가
        await newOrder.executeQuery(`INSERT INTO orders (id, orderat) VALUES (?, ?)`, [orderId, new Date()]);
        for (const item of items) {
            await new OrderItem().executeQuery(`INSERT INTO order_items (orderid, itemid) VALUES (?, ?)`, [orderId, item.id]);
        }
        res.redirect('/kiosk/success');
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to place order');
    }
});

// 주문 성공 페이지
router.get('/success', (req, res) => {
    res.render('order_success');
});

module.exports = router;
