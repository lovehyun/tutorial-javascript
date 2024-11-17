const express = require('express');
const router = express.Router();
const { Item } = require('../database');

router.get('/', async (req, res) => {
    try {
        const currentPage = req.query.page || 1;
        const perPage = 20;
        const offset = (currentPage - 1) * perPage;

        const item = new Item();

        // items 데이터베이스에서 현재 페이지에 해당하는 데이터를 가져오는 쿼리
        const itemsQuery = `SELECT * FROM items LIMIT ${perPage} OFFSET ${offset}`;
        const items = await item.executeQuery(itemsQuery);

        // items 총 개수를 가져오는 쿼리
        const countQuery = `SELECT COUNT(*) AS count FROM items`;
        const totalCount = (await item.executeQuery(countQuery)).count;

        const pagination = {
            items: items,
            totalItems: totalCount,
            currentPage: parseInt(currentPage),
            totalPages: Math.ceil(totalCount / perPage),
        };

        res.render('items', { pagination });
        
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
