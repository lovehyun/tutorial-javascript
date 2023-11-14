const express = require('express');
const nunjucks = require('nunjucks');
const fs = require('fs');
const csv = require('fast-csv');

const app = express();
const port = 3000;

app.use(express.static('public'));

nunjucks.configure('views', {
    autoescape: true,
    express: app
});

app.get('/', (req, res) => {
    const data = [];
    const fieldnames = [];

    fs.createReadStream('data.csv', 'utf-8')
        .pipe(csv.parse({ headers: true, ignoreEmpty: true }))
        .on('headers', (headers) => {
            fieldnames.push(...headers);
        })
        .on('data', (row) => {
            data.push(row);
        })
        .on('end', () => {
            res.render('index2.html', { data: data, fieldnames: fieldnames });
        })
        .on('error', (error) => {
            console.error('Error parsing CSV:', error.message);
            res.status(500).send('Internal Server Error');
        });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
