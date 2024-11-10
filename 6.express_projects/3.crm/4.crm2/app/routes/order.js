const express = require('express');
const router = express.Router();
const { Order } = require('../database');

router.get('/', async (req, res) => {
    try {
        const currentPage = req.query.page || 1;
        const perPage = 20;
        const offset = (currentPage - 1) * perPage;

        const order = new Order();

        // orders 데이터베이스에서 현재 페이지에 해당하는 데이터를 가져오는 쿼리
        const ordersQuery = `SELECT * FROM orders LIMIT ${perPage} OFFSET ${offset}`;
        const orders = await order.executeQuery(ordersQuery);

        // 총 주문 갯수를 가져오기 위해 별도의 쿼리 실행
        const totalCountQuery = 'SELECT COUNT(*) as count FROM orders';
        const totalCount = (await order.executeQuery(totalCountQuery)).count;

        const pagination = {
            items: orders,
            totalItems: totalCount,
            currentPage: parseInt(currentPage),
            totalPages: Math.ceil(totalCount / perPage),
        };

        res.render('orders', { pagination });
        
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// 특정 주문 상세 정보 페이지
router.get('/:order_id', async (req, res) => {
    try {
        const orderId = req.params.order_id;

        const orderModel = new Order();

        // 특정 order_id에 해당하는 주문 정보 조회
        const orders = await orderModel.executeQuery(`
            SELECT * FROM orders WHERE id = ?
        `, [orderId]);

        orderModel.close(); // 쿼리 실행 후 데이터베이스 연결 닫기

        // 조회한 주문 정보를 템플릿으로 렌더링
        res.render('order_detail', { orders });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
