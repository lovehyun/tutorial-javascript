const express = require('express');
const router = express.Router();
const { Store } = require('../database');

router.get('/', async (req, res) => {
    try {
        const currentPage = req.query.page || 1;
        const perPage = 20;
        const offset = (currentPage - 1) * perPage;

        const store = new Store();

        // stores 데이터베이스에서 현재 페이지에 해당하는 데이터를 가져오는 쿼리
        const storesQuery = `SELECT * FROM stores LIMIT ${perPage} OFFSET ${offset}`;
        const stores = await store.executeQuery(storesQuery);

        // stores 총 개수를 가져오는 쿼리
        const countQuery = `SELECT COUNT(*) AS count FROM stores`;
        const totalCount = (await store.executeQuery(countQuery)).count;

        const pagination = {
            items: stores,
            totalItems: totalCount,
            currentPage: parseInt(currentPage),
            totalPages: Math.ceil(totalCount / perPage),
        };

        res.render('stores', { pagination });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/:store_id', async (req, res) => {
    try {
        const storeId = req.params.store_id;
        
        const store = new Store();
        
        const queryStore = `SELECT * FROM stores WHERE id = ?`;
        const store_data = await store.executeQuery(queryStore, [ storeId ]);

        if (!store_data) {
            return res.redirect('/stores');
        }

        const revMonth = req.query.rev_month;
        let query =
            'SELECT substr(orders.orderat, 1, 7) as month, ' +
            'sum(items.unitprice) as revenue, ' +
            'count(*) as count ' +
            'FROM order_items ' +
            'JOIN items ON order_items.itemid = items.id ' +
            'JOIN orders ON order_items.orderid = orders.id ' +
            `WHERE orders.storeid = $storeId `;

        if (revMonth) {
            query += `AND substr(orders.orderat, 1, 7) = '${revMonth}' `;
        }

        query += 'GROUP BY substr(orders.orderat, 1, 7) ORDER BY substr(orders.orderat, 1, 7)';

        const revenues = await store.executeQuery(query, [ storeId ]);
        console.log(store_data, revenues);

        res.render('store_detail', {
            store: store_data[0],
            revenues: revenues,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
