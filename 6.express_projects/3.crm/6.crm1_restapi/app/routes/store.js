const express = require('express');
const router = express.Router();
const { Store } = require('../database/model');

router.get('/', async (req, res) => {
    try {
        const currentPage = parseInt(req.query.page) || 1;
        const perPage = 20;
        const offset = (currentPage - 1) * perPage;

        const store = new Store();
        const storesQuery = `SELECT * FROM stores LIMIT ${perPage} OFFSET ${offset}`;
        const countQuery = `SELECT COUNT(*) AS count FROM stores`;

        const stores = await store.executeQuery(storesQuery);
        const countResult = await store.executeQuery(countQuery);

        // Ensure countResult has a valid structure
        const totalCount = countResult[0]?.count || 0;

        res.json({
            items: stores,
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
