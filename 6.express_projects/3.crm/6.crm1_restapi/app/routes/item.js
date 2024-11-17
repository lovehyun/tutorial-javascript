const express = require('express');
const router = express.Router();
const { Item } = require('../database/model');

router.get('/', async (req, res) => {
    try {
        const currentPage = parseInt(req.query.page) || 1;
        const perPage = 20;
        const offset = (currentPage - 1) * perPage;

        const item = new Item();
        const itemsQuery = `SELECT * FROM items LIMIT ${perPage} OFFSET ${offset}`;
        const countQuery = `SELECT COUNT(*) AS count FROM items`;

        const items = await item.executeQuery(itemsQuery);
        const countResult = await item.executeQuery(countQuery);

        // Ensure countResult has a valid structure
        const totalCount = countResult[0]?.count || 0;

        res.json({
            items,
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
