const express = require('express');
const router = express.Router();
const { Order } = require('../database/model');

router.get('/', async (req, res) => {
    try {
        const currentPage = parseInt(req.query.page) || 1;
        const perPage = 20;
        const offset = (currentPage - 1) * perPage;

        const order = new Order();
        const ordersQuery = `SELECT * FROM orders LIMIT ${perPage} OFFSET ${offset}`;
        const countQuery = `SELECT COUNT(*) as count FROM orders`;

        const orders = await order.executeQuery(ordersQuery);
        const countResult = await order.executeQuery(countQuery);

        // Ensure countResult has a valid structure
        const totalCount = countResult[0]?.count || 0;

        res.json({
            items: orders,
            totalItems: totalCount,
            currentPage,
            totalPages: Math.ceil(totalCount / perPage),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
