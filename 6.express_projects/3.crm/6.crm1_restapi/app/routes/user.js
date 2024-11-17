const express = require('express');
const router = express.Router();
const { User } = require('../database/model');

// GET: /users
router.get('/', async (req, res) => {
    try {
        const currentPage = parseInt(req.query.page) || 1;
        const name = req.query.name || '';
        const gender = req.query.gender || null;

        let query = "SELECT * FROM users WHERE 1=1";
        let countQuery = "SELECT COUNT(*) AS count FROM users WHERE 1=1";

        if (name) {
            query += ` AND name LIKE '${name}%'`;
            countQuery += ` AND name LIKE '${name}%'`;
        }
        if (gender) {
            query += ` AND gender='${gender}'`;
            countQuery += ` AND gender='${gender}'`;
        }

        const perPage = 20;
        const offset = (currentPage - 1) * perPage;
        query += ` LIMIT ${perPage} OFFSET ${offset}`;

        const user = new User();
        const users = await user.executeQuery(query);
        const countResult = await user.executeQuery(countQuery);

        // Ensure countResult has a valid structure
        const totalCount = countResult[0]?.count || 0;

        res.json({
            items: users,
            totalItems: totalCount,
            currentPage,
            totalPages: Math.ceil(totalCount / perPage),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET: /users/:user_id
router.get('/:user_id', async (req, res) => {
    try {
        const user_id = req.params.user_id;
        const query = `SELECT * FROM users WHERE id = ?`;

        const user = new User();
        const result = await user.executeQuery(query, [user_id]);

        if (result.length > 0) {
            res.json({ user: result[0] });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
