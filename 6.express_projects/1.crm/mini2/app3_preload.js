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

let data = [];

// 파일을 읽어 데이터를 메모리에 로드하는 함수
function loadDataIntoMemory() {
    const readStream = fs.createReadStream('data.csv', 'utf-8');
    
    readStream
        .pipe(csv())
        .on('data', (row) => {
            data.push(row);
        })
        .on('end', () => {
            console.log('Data loaded into memory');
        })
        .on('error', (error) => {
            console.error(error.message);
        });
}

// 서버 시작 시 파일 데이터를 메모리에 로드
loadDataIntoMemory();

app.get('/', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const itemsPerPage = 10;

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
});

app.get('/user/:id', (req, res) => {
    const userId = req.params.id;
    const user = data.find((row) => row.Id === userId);

    if (user) {
        res.render('user_detail3.html', { user });
    } else {
        res.status(404).send('User not found');
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
