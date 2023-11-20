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
            const fieldnames = Object.keys(data[0] || {}); // handle case when data is empty
            const totalItems = data.length;
            const totalPages = Math.ceil(totalItems / itemsPerPage);
            const startIndex = (page - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const paginatedData = data.slice(startIndex, endIndex);

            res.render('index2.html', {
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

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
