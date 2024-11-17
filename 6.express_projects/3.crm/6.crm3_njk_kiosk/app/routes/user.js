const express = require('express');
const router = express.Router();
const { User } = require('../database');

// GET: /users
router.get('/', async (req, res) => {
    try {
        const currentPage = req.query.page || 1;
        const name = req.query.name || '';
        const gender = req.query.gender || null;
        
        // Build query
        let query = "SELECT * FROM users WHERE 1=1";
        let countQuery = "SELECT COUNT(*) AS count FROM users WHERE 1=1";

        // Initialize query variables
        let nameQuery = "";
        let genderQuery = "";

        if (name) {
            nameQuery = ` AND name LIKE '${name}%'`;
            query += nameQuery;
            countQuery += nameQuery;
        }
        if (gender) {
            genderQuery = ` AND gender='${gender}'`;
            query += genderQuery;
            countQuery += genderQuery;
        }

        // Execute query for pagination
        const perPage = 20;
        const offset = (currentPage - 1) * perPage;

        query += ` LIMIT ${perPage} OFFSET ${offset}`;

        // Create an instance of the User model
        const user = new User();

        // Execute queries
        const users = await user.executeQuery(query);
        const users_count = (await user.executeQuery(countQuery)).count;

        // Preserve query parameters for form
        const query_params = { name, gender };

        const pagination = {
            items: users,
            totalItems: users_count,
            currentPage: parseInt(currentPage),
            totalPages: Math.ceil(users_count / perPage),
        };

        res.render('users', { pagination, form: { name, gender }, query: query_params  });

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// GET: /users/:user_id
router.get('/:user_id', async (req, res) => {
    try {
        const user_id = req.params.user_id;
        const query = `SELECT * FROM users WHERE id = ?`;

        // Create an instance of the User model
        const user = new User();

        const result = await user.executeQuery(query, [ user_id ]);
        console.log(result);

        const orderQuery = `SELECT * FROM orders WHERE userid = ?`
        const orders = await user.executeQuery(orderQuery, [ user_id ]);

        if (result.length > 0) {
            const user_data = result[0];
            res.render('user_detail', { user: user_data, orders: orders });
        } else {
            res.redirect('/users');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
