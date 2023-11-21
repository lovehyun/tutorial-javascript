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

app.set('view engine', 'html');

app.get('/', (req, res) => {
    const data = [];
    const fieldnames = [];

    fs.createReadStream('data.csv', 'utf-8')
        .pipe(csv.parse({ headers: true, trim: true, ignoreEmpty: true }))
        .on('headers', (headers) => {
            fieldnames.push(...headers); // 개별 요소를 추가하여 2차원 배열이 아닌 1차원 배열로 데이터 추가
        })
        .on('data', (row) => {
            data.push(row);
        })
        .on('end', () => {
            res.render('index2', { data: data, fieldnames: fieldnames });
        })
        .on('error', (error) => {
            console.error('Error parsing CSV:', error.message);
            res.status(500).send('Internal Server Error');
        });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
