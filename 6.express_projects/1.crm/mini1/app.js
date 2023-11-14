// npm install express nunjucks fs csv-parser
const express = require('express');
const nunjucks = require('nunjucks');
const fs = require('fs');
const csv = require('csv-parser');

const app = express();
const port = 3000;

app.use(express.static('public'));

nunjucks.configure('views', {
    autoescape: true,
    express: app
});

app.get('/', (req, res) => {
    const data = [];
    fs.createReadStream('data.csv', 'utf-8')
        .pipe(csv())
        .on('data', (row) => {
            const cleanRow = {};
            for (const [key, value] of Object.entries(row)) {
                cleanRow[key.trim()] = value.trim();
            }
            data.push(cleanRow);
        })
        .on('end', () => {
            res.render('index.html', { data: data });
        });
});

app.get('/another', (req, res) => {
    const data = [];
    fs.createReadStream('data.csv', 'utf-8')
        .pipe(csv())
        .on('headers', (headers) => {
            const header = headers.map(header => header.trim());
            csv()
                .fromFile('data.csv')
                .on('json', (row) => {
                    const cleanRow = {};
                    header.forEach((key) => {
                        cleanRow[key] = row[key].trim();
                    });
                    data.push(cleanRow);
                })
                .on('done', () => {
                    res.render('index.html', { data: data });
                });
        });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
