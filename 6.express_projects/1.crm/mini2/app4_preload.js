const express = require('express');
const nunjucks = require('nunjucks');
const csv = require('csv-parser');
const fs = require('fs');

const app = express();
const port = 3000;

// Nunjucks 설정
nunjucks.configure('views', {
    autoescape: true,
    express: app,
});

let data = []; // 데이터를 저장할 배열

// 파일을 읽어 데이터를 메모리에 로드하는 함수
function loadDataIntoMemory() {
    const fileStream = fs.createReadStream('data.csv', 'utf-8');

    fileStream
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
    const searchName = req.query.name || '';
    const itemsPerPage = 10;
    const filteredData = data.filter(row => row.Name.includes(searchName));

    const fieldnames = Object.keys(filteredData[0] || {});
    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, endIndex);

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
    const user = findUserById(userId);

    if (!user) {
        return res.status(404).send('User not found');
    }

    res.render('user_detail3.html', { user });
});

function findUserById(userId) {
    return data.find(row => row['Id'] === userId) || null;
}

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
