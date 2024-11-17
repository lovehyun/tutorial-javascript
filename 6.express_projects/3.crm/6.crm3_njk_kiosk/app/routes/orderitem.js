const express = require('express');
const router = express.Router();
const { OrderItem } = require('../database');

router.get('/', async (req, res) => {
    try {
        const currentPage = req.query.page || 1;
        const perPage = 20;
        const offset = (currentPage - 1) * perPage;

        const orderItem = new OrderItem();

        // order_items 데이터베이스에서 현재 페이지에 해당하는 데이터를 가져오는 쿼리
        const orderItemsQuery = `SELECT * FROM order_items LIMIT ${perPage} OFFSET ${offset}`;
        const orderItems = await orderItem.executeQuery(orderItemsQuery);

        // order_items 총 개수를 가져오는 쿼리
        const countQuery = `SELECT COUNT(*) AS count FROM order_items`;
        const totalCount = (await orderItem.executeQuery(countQuery)).count;

        const pagination = {
            items: orderItems,
            totalItems: totalCount,
            currentPage: parseInt(currentPage),
            totalPages: Math.ceil(totalCount / perPage),
        };

        res.render('orderitems', { pagination });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
