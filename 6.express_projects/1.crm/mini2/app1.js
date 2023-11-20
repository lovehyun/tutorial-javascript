// npm install express nunjucks csv-parser
const express = require('express');
const nunjucks = require('nunjucks');
const csv = require('csv-parser');
const fs = require('fs');

const app = express();
const port = 3000;

// Configure Nunjucks template engine
nunjucks.configure('views', {
    autoescape: true,
    express: app,
});

app.use(express.static('public'));

// --> 성능 개선을 위한 측정
// curl -w '\nTime taken: %{time_total}s\n' http://localhost:3000
// Middleware to measure response time
app.use((req, res, next) => {
    const start = Date.now();

    // Attach a listener for when the response is finished
    res.on('finish', () => {
        const end = Date.now();
        const duration = end - start;

        console.log(`Request to ${req.path} took ${duration} ms`);
    });

    // Pass the request to the next middleware
    next();
});
// <-- 성능 개선을 위한 측정

app.get('/', (req, res) => {
    const page = req.query.page || 1;
    const perPage = 10;

    // Read CSV file
    const data = [];
    
    fs.createReadStream('data.csv', 'utf-8')
        .pipe(csv())
        .on('data', (row) => {
            // console.log(row);
            data.push(row);
        })
        .on('end', () => {
            // Calculate total pages
            const totalPages = Math.ceil(data.length / perPage);

            // Calculate start and end indices for the current page
            const startIndex = (page - 1) * perPage;
            const endIndex = startIndex + perPage;

            // Extract rows for the current page
            const currentPageRows = data.slice(startIndex, endIndex);

            res.render('index.html', {
                data: currentPageRows,
                page: parseInt(page),
                total_pages: totalPages,
            });
        });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
