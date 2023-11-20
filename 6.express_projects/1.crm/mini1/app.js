// npm install express nunjucks csv-parser
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

// 방법1.
app.get('/', (req, res) => {
    // 데이터를 저장할 배열
    const data = [];

    // data.csv 파일을 읽어오고 각 행의 데이터를 가공
    // https://nodejs.org/docs/latest-v18.x/api/fs.html#fscreatereadstreampath-options
    fs.createReadStream('data.csv', { encoding: 'utf8' })
        .pipe(csv())
        .on('data', (row) => {
            // 각 열의 키와 값을 정제하여 새로운 객체에 저장
            const cleanRow = {};
            // console.log(row);

            // 각 줄의 항목을 (Object.entries) 를 사용하여 [key, value] 로 반환
            for (const [key, value] of Object.entries(row)) {
                cleanRow[key.trim()] = value.trim();
            }
            // 정제된 데이터를 배열에 추가
            data.push(cleanRow);
            // console.log(data);
        })
        .on('end', () => {
            // 데이터 처리가 완료된 후, 렌더링하여 클라이언트에 응답
            res.render('index.html', { data: data });
        })
        .on('error', (err) => {
            console.error('Error reading the CSV file:', err);
            res.status(500).send('Internal Server Error');
        });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
