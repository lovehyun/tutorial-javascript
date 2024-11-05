const express = require('express');
const router = express.Router();
const { Store } = require('../database/model');

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

module.exports = router;
