const express = require('express');
const nunjucks = require('nunjucks');
const csv = require('csv-parser');
const fs = require('fs');

const app = express();
const port = 3000;

nunjucks.configure('views', {
    autoescape: true,
    express: app,
});

app.get('/', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const itemsPerPage = 10;
    const data = [];

    fs.createReadStream('data.csv', 'utf-8')
        .pipe(csv())
        .on('data', (row) => {
            data.push(row);
        })
        .on('end', () => {
            const fieldnames = Object.keys(data[0] || {});
            const totalItems = data.length;
            const totalPages = Math.ceil(totalItems / itemsPerPage);
            const startIndex = (page - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const paginatedData = data.slice(startIndex, endIndex);

            res.render('index3.html', {
                fieldnames,
                data: paginatedData,
                page,
                total_pages: totalPages,
            });
        })
        .on('error', (error) => {
            console.error(error.message);
            res.status(500).send('Internal Server Error');
        });
});

app.get('/user/:id', (req, res) => {
    const userId = req.params.id;
    const user = [];

    fs.createReadStream('data.csv', 'utf-8')
        .pipe(csv())
        .on('data', (row) => {
            if (row.Id === userId) {
                user.push(row);
            }
        })
        .on('end', () => {
            if (user.length > 0) {
                res.render('user_detail3.html', { user: user[0] });
            } else {
                res.status(404).send('User not found');
            }
        })
        .on('error', (error) => {
            console.error(error.message);
            res.status(500).send('Internal Server Error');
        });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
