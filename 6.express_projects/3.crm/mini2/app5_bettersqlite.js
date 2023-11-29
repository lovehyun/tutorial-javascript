const express = require('express');
const nunjucks = require('nunjucks');
const sqlite = require('better-sqlite3');
const db = new sqlite('users.db');

const app = express();
const port = 3000;

// Nunjucks 설정
nunjucks.configure('views', {
    autoescape: true,
    express: app,
});

app.get('/', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const searchName = req.query.name || '';
    const itemsPerPage = 10;

    // SQL 쿼리를 사용하여 데이터를 가져옴
    const stmt = db.prepare('SELECT * FROM users WHERE Name LIKE ?');
    const data = stmt.all(`%${searchName}%`);

    const fieldnames = Object.keys(data[0] || {});
    const totalItems = data.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = data.slice(startIndex, endIndex);

    res.render('index4.html', {
        fieldnames,
        data: paginatedData,
        search_name: searchName,
        page,
        total_pages: totalPages,
    });
});

app.get('/user/:id', (req, res) => {
    const userId = req.params.id;

    // SQL 쿼리를 사용하여 특정 사용자 데이터를 가져옴
    const stmt = db.prepare('SELECT * FROM users WHERE Id = ?');
    const user = stmt.get(userId);

    if (!user) {
        return res.status(404).send('User not found');
    }

    res.render('user_detail3.html', { user });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
