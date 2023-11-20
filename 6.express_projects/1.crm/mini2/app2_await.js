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

let data = []; // 데이터를 저장할 배열

// 파일을 읽어 데이터를 메모리에 로드하는 비동기 함수
async function loadDataIntoMemory() {
    return new Promise((resolve, reject) => {
        const fileStream = fs.createReadStream('data.csv', 'utf-8');
        fileStream
            .pipe(csv())
            .on('data', (row) => {
                data.push(row);
            })
            .on('end', () => {
                console.log('Data loaded into memory');
                resolve();
            })
            .on('error', (error) => {
                console.error(error.message);
                reject(error);
            });
    });
}

// 서버 시작 시 파일 데이터를 메모리에 로드
async function startServer() {
    try {
        await loadDataIntoMemory();
        
        app.get('/', (req, res) => {
            const page = parseInt(req.query.page) || 1;
            const itemsPerPage = 10;

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
        });

        app.listen(port, () => {
            console.log(`Server is running at http://localhost:${port}`);
        });
    } catch (error) {
        console.error('Failed to start the server:', error.message);
    }
}

// Start the server
startServer();
