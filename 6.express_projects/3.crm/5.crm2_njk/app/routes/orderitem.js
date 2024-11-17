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

// 특정 주문 항목의 상세 정보를 조회하는 라우트
router.get('/:order_id', async (req, res) => {
    try {
        const orderId = req.params.order_id;

        // OrderItem 인스턴스를 통해 쿼리를 실행
        const orderItemModel = new OrderItem();

        // 주문 항목 정보 조회
        const orderitems = await orderItemModel.executeQuery(`
            SELECT order_items.Id, order_items.OrderId, order_items.ItemId, items.Name AS item_name
            FROM order_items
            JOIN items ON order_items.ItemId = items.Id
            WHERE order_items.OrderId = ?
        `, [orderId]);

        orderItemModel.close(); // 쿼리 실행 후 데이터베이스 연결 닫기

        if (orderitems.length === 0) {
            // 주문 항목이 존재하지 않는 경우
            return res.status(404).send('Order items not found');
        }

        // 주문 항목 정보와 아이템 이름 데이터를 템플릿에 전달
        res.render('orderitem_detail', { orderitems });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
