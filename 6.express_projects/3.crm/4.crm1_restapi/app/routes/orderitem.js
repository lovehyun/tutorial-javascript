const express = require('express');
const router = express.Router();
const { OrderItem } = require('../database/model');

router.get('/', async (req, res) => {
    try {
        const currentPage = parseInt(req.query.page) || 1;
        const perPage = 20;
        const offset = (currentPage - 1) * perPage;

        const orderItem = new OrderItem();
        const orderItemsQuery = `SELECT * FROM order_items LIMIT ${perPage} OFFSET ${offset}`;
        const countQuery = `SELECT COUNT(*) AS count FROM order_items`;

        const orderItems = await orderItem.executeQuery(orderItemsQuery);
        const countResult = await orderItem.executeQuery(countQuery);

        // Ensure countResult has a valid structure
        const totalCount = countResult[0]?.count || 0;

        res.json({
            items: orderItems,
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
